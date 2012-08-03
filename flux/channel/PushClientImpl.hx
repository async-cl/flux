
package flux.channel;

using flux.Core;
import flux.Channel;
import flux.channel.Flow;
import flux.Session;

class PushClientImpl
extends flux.core.ObservableImpl<ConduitEvent>,
implements Conduit {

  var _sessID:String;
  var _host:String;
  var _port:Int;
  var _url:String;
  var _parted:Bool;
  
  public function new() {
    super();
  }

  public function start_(cs:Dynamic,?oc:Outcome<String,Conduit>) {
    if (oc == null)
      oc = Core.outcome();

    _url = cs.endPoint;
    _sessID = cs.sessID;
    _parted = false;
    
    remoteInit(function(ignore) {
        oc.resolve(Right(cast(this,Conduit)));
        poll();
      });
    return oc;
  }

  public function stop_(d:Dynamic,?oc:Outcome<Dynamic,Dynamic>) {
    var soc = Core.outcome();
    trace("doing client stop");
    remoteClose(function(o) {
        _sessID = null;
        _parted = true;
        soc.resolve(o);
      });
    return soc;
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
  pump(dummy:String,userData:Dynamic,chanID:String,meta:Dynamic) {
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
      notify(Incoming(p,_sessID,function(e) { }));
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

  #if nodejs
  public function
  session() {
    return null;
  }

  public function
  subscriptions(sessID:String) {
    return null;
  }
  #end
}