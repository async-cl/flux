
package cloudshift;

import cloudshift.Core;
#if nodejs
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

interface SessionMgr implements Part<Dynamic,SessionMgr,ESessionOp> {
  function exists(sessID:String,cb:Bool->Void):Void;
  function stash(sessID:String,key:String,?val:Dynamic):Option<Dynamic>;
  #if nodejs
  function http():HttpServer;
  #end
}

interface SessionClient implements Part<HostPort,SessionClient,ESession> {
  function login(pkt:Dynamic):Future<ESession>;
  function logout():Future<ESession>;
  function signup(pkt:Dynamic):Future<ESession>;
  function sessID():String;
  function stash(key:String,?val:Dynamic):Option<Dynamic>;
}

class Session {

  
  public static var REMOTE = Core.CSROOT+"__r";
  
  #if nodejs
  public static function
  manager(http:HttpServer):SessionMgr {
    return new cloudshift.session.SessionMgrImpl(http);
  }
  #else
  public static function
  client() {
    return new cloudshift.session.SessionClientImpl();
  }
  #end

}