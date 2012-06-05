
package cloudshift.channel;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Session;
import cloudshift.Channel;

#if nodejs
import cloudshift.Http;
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

#if CS_SERVER
interface Conduit implements Part<Dynamic,String,Conduit,ConduitEvent> {
#elseif CS_BROWSER
  interface Conduit implements Part<ConduitClientStart,String,Conduit,ConduitEvent> {
#end
  function authorize(pipeID:String):Future<Either<String,String>>;
    function leave(pipeID:String):Future<Either<String,String>>;
  function pump(sessID:String,pkt:Dynamic,chanID:String,meta:Dynamic):Void;
  #if CS_SERVER
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
  
  #if CS_SERVER
 
  public static function
  sink():Sink {
    return new cloudshift.channel.ServerSinkImpl();
  }

  public static function
  pushConduit(sessionMgr:SessionMgr):Conduit {
    var pl = new cloudshift.channel.PushListenerImpl(sessionMgr);
    sessionMgr.http().handler(new EReg(Flow.PUSH,""),pl.postHandler);
    return pl;
  }

  #elseif CS_BROWSER

  public static function
  pushConduit():Conduit {
    return new cloudshift.channel.PushClientImpl();
  }

  public static function
  sink():Sink {
    return new cloudshift.channel.ClientSinkImpl();
  }
   
  #end



}