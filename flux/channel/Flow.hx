
package flux.channel;

using flux.Core;
import flux.Session;
import flux.Channel;

#if nodejs
import flux.Http;
#end

interface MessageQ {
  function append(pkt:Dynamic):Void;
  function setFlusher(cb:MessageQ->Bool):Void;
  function sessID():String;
  function deQueue():Array<Dynamic>;
}

interface ConduitSession {
  function append(pkt:Dynamic):Void;
  function flusher(flush:MessageQ->Bool):Void;
  function subscriptions():Hash<Void->Void>;
  function shutDown():Void;
  var lastConnection(default,default):Float;
  var sessID(default,default):String;
}

typedef ConduitClientStart = {
    var endPoint:String;
    var sessID:String;
}

enum ConduitEvent {
  Incoming(pkt:Pkt<Dynamic>,sessID:String,cb:Either<String,String>->Void);
  ConduitSessionExpire(sessID:String);
  ConduitNoConnection(sessID:String);
}

interface Conduit implements Part<Dynamic,String,Conduit,ConduitEvent> {
  function authorize(pipeID:String):Future<Either<String,String>>;
  function leave(pipeID:String):Future<Either<String,String>>;
  function pump(sessID:String,pkt:Dynamic,chanID:String,meta:Dynamic):Void;
  #if nodejs
  function subscriptions(sessID:String):Hash<Void->Void>;
  function session():SessionMgr;
  #end
  
}

enum SinkEvent {
  Authorize(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void);
  ConnectionClose(sessID:String);
  Outgoing(sessID:String,pkt:Dynamic,chan:String,meta:Dynamic);
}

interface Sink implements Part<Conduit,String,Sink,SinkEvent>  {
  function chan<T>(chanID:String):Chan<T>;
  function addConduit(conduit:Conduit):Void ;  
  function chanFromId(chanID:String):Option<Chan<Dynamic>>;
  function authorize<T>(chan:Chan<T>):Outcome<String,Chan<T>>;
  function removeChan<T>(p:Chan<T>):Void;
  function direct<T>(sessID:String):Chan<T>;
}

class Flow {

  public static var PUSH = Core.CSROOT+"p";
  
  #if nodejs
 
  public static function
  sink():Sink {
    return new flux.channel.ServerSinkImpl();
  }

  public static function
  pushConduit(sessionMgr:SessionMgr):Conduit {
    var pl = new flux.channel.PushListenerImpl(sessionMgr);
    sessionMgr.http().handler(new EReg(Flow.PUSH,""),pl.postHandler);
    return pl;
  }

  #end

  public static function
  clientConduit():Conduit {
    return new flux.channel.PushClientImpl();
  }

  public static function
  clientSink():Sink {
    return new flux.channel.ClientSinkImpl();
  }
   


}