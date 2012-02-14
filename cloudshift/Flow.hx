
package cloudshift;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Session;

#if nodejs
import cloudshift.Http;
import cloudshift.flow.InternalApi;
#end

typedef TMeta = {
    var ch:String;
    var op:String;
    var um:Dynamic; /* user meta data */
}

typedef Pkt<T> = {
    var s:String; // session ID
    var p:T;        // payload
    var m:TMeta;    // meta
}

typedef ConduitClientStart = {
    var host:String;
    var port:Int;
    var sessID:String;
}

enum ConduitEvent {
  Drain(pkt:Pkt<Dynamic>,sessID:String,cb:Either<String,String>->Void);
  ConduitSessionExpire(sessID:String);
  ConduitNoConnection(sessID:String);
}

#if nodejs
interface Conduit implements Part<Dynamic,Conduit,ConduitEvent> {
#else
  interface Conduit implements Part<ConduitClientStart,Conduit,ConduitEvent> {
#end
  function authorize(pipeID:String):Future<Either<String,String>>;
    function leave(pipeID:String):Future<Either<String,String>>;
  function pump(sessID:String,pkt:Dynamic,chanID:String,meta:Dynamic):Void;
  #if nodejs
  function subscriptions(sessID:String):Hash<Void->Void>;
  function session():SessionMgr;
  #end
}

enum SinkEvent {
  Authorize(sessID:String,pipe:Pipe<Dynamic>,cb:Either<String,String>->Void);
  ConnectionClose(sessID:String);
}

interface Sink implements Part<Conduit,Sink,SinkEvent>  {
  function pipe<T>(chanID:String):Pipe<T>;
  function addConduit(conduit:Conduit):Void ;  
  function pipeFromId(chanID:String):Option<Pipe<Dynamic>>;
  function authorize<T>(pipe:Pipe<T>):Future<Either<String,Pipe<T>>>;
  function removePipe<T>(p:Pipe<T>):Void;
  function direct<T>(sessID:String):Pipe<T>;
}

interface Pipe<T> { //implements Part<Dynamic,Pipe<T>,Pkt<T>> {
    // internal use only
  var _fill:Dynamic->String->Dynamic->Void; 
  function _defaultFill<T>(o:Dynamic,chanID:String,meta:Dynamic):Void;

  // public
  function fill(o:T,?meta:Dynamic):Void;
  function drain(cb:T->Void,?info:Dynamic):Void->Void;
  function drainPkt(cb:Pkt<T>->Void,?info:Dynamic):Void->Void;
  function filter(cb:T->Null<T>):Void->Void;
  function filterPkt(cb:Pkt<T>->Null<Pkt<T>>):Void->Void;
  function pid():String; 
  function drains():Array<Dynamic>;
  function removeAllDrains():Void;
  function divert<P>(chan:Pipe<P>,?map:T->P):Void->Void;
  function peek(cb:EOperation->Void):Void;
}

typedef QuickFlow = {
    var conduit:Conduit;
    var session:SessionMgr;
    var sink:Sink;
}
  
class Flow {

  public static var PUSH = Core.CSROOT+"p";
  
  #if nodejs
 
  public static function
  sink(sessionMgr:SessionMgr):Sink {
    return new cloudshift.flow.ServerSinkImpl(sessionMgr);
  }

  public static function
  pushConduit(sessionMgr:SessionMgr):Conduit {
    var pl = new cloudshift.flow.PushListenerImpl(sessionMgr);
    sessionMgr.http().handler(new EReg(Flow.PUSH,""),pl.postHandler);
    return pl;
  }

  
  public static function
  quickFlow() {
    return new cloudshift.flow.QuickFlowImpl();
  }
 
  
  #else

  public static function
  pushConduit():Conduit {
    return new cloudshift.flow.PushClientImpl();
  }

  public static function
  sink(sess:SessionClient):Sink {
    return new cloudshift.flow.ClientSinkImpl(sess);
  }
   
  #end

  public static function
  pipeID(pkt:Pkt<Dynamic>) {
    return pkt.m.ch;
  }
    
  public static function
  operation(pkt:Pkt<Dynamic>) {
    return pkt.m.op;
  }

  public static function
  payload(pkt:Pkt<Dynamic>) {
    return pkt.p;
  }

  
  public static function
  setPayload(pkt:Pkt<Dynamic>,pl:Dynamic) {
    pkt.p = pl;
  }
  
  public static function
  sessID(pkt:Pkt<Dynamic>) {
    return pkt.s;
  }

  public static function oldmeta(pkt:Pkt<Dynamic>) {
    return pkt.m;
  }

  public static function meta(pkt:Pkt<Dynamic>):Dynamic {
    return pkt.m.um;
  }

  public static function
  createPkt<T>(userData:T,sessID:String,chan:String,op="m",meta:Dynamic=null):Pkt<T> {
    return { p:userData,s:sessID,m:{ch:chan,op:op,um:meta} };
  }


}