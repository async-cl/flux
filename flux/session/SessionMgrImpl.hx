
package flux.session;

using flux.Core;
import flux.Session;
import flux.Http;
import flux.Remote;

import flux.session.SessionMgrProxy;

class SessionMgrImpl
extends SessionMgrProxy,
implements SessionMgr {

  static var sessions = new Hash<Int>();
  var _http:HttpServer;
  var _ob:Observable<ESessionOp>;

  public function new() {
    _ob = Core.event();
  }
  
  public function start_(http:HttpServer,?oc:Outcome<String,SessionMgr>) {
    if (oc == null) 
      oc = Core.outcome();

    _http = http;
    var remote = Remote.provider("Auth",this);
    
    _http.handler(new EReg(Session.REMOTE,""),remote.httpHandler);
    
    oc.resolve(Right(untyped this));
    return oc;
  }

  public function http() {
    return _http;
  }


  // Observable Interface

  public function notify(o:ESessionOp) {
    _ob.notify(o);
  }
  
  public function observe(cb:ESessionOp->Void,?info:Dynamic) {
    return _ob.observe(cb,info);
  }
  
  public function peers() {
    return _ob.peers();
  }
  
  public function removePeers() {
    _ob.removePeers();
  }
  
  public function peek(cb:EOperation->Void) {
    _ob.peek(cb);
  }
  
  // proxy interface ......
  
  override public function
  login(pkt:Dynamic,cb:ESession->Void):Void {
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
            if (sessions.exists(sessID)) {
              trace("removing sessID:"+sessID);
              sessions.remove(sessID);

            }
          default:
          }
          cb(status);
        }));
  }

  // public interface ...

  public function authorize(cb:ESessionOp->Void):Void->Void {
    return observe(cb);
  }
  
  public function
  exists(sessID:String,cb:Bool->Void):Void {
    cb(sessions.exists(sessID));
  }

  function
  respond(status:ESession,cb:ESession->Void) {
    switch(status) {
    case UserOk(sessID):
      if (!sessions.exists(sessID)) { 
        sessions.set(sessID,1);
        trace("Adding sessionID:"+sessID);
      }
    case UserExists:
    case UserRemoved:
    case UserNoUser:
    }
    cb(status);
  }

}