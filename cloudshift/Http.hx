
package cloudshift;

import cloudshift.Core;
import js.Node;

typedef THandler = EReg->NodeHttpServerReq->NodeHttpServerResp->Void;

/*
  not implemented
*/
enum HttpEvents {
  Connection;
  CheckContinue;
  Upgrade;
  ClientError;
  Close;
}

interface HttpServer implements Part<HostPort,HttpServer,HttpEvents> {
  function fields(req:js.Node.NodeHttpServerReq,cb:Hash<String>->Void):Void;
  function serve(path:String,req:NodeHttpServerReq,resp:NodeHttpServerResp,?statusCode:Int):Void;
  function serveNoCache(path:String,req:NodeHttpServerReq,resp:NodeHttpServerResp,?statusCode:Int):Void;
  function handler(ereg:EReg,cb:THandler):HttpServer;
  function notFound(cb:NodeHttpServerReq->NodeHttpServerResp->Void):HttpServer;
  function index(indexFile:String):HttpServer;
  function serverName(serverName:String):HttpServer;
  function root(rootDir:String):HttpServer;  
}

class Http {
  
  public static function
  server():HttpServer {
    return new cloudshift.http.HttpImpl();
  }

}