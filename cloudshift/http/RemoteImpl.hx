
package cloudshift.http;

import cloudshift.Http;
import cloudshift.Remote;
import cloudshift.core.Context;
import cloudshift.http.HttpImpl;
import js.Node;

class RemoteImpl extends Context, implements RemoteProvider {
  
  public function
  httpHandler(re:EReg,req:NodeHttpServerReq,resp:NodeHttpServerResp) {
    if(Reflect.field(req.headers,"x-haxe-remoting") == null){
      resp.end("bad remoting request");
      return;
    }

    HttpImpl.parseFields(req,function(flds,optFiles) {
        var data = flds.get("__x");
        if (data != null) {
          processRequest(data,this,function(d) {
              resp.end(d);
            });
        }
      });
  }
  
	static function
  processRequest( requestData : String, ctx : Context,cb:String->Void )  {
		try {
			var
        u = new haxe.Unserializer(requestData),
        path = u.unserialize(),
        args:Array<Dynamic> = u.unserialize();
      
      args.push(function(data) {
          var s = new haxe.Serializer();
          s.serialize(data);
          cb( "hxr" + s.toString());
        });
      
			ctx.call(path,args);
    } catch( e : Dynamic ) {
      var s = new haxe.Serializer();
      s.serializeException(e);
      cb("hxr" + s.toString());
    }
  }
}
