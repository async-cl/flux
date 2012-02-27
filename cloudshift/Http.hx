
package cloudshift;

import cloudshift.Core;
import js.Node;

typedef TUploadFile = {
    var size:Int;
    var path:String;
    var name:String;
    var type:String;
    var lastModifiedDate:String;
}

typedef THandler = EReg->NodeHttpServerReq->NodeHttpServerResp->Void;
typedef TFiles = Array<{field:String,file:TUploadFile}>;
typedef TFields = Hash<String>->TFiles->Void;


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
  function fields(req:js.Node.NodeHttpServerReq,cb:TFields,?uploadDir:String):Void;
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

  public static function
  get(url:String,?params:Dynamic,?headers:Dynamic):Outcome<String,String> {
    var
      oc = Core.outcome(),
      pu = Node.url.parse(url),
      client = Node.http.createClient(Std.parseInt((pu.port == null) ? "80" : pu.port),pu.hostname),
      myheaders = {"host":pu.hostname},
      request;

      if (headers != null)
        for( h in Reflect.fields(headers)) {
          Reflect.setField(myheaders,h,Reflect.field(headers,h));
        }

      request = client.request("GET",url,myheaders);
        
      request.addListener('response',function(response:NodeHttpClientResp) {
          var resp = new StringBuf();
          response.on("data", function (chunk) {
              resp.add(chunk);
            });
          response.on("end",function() {
              oc.resolve(Right(resp.toString()));
            });
        });

      if (params != null) {
        request.end(Node.queryString.stringify(params));
      } else
        request.end();
      
    return oc;
  }

  public static function
  post(url:String,payload:Dynamic,urlEncoded=true,?headers:Dynamic):Outcome<String,String> {
    var
      oc = Core.outcome(),
      pu = Node.url.parse(url),
      client = Node.http.createClient(Std.parseInt((pu.port == null) ? "80" : pu.port),pu.hostname),
      myheaders = {"host":pu.hostname},
      request;

      if (headers != null)
        for( h in Reflect.fields(headers)) {
          Reflect.setField(myheaders,h,Reflect.field(headers,h));
        }

      if (urlEncoded)
        Reflect.setField(myheaders,'Content-Type','application/x-www-form-urlencoded');
      else
        Reflect.setField(myheaders,"Content-Length",Std.string(Std.string(payload).length));

      request = client.request("POST",url,myheaders);
    
    request.addListener('response',function(response:NodeHttpClientResp) {
        var resp = new StringBuf();
        response.on("data", function (chunk) {
            resp.add(chunk);
          });
        response.on("end",function() {
            oc.resolve(Right(resp.toString()));
          });
      });

    if (urlEncoded)
      request.end(Node.queryString.stringify(payload));
    else
      request.end(payload);

    return oc;
  }

  
}