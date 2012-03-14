
package cloudshift.session;

import cloudshift.Core;
import cloudshift.Session;
import cloudshift.Http;
import cloudshift.Remote;

using cloudshift.Mixin;

import cloudshift.session.SessionMgrProxy;

class SessionMgrImpl extends SessionMgrProxy,
implements Part<HttpServer,String,SessionMgr,ESessionOp>, implements SessionMgr {

  static var sessions = new Hash<Hash<Dynamic>>();
  public var part_:Part_<HttpServer,String,SessionMgr,ESessionOp>;
  var _http:HttpServer;

  public function new() {
    part_ = Core.part(this);
  }
  
  public function start_(http:HttpServer,?oc:Outcome<String,SessionMgr>) {
    if (oc == null) 
      oc = Core.outcome();

    _http = http;
    var remote = Remote.provider("Auth",this);
    
    _http.handler(new EReg(Session.REMOTE,""),remote.httpHandler);
    
    oc.resolve(Right(cast(this,SessionMgr)));
    return oc;
  }

  public function http() {
    return _http;
  }

  override public function
  login(pkt:Dynamic,cb:ESession->Void):Void {
    trace("trying login:"+ pkt.stringify());
    notify(Login(pkt,function(status:ESession) {
          respond(status,cb);
        }));
  }

  override public function
  signup(pkt:Dynamic,cb:ESession->Void):Void {
    notify(Signup(pkt,function(status:ESession) {
          respond(status,cb);
        }));
  }

  override public function
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