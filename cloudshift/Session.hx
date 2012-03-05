
package cloudshift;

import cloudshift.Core;

#if CS_SERVER
import cloudshift.Http;
#end

enum ESession {
  UserOk(sessID:String);
  UserNoUser;
  UserExists;
  UserRemoved;
}

enum ESessionOp {
  Login(pkt:Dynamic,cb:ESession->Void) ;
  Logout(sessID:String,cb:ESession->Void) ;
  Signup(pkt:Dynamic,cb:ESession->Void) ;
}

#if CS_SERVER

interface SessionMgr implements Part<HttpServer,String,SessionMgr,ESessionOp> {
  function exists(sessID:String,cb:Bool->Void):Void;
  function stash(sessID:String,key:String,?val:Dynamic):Option<Dynamic>;
  function logout(sessID:String,cb:ESession->Void):Void;
  function http():HttpServer;
}

#elseif CS_BROWSER

interface SessionClient implements Part<Dynamic,String,SessionClient,ESession> {
  function login(pkt:Dynamic):Future<ESession>;
  function logout():Future<ESession>;
  function signup(pkt:Dynamic):Future<ESession>;
  function sessID():String;
  function stash(key:String,?val:Dynamic):Option<Dynamic>;
}

#end

class Session {

  
  public static var REMOTE = Core.CSROOT+"__r";
  
  #if CS_SERVER
  public static function
  manager():SessionMgr {
    return new cloudshift.session.SessionMgrImpl();
  }
  #elseif CS_BROWSER
  public static function
  client() {
    return new cloudshift.session.SessionClientImpl();
  }
  #end

}