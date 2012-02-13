
package cloudshift.session;

import cloudshift.Core;
import cloudshift.Session;
using cloudshift.Mixin;

private class SessionProxy extends haxe.remoting.AsyncProxy<cloudshift.session.SessionMgrImpl> { }

class SessionClientImpl implements Part<HostPort,SessionClient,ESession>,implements SessionClient {
  var _sessID:String;
  var _proxy:SessionProxy;
  var _stash:Hash<Dynamic>;
  
  public var part_:Part_<HostPort,SessionClient,ESession>;

  public function new() {
    part_ = Core.part(this);
  }

  public function
  start_(hp:HostPort) {
    var prm = Core.outcome();
    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("http://"+js.Lib.window.location.host+Session.REMOTE);
    cnx.setErrorHandler( function(err) trace("Error : "+Std.string(err)) );
    _proxy = new SessionProxy(cnx.Auth);
    prm.resolve(Right(cast(this,SessionClient)));
    return prm;
  }

  public function
  stop_(?d:Dynamic):Outcome<String,Dynamic> {
    return null;
  }
  
  function doLogin(p:Future<ESession>,e:ESession) {
    switch(e) {
    case UserOk(sid):
      _sessID = sid;
    default:
    }
    notify(e);
    p.resolve(e);
  }

  public function
  login(pkt:Dynamic):Future<ESession> {
    var p = Core.future();
    _proxy.login(pkt,callback(doLogin,p));
    return p;
  }

  public function
  logout():Future<ESession> {
    var p = Core.future();
    _proxy.logout(_sessID,function(e:ESession) {
        switch(e) {
        case UserRemoved:
          "user removed".info();
        default:
        }
        _sessID = null;
        notify(e);
        p.resolve(e);
      });
    return p;
  }

  public function
  signup(pkt):Future<ESession> {
    var p = Core.future();
    _proxy.signup(pkt,callback(doLogin,p));
    return p;
  }

  public function sessID() { return _sessID; }

  public function
  stash(key:String,?val:Dynamic):Option<Dynamic> {
    if (_stash == null) {
      _stash = new Hash();
    }
    
    if (val == null)
      return _stash.getOption(key);
    
    _stash.set(key,val);
    
    return None;
  }

}