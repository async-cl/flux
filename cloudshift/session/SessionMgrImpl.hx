
package cloudshift.session;

import cloudshift.Core;
import cloudshift.Session;
#if nodejs
import cloudshift.Http;
import cloudshift.Remote;
#end

using cloudshift.Mixin;

class SessionMgrImpl implements Part<Dynamic,SessionMgr,ESessionOp>, implements SessionMgr {

  static var sessions = new Hash<Hash<Dynamic>>();

  #if nodejs
  public var part_:Part_<Dynamic,SessionMgr,ESessionOp>;
  
  var _http:HttpServer;

  public function new(http:HttpServer) {
    part_ = Core.part(this);
    _http = http;
    var remote = Remote.provider("Auth",this);
    
    _http.handler(new EReg(Session.REMOTE,""),remote.httpHandler);
  }

  public function http() {
    return _http;
  }

  #end

  public function start_(d:Dynamic) {
    trace("in session start");
    var prm = Core.outcome();
    prm.resolve(Right(cast(this,SessionMgr)));
    return prm;
  }

  public function
  stop_(?d:Dynamic):Outcome<String,Dynamic> {
    return null;
  }
  
  public function
  login(pkt:Dynamic,cb:ESession->Void):Void {
    notify(Login(pkt,function(status:ESession) {
          respond(status,cb);
        }));
  }

  public function
  signup(pkt:Dynamic,cb:ESession->Void):Void {
    notify(Signup(pkt,function(status:ESession) {
          respond(status,cb);
        }));
  }

  public function
  logout(sessID:String,cb:ESession->Void):Void {
    notify(Logout(sessID,function(status:ESession) {
          switch(status) {
          case UserRemoved:
            if (sessions.exists(sessID))
              sessions.remove(sessID);
          default:
          }
          cb(status);
        }));
  }
       
  public function
  exists(sessID:String,cb:Bool->Void):Void {
    cb(sessions.exists(sessID));
  }

  function
  respond(status:ESession,cb:ESession->Void) {
    switch(status) {
    case UserOk(sessID):
      if (!sessions.exists(sessID)) { // stash may have created it already
        Core.info("creating sess stash for "+sessID);
        sessions.set(sessID,new Hash());
      }
    case UserExists:
    case UserRemoved:
    case UserNoUser:
    }
    cb(status);
  }

  public function
  stash(sessID:String,key:String,?val:Dynamic):Option<Dynamic> {
    var s = sessions.get(sessID); 

    if (s == null) {
      s = new Hash();
      sessions.set(sessID,s);
    }
    
    if (val == null)
      return s.getOption(key);
    
    s.set(key,val);
    
    return None;
  }
  
}