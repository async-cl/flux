
/**
   Author: Ritchie Turner, cloudshift.cl 2012
   Licence: MIT
**/

package cloudshift;

import cloudshift.Core;
#if CS_SERVER
import cloudshift.Http;
#end

import cloudshift.Session;
import cloudshift.Flow;

typedef Chan<T> = Pipe<T>;

interface ChannelProvider {
  function channel<T>(chanID:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}

#if CS_SERVER

enum ChannelEvent {
  EAuthorize(sessID:String,chan:Chan<Dynamic>,reply:Either<String,String>->Void);
  ESession(event:ESessionOp);
}

interface ChannelServer
           implements ChannelProvider,
           implements Part<Dynamic,String,ChannelServer,ChannelEvent> {
  
  function addHttpServer(http:HttpServer):ChannelServer;
  function addHostPort(host:String,port:Int):ChannelServer;
  function addSessionMgr(sessionMgr:SessionMgr):ChannelServer;
  function addChannelAuth(cb:String->Chan<Dynamic>->(Either<String,String>->Void)->Void):ChannelServer;
  function addSessionAuth(cb:ESessionOp->Void):ChannelServer;
  function session():SessionMgr;
  function channel<T>(chanID:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}

#end

#if CS_BROWSER

enum ChannelClientEvent {
  
}

enum ChannelClientError {
  UserLoggedIn;
  CantStartSessionClient;
}

interface ChannelClient
      implements ChannelProvider,
      implements Part<String,ChannelClientError,ChannelClient,ESession> {

  function unsub(chan:Chan<Dynamic>):Void;
  function channel<T>(id:String):Outcome<String,Chan<T>>;
  function direct<T>(sessID:String):Outcome<String,Chan<T>>;
}

#end

class Channel {

  #if CS_SERVER
  public static function
  server():ChannelServer {
    return new cloudshift.channel.TChannelServer();
  }
  #end
  
  #if CS_BROWSER
  public static function
  client():ChannelClient {
    return new cloudshift.channel.TChannelClient();
  }
  #end
}