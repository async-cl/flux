
package flux.session;

import flux.Core;
import flux.Session;
using flux.Mixin;

private class SessionProxy extends haxe.remoting.AsyncProxy<flux.session.SessionMgrProxy> { }

class SessionClientImpl implements Part<SessionStart,String,SessionClient,ESession>,implements SessionClient {
  var _sessID:String;
  var _proxy:SessionProxy;
  var _stash:Hash<Dynamic>;
  var _endPoint:String;
  
  public var part_:Part_<SessionStart,String,SessionClient,ESession>;

  public function new() {
    part_ = Core.part(this);
  }

  public function
  start_(d:SessionStart,?oc:Outcome<String,SessionClient>) {
    if (oc == null)
      oc = Core.outcome();

    if (d.endPoint == null)
      Core.error("Session must be started with an endPoint (url)");

    _endPoint = d.endPoint;
    
    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(_endPoint + Session.REMOTE);
    cnx.setErrorHandler( function(err) trace("Error : "+Std.string(err)) );
    _proxy = new SessionProxy(cnx.Auth);
    oc.resolve(Right(cast this));
    return oc;
  }

  function doLogin(p:Outcome<String,String>,e:ESession) {
    switch(e) {
    case UserOk(sid):
      _sessID = sid;
      trace("set sessID ok");
      p.resolve(Right(_sessID));
    default:
      p.resolve(Left(Std.string(e)));
    }
    notify(e);
  }

  public function
  login(pkt:Dynamic):Outcome<String,String> {
    var p = Core.future();
    _proxy.login(pkt,callback(doLogin,p));
    return p;
  }

  public function
  signup(pkt):Outcome<String,String> {
    var p = Core.future();
    _proxy.signup(pkt,callback(doLogin,p));
    return p;
  }

  public function
  logout():Outcome<String,String> {
    var p = Core.future();
    _proxy.logout(_sessID,function(e:ESession) {
        switch(e) {
        case UserRemoved:
          p.resolve(Right(""));
        default:
          p.resolve(Left("Can't remove user:"+Std.string(e)));
        }
        _sessID = null;
        notify(e);
      });
    return p;
  }
  
  public function sessID() { return _sessID; }
  public function endPoint() { return _endPoint ; }
}