
package flux;

import flux.Core;

#if nodejs
import flux.Http;
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

#if nodejs

interface SessionMgr
implements Startable<HttpServer,String,SessionMgr>,
implements Observable<ESessionOp> {
  function authorize(cb:ESessionOp->Void):Void->Void;
  function exists(sessID:String,cb:Bool->Void):Void;
  function logout(sessID:String,cb:ESession->Void):Void;
  function http():HttpServer;
}

#end

typedef SessionStart = {endPoint:String};

interface SessionClient
implements Startable<SessionStart,String,SessionClient>,
implements Observable<ESession> {
  /**
     ErrMsg on Left
     SessionID on Right
   */
  function login(pkt:Dynamic):Outcome<String,String>;
  function logout():Outcome<String,String>;
  function signup(pkt:Dynamic):Outcome<String,String>;
  function sessID():String;
  function endPoint():String;
}


class Session {

  
  public static var REMOTE = Core.CSROOT+"__r";
  
  #if nodejs
  public static function
  manager():SessionMgr {
    return new flux.session.SessionMgrImpl();
  }
  #end
  
  public static function
  client() {
    return new flux.session.SessionClientImpl();
  }

}