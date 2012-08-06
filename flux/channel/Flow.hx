
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
  ConduitSessionExpire(sessID:String);
  ConduitNoConnection(sessID:String);
}

interface Conduit
implements Startable<Dynamic,String,Conduit>,
implements Stoppable<Dynamic,Dynamic,Dynamic>,
implements ObservableDelegate<ConduitEvent> {

  function addSink(s:Sink):Void;
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

interface Sink
implements Startable<Conduit,String,Sink>,
implements Stoppable<Dynamic,Dynamic,Dynamic>,
implements ObservableDelegate<SinkEvent>,
implements Infoable {

  function chan<T>(chanID:String):Chan<T>;
  function direct<T>(sessID:String):Chan<T>;
  function chanFromId(chanID:String):Option<Chan<Dynamic>>;
  function authorize<T>(chan:Chan<T>):Outcome<String,Chan<T>>;
  function removeChan<T>(p:Chan<T>):Void;

  function message(chan:Chan<Dynamic>,pkt:Pkt<Dynamic>):Void;  
  #if nodejs
  function subscribe(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void):Void;
  function unsubscribe(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void):Void;
  #end
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