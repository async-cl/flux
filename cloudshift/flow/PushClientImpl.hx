
package cloudshift.flow;

import cloudshift.Core;
import cloudshift.Flow;
import cloudshift.Session;
import cloudshift.flow.InternalApi;
import cloudshift.core.ObservableImpl;
using cloudshift.Mixin;
using cloudshift.Flow;

class PushClientImpl implements Conduit {
  public var part_:Part_<ConduitClientStart,Conduit,ConduitEvent>;
  var _host:String;
  var _port:Int;
  var _url:String;
  var _sessID:String;
  var _parted:Bool;
  
  public function new() {
    part_ = Core.part(this);
  }

  public function start_(cs:ConduitClientStart) {
    var prm = Core.outcome();
    _url = "http://"+cs.host+":"+cs.port;
    _sessID = cs.sessID;
    _parted = false;
    remoteInit(function(ignore) {
        prm.resolve(Right(cast(this,Conduit)));
        poll();
      });
    return prm;
  }

  public function stop_(?d:Dynamic) {
    var oc = Core.outcome();
    remoteClose(function(o) {
        oc.resolve(o);
      });

    return oc;
  }
  
  public function
  authorize(pipeID:String):Future<Either<String,String>> {
    var p = Core.future();
    remoteSub(pipeID,function(e) {
        p.resolve(Right(e));
      });
    return p;
  }

  public function
  leave(pipeID:String):Future<Either<String,String>> {
    var prm = Core.future();
    remoteUnSub(pipeID,function(o) {
        prm.resolve(Right(""));
      });
    return prm;
  }

  public function
  pump(sessID:String,userData:Dynamic,chanID:String,meta:Dynamic) {
    var
      ud = Flow.createPkt(userData,_sessID,chanID,"m",meta),
      pl = haxe.Serializer.run(ud),
      req = new haxe.Http(_url+Flow.PUSH);

    req.onData = function(d:String) {

    }
    req.setParameter("z",pl);
    req.request(true);
  }

  public function
  sessID() {
    return _sessID;
  }
  
  public function
  flush(sessID:String,pkts:Array<Dynamic>) {
    return true;
  }
  
  function
  poll() {
    if (!_parted) {
      remoteOpen(function(data:Dynamic) {
          if (data != null) {
            handlePoll(data);
          }
        });
    }
  }

  function
  handlePoll(pkts:Array<Pkt<Dynamic>>) {
    for (p in pkts) {
      notify(Drain(p,_sessID,function(e) { }));
    }
    poll();
  }

  inline function
  remoteOpen(cb) {
    client("o",{},"",cb);
  }
  
  inline function
  remoteSub(chanID:String,cb:Dynamic->Void) {
    client("s",{},chanID,cb);
  }

  function
  remoteUnSub(chanID:String,cb:Dynamic->Void) {
    client("u",{},chanID,function(o) {
        trace("Remove unsub:"+o);
        cb(o);
      });
  }

  inline function
  remoteInit(cb:Dynamic->Void) {
    client("i",{},"",cb);
  }

  inline function
  remoteClose(cb:Dynamic->Void) {
    client("c",{},"",cb);
  }
  
  function
  client(cmd:String,userData:Dynamic,chanID:String,cb:Dynamic->Void) {
    var
      ud = Flow.createPkt(userData,_sessID,chanID,cmd),
      pl = haxe.Serializer.run(ud),
      req = new haxe.Http(_url+Flow.PUSH);

    req.onData = function(o:String) {
        cb(haxe.Unserializer.run(o));
    }
    
    req.setParameter("z",pl);
    req.request(true);
  }
}