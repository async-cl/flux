
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.channel.Flow;
import cloudshift.Session;
using cloudshift.Mixin;

class PushClientImpl implements Conduit {
  public var part_:Part_<ConduitClientStart,String,Conduit,ConduitEvent>;
  var _host:String;
  var _port:Int;
  var _url:String;
  var _sessID:String;
  var _parted:Bool;
  
  public function new() {
    part_ = Core.part(this);
  }

  public function start_(cs:ConduitClientStart,?oc:Outcome<String,Conduit>) {
    if (oc == null)
      oc = Core.outcome();
    
    _url = "http://"+js.Lib.window.location.host;
    _sessID = cs.sessID;
    _parted = false;
    
    remoteInit(function(ignore) {
        stop_(function(d) {
            var soc = Core.outcome();
            remoteClose(function(o) {
                soc.resolve(o);
              });
            return soc;
          });

        oc.resolve(Right(cast(this,Conduit)));
        poll();
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
      ud = Channel.createPkt(userData,_sessID,chanID,"m",meta),
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
      ud = Channel.createPkt(userData,_sessID,chanID,cmd),
      pl = haxe.Serializer.run(ud),
      req = new haxe.Http(_url+Flow.PUSH);

    req.onData = function(o:String) {
        cb(haxe.Unserializer.run(o));
    }
    
    req.setParameter("z",pl);
    req.request(true);
  }
}