
package cloudshift.http;

import cloudshift.Http;
import cloudshift.Core;
using cloudshift.Mixin;

import js.Node;

class Neko {

	/**
     Returns the GET and POST parameters.
	**/
	public static function getParams(req:NodeHttpServerReq) {
		var p = Node.url.parse(req.url);
		var h = new Hash<String>();
		Reflect.fields(p).foreach(function(f) {
        h.set(f,Reflect.field(p,new String(f))); 
      });
		return h;
  }

	/**
     Returns an Array of Strings built using GET / POST values.
     If you have in your URL the parameters [a[]=foo;a[]=hello;a[5]=bar;a[3]=baz] then
     [neko.Web.getParamValues("a")] will return [["foo","hello",null,"baz",null,"bar"]]
	**/
	public static function getParamValues(req, param : String ) : Array<String> {
		var reg = new EReg("^"+param+"(\\[|%5B)([0-9]*?)(\\]|%5D)=(.*?)$", "");
		var res = new Array<String>();
		var explore = function(data:String){
        if (data == null || data.length == 0)
          return;
        for (part in data.split("&")){
          if (reg.match(part)){
            var idx = reg.matched(2);
            var val = StringTools.urlDecode(reg.matched(4));
            if (idx == "")
              res.push(val);
            else
              res[Std.parseInt(idx)] = val;
          }
        }
		}
		explore(StringTools.replace(getParamsString(req), ";", "&"));
    //		explore(getPostData());
		if (res.length == 0)
			return null;
		return res;
	}

	/**
     Returns the local server host name
	**/
  public static function getHostName(req) {
		return new String(Node.os.hostname());
	}

	/**
     Surprisingly returns the client IP address.
	**/
	public static function getClientIP(req:NodeHttpServerReq) {
		return new String(req.connection.remoteAddress);
	}

	/**
     Returns the original request URL (before any server internal redirections)
	**/
  public static function getURI(req:NodeHttpServerReq) {
    return new String(req.url);
	}

	/**
     Set an output header value. If some data have been printed, the headers have
     already been sent so this will raise an exception.
	**/
  public static function setHeader(resp:NodeHttpServerResp, h : String, v : String ) {
    resp.setHeader(h,v);
	}

	/**
     Set the HTTP return code. Same remark as setHeader.
	**/
	public static function setReturnCode(resp:NodeHttpServerResp,  r : Int ) {
		resp.statusCode = r;
	}

	/**
     Retrieve a client header value sent with the request.
	**/
  public static function getClientHeader(req:NodeHttpServerReq, k : String ) {
    var v = Reflect.field(req.headers,k);
    if( v == null )
      return null;
    return new String(v);
  }

	/**
     Retrieve all the client headers.
	**/
	public static function getClientHeaders(req:NodeHttpServerReq) {
		var v = req.headers;
		var a = [];

    Reflect.fields(v).foreach(function(f) {
        a.push({ header : new String(f), value : new String(Reflect.field(v,f)) });
      });
  
    return a;
  }

  /**
     Returns all the GET parameters String
  **/
  public static function getParamsString(req:NodeHttpServerReq) {
    var
      u = new String(req.url),
      qs = u.indexOf("?");
    
    return (qs != -1) ? u.substr(qs+1) : "";
  }

  /**
     Returns all the POST data. POST Data is always parsed as
     being application/x-www-form-urlencoded and is stored into
     the getParams hashtable. POST Data is maximimized to 256K
     unless the content type is multipart/form-data. In that
     case, you will have to use [getMultipart] or [parseMultipart]
     methods.
  **/
  /*
    public static function getPostData() {
    var v = _get_post_data();
    if( v == null )
    return null;
    return new String(v);
    }
  */

  /**
     Returns an hashtable of all Cookies sent by the client.
     Modifying the hashtable will not modify the cookie, use setCookie instead.
  **/
  public static function getCookies(req:NodeHttpServerReq) {
    var p = getClientHeader(req,"cookie");
    var kvs = p.split(";");
    var h = new Hash<String>();
    kvs.foreach(function(kv) {
        var el = kv.split("=");
      h.set(el[0],new String(el[1]));
      });
    return h;
  }


  /**
     Set a Cookie value in the HTTP headers. Same remark as setHeader.
  **/
  public static function setCookie(resp:NodeHttpServerResp, key : String, value : String, ?expire: Date, ?domain: String, ?path: String, ?secure: Bool ) {
    var buf = new StringBuf();
    buf.add(value);
    if( expire != null ) addPair(buf, "expires=", DateTools.format(expire, "%a, %d-%b-%Y %H:%M:%S GMT"));
    addPair(buf, "domain=", domain);
    addPair(buf, "path=", path);
    if( secure ) addPair(buf, "secure", "");
    var v = buf.toString();
    resp.setHeader("Set-Cookie",v);
  }

  static function addPair( buf : StringBuf, name, value ) {
    if( value == null ) return;
    buf.add("; ");
    buf.add(name);
    buf.add(value);
  }

  /**
     Returns an object with the authorization sent by the client (Basic scheme only).
  **/
  public static function getAuthorization(req:NodeHttpServerReq) : { user : String, pass : String } {
    var h = getClientHeader(req,"Authorization");
    var reg = ~/^Basic ([^=]+)=*$/;
    if( h != null && reg.match(h) ){
      var val = reg.matched(1);
      untyped val = new String(_base_decode(val.__s,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".__s));
      var a = val.split(":");
      if( a.length != 2 ){
        throw "Unable to decode authorization.";
      }
      return {user: a[0],pass: a[1]};
    }
    return null;
  }

  /**
     Get the current script directory in the local filesystem.
  **/
  public static function getCwd() {
    return new String(Node.process.cwd());
  }

  /**
     Get the multipart parameters as an hashtable. The data
     cannot exceed the maximum size specified.
  **/
  public static function getMultipart(req:NodeHttpServerReq,cb:TFields ) {
    cloudshift.http.HttpImpl.parseFields(req,cb);
  }


  /**
     Flush the data sent to the client. By default on Apache, outgoing data is buffered so
     this can be useful for displaying some long operation progress.
  **/
  public static function flush(resp:NodeHttpServerResp) : Void {
    resp.end();
  }

  /**
     Get the HTTP method used by the client. This api requires Neko 1.7.1+
  **/
  public static function getMethod(req:NodeHttpServerReq) : String {
    return new String(req.method);
  }
}