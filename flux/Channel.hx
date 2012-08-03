
/**
   Author: Ritchie Turner, async.cl 2012
   Licence: MIT
**/

package flux;

import flux.Core;
import flux.Session;

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

interface Chan<T> { 
    // internal use only
  var _fill:Dynamic->String->Dynamic->Void; 
  function _defaultFill<T>(o:Dynamic,chanID:String,meta:Dynamic):Void;

  // public
  function pub(o:T,?meta:Dynamic):Void;
  function sub(cb:T->Void,?info:Dynamic):Void->Void;
  function subPkt(cb:Pkt<T>->Void,?info:Dynamic):Void->Void;
  function filter(cb:T->Null<T>):Void->Void;
  function filterPkt(cb:Pkt<T>->Null<Pkt<T>>):Void->Void;
  function pid():String; 
  function subs():Array<Dynamic>;
  function removeAllSubs():Void;
  function route<P>(chan:Chan<P>,?map:T->P):Void->Void;
  function peek(cb:EOperation->Void):Void;
}

interface ChannelProvider {
  function channel<T>(chanID:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}

#if nodejs

enum ChannelEvent {
  EAuthorize(sessID:String,chan:Chan<Dynamic>,reply:Either<String,String>->Void);
  ESession(event:ESessionOp);
}

//typedef ChannelServerPrms = {http:HttpServer,sessMgr:SessionMgr};

interface ChannelServer
           implements ChannelProvider,
           implements Startable<SessionMgr,String,ChannelServer>,
           implements Observable<ChannelEvent> {
  
  function addChannelAuth(cb:String->Chan<Dynamic>->(Either<String,String>->Void)->Void):ChannelServer;
  function channel<T>(chanID:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}

#end

enum ChannelClientEvent {
  
}

enum ChannelClientError {
  UserLoggedIn;
  CantStartSessionClient;
}

interface ChannelClient
    implements ChannelProvider,
    implements Startable<SessionClient,ChannelClientError,ChannelClient>,
    implements Stoppable<Dynamic,Dynamic,Dynamic>,
    implements Observable<ESession> {

  //  function unsub(chan:Chan<Dynamic>):Void;
  function channel<T>(id:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}


class Channel {

  #if nodejs
  public static function
  server():ChannelServer {
    return new flux.channel.TChannelServer();
  }
  #end
  
  public static function
  client():ChannelClient {
    return new flux.channel.TChannelClient();
  }

  public static function
  chanID(pkt:Pkt<Dynamic>) {
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

  public static function meta(pkt:Pkt<Dynamic>):Dynamic {
    return pkt.m.um;
  }

  public static function
  createPkt<T>(userData:T,sessID:String,chan:String,op="m",meta:Dynamic=null):Pkt<T> {
    return { p:userData,s:sessID,m:{ch:chan,op:op,um:meta} };
  }


}