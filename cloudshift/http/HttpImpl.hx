/*

  hxc: -D nodejs
 */

package cloudshift.http;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Http;
import cloudshift.http.Mime;

import js.Node;

private typedef Cache = {
    var mtime:Float;
    var buf:NodeBuffer;
}

class HttpImpl implements HttpServer,implements Part<HostPort,HttpServer,HttpEvents> {
  public var part_:Part_<HostPort,HttpServer,HttpEvents>;
  
  var _server:NodeHttpServer;
  var _cache:Hash<Cache>;
  var _getHandler:String->NodeHttpServerReq->NodeHttpServerResp->Int->Void;
  var _routes:Array<{re:EReg,handler:THandler}>;
  var _notFound:NodeHttpServerReq->NodeHttpServerResp->Void;

  var _index:String;
  var _root:String;
  var _serverName:String;

  static var readStreamOpt:ReadStreamOpt = cast {
        flags: 'r',
        mode: 0666
  };
  
  static var _formidable:Dynamic ;

  static function __init__() {
    _formidable = js.Node.require('formidable');
  }
  
  public function
  new() {
    _routes = [];

    _index = "index.html";
    _root = null;
    _serverName = "Cloudshift 0.2.3";
    
    _getHandler = defaultGetHandler;
    _cache = new Hash();
    
    part_ = Core.part(this);

  }

  public function
  start_(d:HostPort) {
    var p = Core.outcome();
    _server = Node.http.createServer(function(req,resp) {
        var
        url = req.url,
        match = false;

        if (_routes != null) {
          for (r in _routes) {
            if (r.re.match(url)) {
              match = true;
              try {
                r.handler(r.re,req,resp);
              } catch(ex:Dynamic) {
                Core.log(E("handler exp:"+ex));
              }
            
              break;
            }
          }
        }
        
        if (!match && _root != null) {
            if (req.method == "GET") {
                if (url == "/") url = _index;
                _getHandler(url,req,resp,200);
            }
        }
    });

    Core.log(I("Starting "+_serverName+" on "+d.host+":"+d.port));

    /*
    _server.addListener(NodeC.EVENT_HTTPSERVER_REQUEST,function(request,response) {
        notify(Request(request,response));
      });
    */
    
    _server.listen(d.port,d.host,function() {
        p.resolve(Right(cast(this,HttpServer)));
      });
    
    return p;
  }

  public function stop_(?d) {
    var p = Core.outcome();
    _server.close();
    //_server.on("close",function() {
    p.resolve(Right(cast this));
        //  });
    return p;
  }

  public function
  handler(r:EReg,handler:THandler):HttpServer {
    _routes.push({re:r,handler:handler});
    return this;
  }

  public function
  notFound(nf:NodeHttpServerReq->NodeHttpServerResp->Void):HttpServer {
    _notFound = nf;
    return this;
  }

  public function
  index(indexFile:String):HttpServer {
    _index = indexFile;
    return this;
  }
  
  public function
  serverName(serverName:String):HttpServer {
    _serverName = serverName;
    return this;
  }
  
  public function
  root(rootDir:String):HttpServer {
    _root = if (!rootDir.endsWith("/")) rootDir + "/" ;
    _getHandler = serve;
    return this;
  }

  function
  defaultGetHandler(path:String,req:NodeHttpServerReq,resp:NodeHttpServerResp,statusCode:Int) {
    do404(req,resp);
  }

  public function
  fields(req:NodeHttpServerReq,cb:TFields,uploadDir="/tmp") {
    parseFields(req,cb,uploadDir);
  }

  public static function
  parseFields(req:NodeHttpServerReq,cb:TFields,?uploadDir:String) {
      var
        form:Dynamic = untyped __js__('new cloudshift.http.HttpImpl._formidable.IncomingForm()'),
        fields = new Hash<String>(),
        files:Array<{field:String,file:TUploadFile}> = null;

      if (uploadDir != null) form.uploadDir = uploadDir;
      
      form.on('field',function(field,value) {
          fields.set(Std.string(field),Std.string(value));
        })
        .on('file',function(field,file) {
            if (files == null) files = [];
            files.push({field:field,file:file});
          })
        .on('end', function() {
            var
              fls = (files != null && files.length > 0) ? Some(files) : None;

            cb(fields,fls);
          });
      form.parse(req);
  }

  public function
  serve(path:String,req:NodeHttpServerReq,resp:NodeHttpServerResp,statusCode=200) {
    var fileToServe = if (_root != null ) _root+path else path;
    Node.fs.stat(fileToServe,function (e, stat:NodeStat) {
        if (e != null) {
          do404(req,resp);
          return;
        }

        var
          mtime = Date.fromString(new String(stat.mtime)),
          fmtime = mtime.getTime(),
          size = stat.size,
          eTag = Node.stringify([stat.ino, size, mtime].join('-')),
          //          since = Reflect.field(req.headers,"if-modified-since"),
          modified = false;

        /*
        if (since != null) {
          modified = (parse(since) < fmtime) ;
          }*/

        if (Reflect.field(req.headers,"if-none-match") == eTag ){
          resp.statusCode = 304;
          headers(resp,size,path,eTag,mtime);
          resp.end();
          return;
        }

        if (stat.isFile()) {
          resp.statusCode = statusCode;
          headers(resp,size,path,eTag,mtime);
          serveFromCache(resp,fileToServe,stat,fmtime);
        } else if (stat.isDirectory()) {
          do404(req,resp);
        } else {
          do404(req,resp);
        }
      });
  }

  public function
  serveNoCache(path:String,req:NodeHttpServerReq,resp:NodeHttpServerResp,statusCode=200) {
    var fileToServe = if (_root != null ) _root+path else path;
    Node.fs.stat(fileToServe,function (e, stat:NodeStat) {
        if (e != null) {
          do404(req,resp);
          return;
        }

        var
          mtime = Date.fromString(new String(stat.mtime)),
          size = stat.size;

          if (stat.isFile()) {
            resp.statusCode = statusCode;
            headers(resp,size,path,null,mtime);
            resp.setHeader("cache-control","no-cache");
            Node.fs.createReadStream(path,readStreamOpt).pipe(resp);
        } else if (stat.isDirectory()) {
          do404(req,resp);
        } else {
          do404(req,resp);
        }
      });
  }
                 
  function do404(req:NodeHttpServerReq,resp:NodeHttpServerResp) {
    //    resp.writeHead(404);
    if (_notFound != null)
      _notFound(req,resp);
    //resp.end();
  }

  function headers(resp:NodeHttpServerResp,size,path,etag,mtime:Date) {
    resp.setHeader("Content-Length",size);
    resp.setHeader("Content-Type",Reflect.field(Mime.types,Node.path.extname(path).substr(1)));
    resp.setHeader("Date",UTCString(Date.now()));
    if (etag != null)
      resp.setHeader("ETag",etag);
    resp.setHeader("Last-Modified", UTCString(mtime));
    resp.setHeader("Server",_serverName);
  }

  function
  serveFromCache(resp:NodeHttpServerResp,path:String,stat:NodeStat,mtime:Float) {
    var cached = _cache.get(path) ;
    if (cached == null) {
      pipeFile(resp,path,stat,mtime);
    } else {
      if (cached.mtime < mtime) {
        pipeFile(resp,path,stat,mtime);
      } else {
        resp.end(cached.buf);
      }
    }    
  }

  function
  pipeFile(resp:NodeHttpServerResp,path:String,stat:NodeStat,mtime:Float){
    var
      buf = new NodeBuffer(stat.size),
      offset = 0;
      _cache.set(path,{mtime:mtime,buf:buf});
      
      Node.fs.createReadStream(path,readStreamOpt)
        .on('error', function (err) {
          Node.console.error(err);
          })
        .on('data', function (chunk) {
            chunk.copy(buf, offset);
            offset += chunk.length;
          })
        .on('close', function () {

          })
        .pipe(resp);
  } 

  static function
  UTCString(d:Date) : String {
    return untyped __js__("d.toUTCString()");
    }

  static function
  parse(d:String):Float {
    return untyped __js__("Date.parse(d)");
  }
}