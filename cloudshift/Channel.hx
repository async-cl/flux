
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


#if CS_SERVER

enum ChannelEvent {
  EAuthorize(sessID:String,chan:Chan<Dynamic>,reply:Either<String,String>->Void);
  ESession(event:ESessionOp);
}

interface ChannelServer implements Part<Dynamic,String,ChannelServer,ChannelEvent> {
  function addHttpServer(http:HttpServer):ChannelServer;
  function addHostPort(host:String,port:Int):ChannelServer;
  function addSessionMgr(sessionMgr:SessionMgr):ChannelServer;
  function addChannelAuth(cb:String->Chan<Dynamic>->(Either<String,String>->Void)->Void):ChannelServer;
  function addSessionAuth(cb:ESessionOp->Void):ChannelServer;
  function channel<T>(chanID:String):Chan<T>;
}

#end

#if CS_BROWSER

enum ChannelClientEvent {
  
}

enum ChannelClientError {
  UserLoggedIn;
  CantStartSessionClient;
}

interface ChannelClient implements Part<Dynamic,ChannelClientError,ChannelClient,ESession> {
  function channel<T>(id:String):Outcome<String,Chan<T>>;
  function logout():Void;
  function unsub(chan:Chan<Dynamic>):Void;
  
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