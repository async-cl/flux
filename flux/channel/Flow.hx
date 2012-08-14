

/*
  Flow is the internal implementation of Channels, the Channels top level module
  provides a higher level interface to these facilities
*/

package flux.channel;

using flux.Core;
import flux.Session;
import flux.Channel;

#if nodejs

import flux.Http;

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

#end

typedef ConduitClientStart = {
    var endPoint:String;
    var sessID:String;
}

enum ConduitEvent {
  ConduitSessionExpire(sessID:String);
  ConduitNoConnection(sessID:String);
}

/*
  A Conduit is the network transport for packets, and manages all current connections.
*/
interface Conduit
#if nodejs
implements Startable<Dynamic,String,Conduit>,
#else
implements Startable<ConduitClientStart,String,Conduit>,
#end
implements Stoppable<Dynamic,Dynamic,Dynamic>,
implements ObservableDelegate<ConduitEvent> {
  // a sink to whom incoming packets are sent
  function addSink(s:Sink):Void;

  // send a packet out over the conduit to a given session
  function outgoing(sessID:String,pkt:Dynamic,chanID:String,meta:Dynamic):Void;
  
  function authorize(pipeID:String):Future<Either<String,String>>;
  function leave(pipeID:String):Future<Either<String,String>>;

#if nodejs
  function subscriptions(sessID:String):Hash<Void->Void>;
  function session():SessionMgr;
#end
  
}

enum SinkEvent {
  Authorize(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void);
  ConnectionClose(sessID:String);
}

/*
  Channels are created from sinks, and Sinks hold collections of channels.
*/
interface Sink
implements Startable<Conduit,String,Sink>,
implements Stoppable<Dynamic,Dynamic,Dynamic>,
implements ObservableDelegate<SinkEvent> {

  /* create a public channel */
  function chan<T>(chanID:String):Chan<T>;
  /* create a private channel */
  function direct<T>(sessID:String):Chan<T>;
  /* subscription and authorisation */
  function authorize<T>(chan:Chan<T>):Outcome<String,Chan<T>>;
  function removeChan<T>(p:Chan<T>):Void;
  function chanFromId(chanID:String):Option<Chan<Dynamic>>;
  /* incoming message from conduit */
  function incoming(chan:Chan<Dynamic>,pkt:Pkt<Dynamic>):Void;  

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