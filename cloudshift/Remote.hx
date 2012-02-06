package cloudshift;

import cloudshift.Core;
import js.Node;

interface RemoteProvider {
  function addObject(s:String,obj:Dynamic,?recursive:Bool):Void;
  function httpHandler(re:EReg,req:NodeHttpServerReq,resp:NodeHttpServerResp):Void;
}

class Remote {

  public static function
  provider(remoteID:String,obj:Dynamic):RemoteProvider {
    var r = new cloudshift.http.RemoteImpl();
    r.addObject(remoteID,obj);
    return r;
  }

}