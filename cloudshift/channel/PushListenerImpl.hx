
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Session;

import cloudshift.Channel;

import cloudshift.channel.Flow;
import cloudshift.Http;
import cloudshift.http.HttpImpl;
import cloudshift.core.ObservableImpl;

using cloudshift.Channel;
using cloudshift.Mixin;

import js.Node;

using StringTools;

typedef Subscription<T> = T->Dynamic->Void;
private typedef Callback<T> = {fn:Array<Dynamic>->Void};

class PushListenerImpl implements Conduit {
  static inline var SESSION_EXPIRE = 5*60*1000;
  static var _sessions = new Hash<ConduitSession>();
  
  public static inline var ERROR = 500;
  public static inline var OK = 200;
  public var part_:Part_<Dynamic,String,Conduit,ConduitEvent>;
  
  var _callbacks:Hash<Array<Callback<Dynamic>>>;
  var _sessMgr:SessionMgr;
  
  public function new(sessionMgr:SessionMgr) {
    part_ = Core.part(this);
    _callbacks = new Hash();
    _sessMgr = sessionMgr;

    Node.setInterval(function() {
        var now = Date.now().getTime();
        _sessions.values().foreach(function(s) {
            var sessID = s.sessID;
            switch(_callbacks.getOption(sessID)) {
            case Some(cbs):
              var goodCbs = cbs.filter(function(cb) return cb.fn != null);            
              if (goodCbs.length > 0) {
                if (now - s.lastConnection > SESSION_EXPIRE) {
                  trace("expiring session");
                  removeSession(s);
                  notify(ConduitSessionExpire(sessID));
                }
              }

            case None:
            }
          });
      },SESSION_EXPIRE,null);
  }

  public function start_(d:Dynamic,?oc:Outcome<String,Conduit>) {
     if (oc == null)
      oc = Core.outcome();
     
     oc.resolve(Right(cast this));
    return oc;
  }

  function removeSession(session) {
    if (session != null) {
      Core.info("removing session");
      _callbacks.remove(session.sessID);
      _sessions.remove(session.sessID); // values() copies into array so this removal should be fine
      session.shutDown();
      _sessMgr.logout(session.sessID,function(el) {
          trace("removed from session manager");
        });
    }
  }

  public function
  postHandler(re:EReg,req:NodeHttpServerReq,res:NodeHttpServerResp) {
    HttpImpl.parseFields(req,function(flds,files) {
        var
          serialized = flds.get("z"),
          pkt:Pkt<Dynamic> = haxe.Unserializer.run(serialized),
          sessID = pkt.sessID();
        
        _sessMgr.exists(sessID,function(exists) {
            if (!exists) {
              write(res,ERROR,"no session");
              return;
            }
            
            var      
              op = pkt.operation();
            
            if (op == null) {
              write(res,ERROR,"op can't be null");
              return;
            }
            
            switch(op) {
            case "i": // init
              var pushSession = new PushSessionImpl(sessID);
              _sessions.set(sessID,pushSession);
              pushSession.flusher(flush);
              write(res,OK,"init good");
            case "o": // open
              var s = _sessions.get(sessID);
              if (s != null) {
                s.lastConnection = Date.now().getTime();
                gatherCallbacks(req,res,sessID);
                if (req.connection.listeners('close').length == 1){
                  req.connection.once('close',function() {
                      var cbs = _callbacks.get(sessID);
                      while (cbs != null && cbs.length > 0) {
                        var cb = cbs.shift();
                        cb.fn([]);
                        cb.fn = null;
                      }
                      removeSession(_sessions.get(sessID));
                      notify(ConduitNoConnection(sessID));
                    });
                }
              }
            case "c": // close
              close(sessID).deliver(function(o) {
                  write(res,OK,o);
                });
              
            default:
              notify(Drain(pkt,sessID,function(sr:Either<String,String>) {
                    write(res,OK,sr);
                  }));          
            }
          });
      });
    
  }

  /**
     Doesn't have use on the server, is added for client interface
  **/
  public function
  sessID() {
    throw "sessID shouldn't be called on server";
    return null;
  }
  
  public function
  pump(sessID:String,payload:Dynamic,chanID:String,meta:Dynamic) {
    _sessions.get(sessID).append(Channel.createPkt(payload,sessID,chanID,meta));
  }

  public function
  direct(sessID:String,payload:Dynamic) {
    _sessions.get(sessID).append(Channel.createPkt(payload,sessID,Core.CSROOT+"direct"));
  }

  public function
  subscriptions(sessID:String):Hash<Void->Void> {
    var sess = _sessions.get(sessID);
    if (sess != null)
      return _sessions.get(sessID).subscriptions();
    return null;
  }

  public function
  authorize(pipeID:String):Outcome<String,String> {
    var oc = Core.outcome();
    oc.resolve(Right(""));
    return oc;
  }

  public function
  leave(pipeID:String):Future<Either<String,String>> {
    var oc = Core.future();
    oc.resolve(Right("todo"));
    return oc;
  }
    
  public function session() {
    return _sessMgr;
  }
  
  public function close(sessID:String):Future<Either<String,String>> {
    var prm = Core.future();
    flushCallbacks(sessID);
    var s = _sessions.get(sessID) ;
    if (s != null) {
      removeSession(s);
    }
    prm.resolve(Right(""));
    return prm;
  }
  
  public function
  flush(out:MessageQ):Bool {
    var callbacks = _callbacks.get(out.sessID());
    if (callbacks != null && callbacks.length > 0) {
      var cb = callbacks.shift();
      if (cb.fn != null) { // fn can be invalidated if a close is received
        cb.fn(out.deQueue());
        return true;
      }
    }
    return false;
  }
 
  /** This takes a users connection (res) and stores it as a closure until at
      least one message is ready to be sent back - an array is always sent.
      The PushChannel impl will eventually use it or flush it.
   */
  function
  gatherCallbacks(req:NodeHttpServerReq,res:NodeHttpServerResp,sessID:String) {
    var
      cbs = _callbacks.get(sessID);
    
    if(cbs == null) {
      cbs = [];
      this._callbacks.set(sessID,cbs);
    }

    var cb = {
      fn : function(pkts) {
          write(res,OK,pkts);
      }
    };

    cbs.push(cb);
  }

  public static function
  write(res:js.Node.NodeHttpServerResp,errno:Int,o:Dynamic) {
    var 
      s = haxe.Serializer.run(o);
    res.setHeader("Content-Length",s.length);
    res.setHeader("Content-Type","text/plain");
    res.setHeader("Connection","Keep-Alive");
    res.statusCode = errno;
    res.end(s);
  }
  
  function
  flushCallbacks(sessID) {
    var callbacks = _callbacks.get(sessID);
    if (callbacks != null) {
      while (callbacks.length > 0) {
        var cb = callbacks.shift();
        if (cb.fn != null)
          cb.fn([]);
      }
    }
  }

}
