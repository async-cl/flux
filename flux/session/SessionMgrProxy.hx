
package flux.session;

import flux.Session;

class SessionMgrProxy {
  public function
  login(pkt:Dynamic,cb:ESession->Void):Void {}

  public function
  signup(pkt:Dynamic,cb:ESession->Void):Void {}

  public function
  logout(sessID:String,cb:ESession->Void):Void {}
}



