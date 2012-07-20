var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); };
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };;
Async_SiteRemotes = $hxClasses['Async_SiteRemotes'] = function(c) {
	this.__cnx = c;
};
Async_SiteRemotes.__name__ = ["Async_SiteRemotes"];
Async_SiteRemotes.prototype.__cnx = null;
Async_SiteRemotes.prototype.index = function(dir,cb) {
	this.__cnx.resolve("index").call([dir],cb);
};
Async_SiteRemotes.prototype.__class__ = Async_SiteRemotes;
ClientProxy = $hxClasses['ClientProxy'] = function(c) {
	Async_SiteRemotes.call(this,c);
};
ClientProxy.__name__ = ["ClientProxy"];
ClientProxy.__super__ = Async_SiteRemotes;
for(var k in Async_SiteRemotes.prototype ) ClientProxy.prototype[k] = Async_SiteRemotes.prototype[k];
ClientProxy.prototype.__class__ = ClientProxy;
Client = $hxClasses['Client'] = function() { };
Client.__name__ = ["Client"];
Client._rems = null;
Client.content = null;
Client.contentSide = null;
Client.main = function() {
	new js.JQuery("").ready(function(e) {
		Client._rems = Client.getRemoteConnection("/remotes");
		Client.content = new js.JQuery("#main-content");
		Client.contentSide = new js.JQuery("#main-content-side");
		Client.loadFront();
	});
};
Client.loadFront = function() {
	new js.JQuery("#link_home").click(function(e) {
		Client.contentSide.empty();
	});
	new js.JQuery("#link_api").click(function(e) {
		Client.contentSide.empty();
		Client.content.html("<iframe src=\"/docs_dev/index.html\" width=\"100%\" height=\"550\"></iframe>");
	});
	new js.JQuery("#link_manual").click(function(e) {
		Client.contentSide.html("<ul id=\"links\"></ul>");
		var blogLinks = new js.JQuery("#links");
		blogLinks.append("<h3>Index</h3><hr/>");
		Client._rems.index("manual",function(meta) {
			var _g = 0;
			while(_g < meta.length) {
				var m = meta[_g];
				++_g;
				var p = "/manual/" + m.fileName + ".html", a = "<a id=\"" + m.fileName + "\" href=\"" + p + "\" target=\"frame-content\">" + m.title + " </a>";
				blogLinks.append("<li class=\"recent\">" + a + "</li>");
			}
		});
	});
	new js.JQuery("#link_blog").click(function(e) {
		Client.recentBlog(function(meta) {
		});
	});
	new js.JQuery("#link_about").click(function(e) {
		Client.contentSide.empty();
		Client.contentSide.html("<img src=\"/image/ritchie_turner.png\"/>");
	});
};
Client.recentBlog = function(onMeta) {
	Client.contentSide.html("<ul id=\"links\"></ul>");
	var blogLinks = new js.JQuery("#links");
	blogLinks.append("<h3>Recent Blog</h3><hr/>");
	Client._rems.index("blog",function(meta) {
		if(onMeta != null) onMeta(meta);
		var _g = 0;
		while(_g < meta.length) {
			var m = meta[_g];
			++_g;
			var p = "/blog/" + m.fileName + ".html", a = "<a id=\"" + m.fileName + "\" href=\"" + p + "\" target=\"frame-content\">" + m.title + " </a>";
			blogLinks.append("<li class=\"recent\">" + a + "</li>");
		}
	});
};
Client.getRemoteConnection = function(url) {
	var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(url);
	cnx.setErrorHandler(function(err) {
		flux.core.LogImpl.error(Std.string(err),"",{ fileName : "Client.hx", lineNumber : 96, className : "Client", methodName : "getRemoteConnection"});
	});
	return new ClientProxy(cnx.resolve("SiteRems"));
};
Client.prototype.__class__ = Client;
EReg = $hxClasses['EReg'] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype.r = null;
EReg.prototype.match = function(s) {
	if(this.r.global) this.r.lastIndex = 0;
	this.r.m = this.r.exec(s);
	this.r.s = s;
	return this.r.m != null;
};
EReg.prototype.matched = function(n) {
	return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
};
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	return this.r.s.substr(0,this.r.m.index);
};
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	var sz = this.r.m.index + this.r.m[0].length;
	return this.r.s.substr(sz,this.r.s.length - sz);
};
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length};
};
EReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
};
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
};
EReg.prototype.customReplace = function(s,f) {
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.add(this.matchedLeft());
		buf.add(f(this));
		s = this.matchedRight();
	}
	buf.b[buf.b.length] = s == null?"null":s;
	return buf.b.join("");
};
EReg.prototype.__class__ = EReg;
Hash = $hxClasses['Hash'] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype.h = null;
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
};
Hash.prototype.get = function(key) {
	return this.h["$" + key];
};
Hash.prototype.exists = function(key) {
	return this.h.hasOwnProperty("$" + key);
};
Hash.prototype.remove = function(key) {
	key = "$" + key;
	if(!this.h.hasOwnProperty(key)) return false;
	delete(this.h[key]);
	return true;
};
Hash.prototype.keys = function() {
	var a = [];
	for( var key in this.h ) {
	if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
	}
	return HxOverrides.iter(a);
};
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}};
};
Hash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	while( it.hasNext() ) {
		var i = it.next();
		s.b[s.b.length] = i == null?"null":i;
		s.b[s.b.length] = " => ";
		s.add(Std.string(this.get(i)));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
};
Hash.prototype.__class__ = Hash;
HxOverrides = $hxClasses['HxOverrides'] = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
HxOverrides.prototype.__class__ = HxOverrides;
IntHash = $hxClasses['IntHash'] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype.h = null;
IntHash.prototype.set = function(key,value) {
	this.h[key] = value;
};
IntHash.prototype.get = function(key) {
	return this.h[key];
};
IntHash.prototype.exists = function(key) {
	return this.h.hasOwnProperty(key);
};
IntHash.prototype.remove = function(key) {
	if(!this.h.hasOwnProperty(key)) return false;
	delete(this.h[key]);
	return true;
};
IntHash.prototype.keys = function() {
	var a = [];
	for( var key in this.h ) {
	if(this.h.hasOwnProperty(key)) a.push(key | 0);
	}
	return HxOverrides.iter(a);
};
IntHash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref[i];
	}};
};
IntHash.prototype.toString = function() {
	var s = new StringBuf();
	s.b[s.b.length] = "{";
	var it = this.keys();
	while( it.hasNext() ) {
		var i = it.next();
		s.b[s.b.length] = i == null?"null":i;
		s.b[s.b.length] = " => ";
		s.add(Std.string(this.get(i)));
		if(it.hasNext()) s.b[s.b.length] = ", ";
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
};
IntHash.prototype.__class__ = IntHash;
IntIter = $hxClasses['IntIter'] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype.min = null;
IntIter.prototype.max = null;
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
};
IntIter.prototype.next = function() {
	return this.min++;
};
IntIter.prototype.__class__ = IntIter;
List = $hxClasses['List'] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype.h = null;
List.prototype.q = null;
List.prototype.length = null;
List.prototype.add = function(item) {
	var x = [item];
	if(this.h == null) this.h = x; else this.q[1] = x;
	this.q = x;
	this.length++;
};
List.prototype.push = function(item) {
	var x = [item,this.h];
	this.h = x;
	if(this.q == null) this.q = x;
	this.length++;
};
List.prototype.first = function() {
	return this.h == null?null:this.h[0];
};
List.prototype.last = function() {
	return this.q == null?null:this.q[0];
};
List.prototype.pop = function() {
	if(this.h == null) return null;
	var x = this.h[0];
	this.h = this.h[1];
	if(this.h == null) this.q = null;
	this.length--;
	return x;
};
List.prototype.isEmpty = function() {
	return this.h == null;
};
List.prototype.clear = function() {
	this.h = null;
	this.q = null;
	this.length = 0;
};
List.prototype.remove = function(v) {
	var prev = null;
	var l = this.h;
	while(l != null) {
		if(l[0] == v) {
			if(prev == null) this.h = l[1]; else prev[1] = l[1];
			if(this.q == l) this.q = prev;
			this.length--;
			return true;
		}
		prev = l;
		l = l[1];
	}
	return false;
};
List.prototype.iterator = function() {
	return { h : this.h, hasNext : function() {
		return this.h != null;
	}, next : function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		return x;
	}};
};
List.prototype.toString = function() {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	s.b[s.b.length] = "{";
	while(l != null) {
		if(first) first = false; else s.b[s.b.length] = ", ";
		s.add(Std.string(l[0]));
		l = l[1];
	}
	s.b[s.b.length] = "}";
	return s.b.join("");
};
List.prototype.join = function(sep) {
	var s = new StringBuf();
	var first = true;
	var l = this.h;
	while(l != null) {
		if(first) first = false; else s.b[s.b.length] = sep == null?"null":sep;
		s.add(l[0]);
		l = l[1];
	}
	return s.b.join("");
};
List.prototype.filter = function(f) {
	var l2 = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		if(f(v)) l2.add(v);
	}
	return l2;
};
List.prototype.map = function(f) {
	var b = new List();
	var l = this.h;
	while(l != null) {
		var v = l[0];
		l = l[1];
		b.add(f(v));
	}
	return b;
};
List.prototype.__class__ = List;
Reflect = $hxClasses['Reflect'] = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
};
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
};
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
Reflect.prototype.__class__ = Reflect;
SiteRemotes = $hxClasses['SiteRemotes'] = function() {
	SiteRemotes.metaCache = new Hash();
};
SiteRemotes.__name__ = ["SiteRemotes"];
SiteRemotes.metaCache = null;
SiteRemotes.updateCache = function(dir,cb) {
};
SiteRemotes.prototype.index = function(dir,cb) {
};
SiteRemotes.prototype.__class__ = SiteRemotes;
Std = $hxClasses['Std'] = function() { };
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && HxOverrides.cca(x,1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
Std.random = function(x) {
	return Math.floor(Math.random() * x);
};
Std.prototype.__class__ = Std;
StringBuf = $hxClasses['StringBuf'] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x == null?"null":x;
};
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = HxOverrides.substr(s,pos,len);
};
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
};
StringBuf.prototype.toString = function() {
	return this.b.join("");
};
StringBuf.prototype.b = null;
StringBuf.prototype.__class__ = StringBuf;
StringTools = $hxClasses['StringTools'] = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
};
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
StringTools.isEOF = function(c) {
	return c != c;
};
StringTools.prototype.__class__ = StringTools;
ValueType = $hxClasses['ValueType'] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
Type = $hxClasses['Type'] = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
};
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
};
Type.prototype.__class__ = Type;
if(typeof flux=='undefined') flux = {};
flux.Option = $hxClasses['flux.Option'] = { __ename__ : ["flux","Option"], __constructs__ : ["None","Some"] };
flux.Option.None = ["None",0];
flux.Option.None.toString = $estr;
flux.Option.None.__enum__ = flux.Option;
flux.Option.Some = function(v) { var $x = ["Some",1,v]; $x.__enum__ = flux.Option; $x.toString = $estr; return $x; };
flux.Either = $hxClasses['flux.Either'] = { __ename__ : ["flux","Either"], __constructs__ : ["Left","Right"] };
flux.Either.Left = function(v) { var $x = ["Left",0,v]; $x.__enum__ = flux.Either; $x.toString = $estr; return $x; };
flux.Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = flux.Either; $x.toString = $estr; return $x; };
flux.EOperation = $hxClasses['flux.EOperation'] = { __ename__ : ["flux","EOperation"], __constructs__ : ["Add","Del"] };
flux.EOperation.Add = function(info) { var $x = ["Add",0,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; };
flux.EOperation.Del = function(info) { var $x = ["Del",1,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; };
flux.Observable = $hxClasses['flux.Observable'] = function() { };
flux.Observable.__name__ = ["flux","Observable"];
flux.Observable.prototype.preNotify = null;
flux.Observable.prototype.notify = null;
flux.Observable.prototype.observe = null;
flux.Observable.prototype.peers = null;
flux.Observable.prototype.removePeers = null;
flux.Observable.prototype.peek = null;
flux.Observable.prototype.__class__ = flux.Observable;
flux.Future = $hxClasses['flux.Future'] = function() { };
flux.Future.__name__ = ["flux","Future"];
flux.Future.prototype.resolve = null;
flux.Future.prototype.deliver = null;
flux.Future.prototype.isCanceled = null;
flux.Future.prototype.ifCanceled = null;
flux.Future.prototype.allowCancelOnlyIf = null;
flux.Future.prototype.cancel = null;
flux.Future.prototype.isDone = null;
flux.Future.prototype.isDelivered = null;
flux.Future.prototype.map = null;
flux.Future.prototype.flatMap = null;
flux.Future.prototype.filter = null;
flux.Future.prototype.value = null;
flux.Future.prototype.toOption = null;
flux.Future.prototype.toArray = null;
flux.Future.prototype.__class__ = flux.Future;
flux.EPartState = $hxClasses['flux.EPartState'] = { __ename__ : ["flux","EPartState"], __constructs__ : ["Started","Stopped","Event","Error","Except"] };
flux.EPartState.Except = function(e) { var $x = ["Except",4,e]; $x.__enum__ = flux.EPartState; $x.toString = $estr; return $x; };
flux.EPartState.Event = function(event) { var $x = ["Event",2,event]; $x.__enum__ = flux.EPartState; $x.toString = $estr; return $x; };
flux.EPartState.Started = ["Started",0];
flux.EPartState.Started.toString = $estr;
flux.EPartState.Started.__enum__ = flux.EPartState;
flux.EPartState.Error = function(msg) { var $x = ["Error",3,msg]; $x.__enum__ = flux.EPartState; $x.toString = $estr; return $x; };
flux.EPartState.Stopped = ["Stopped",1];
flux.EPartState.Stopped.toString = $estr;
flux.EPartState.Stopped.__enum__ = flux.EPartState;
flux.Part_ = $hxClasses['flux.Part_'] = function() { };
flux.Part_.__name__ = ["flux","Part_"];
flux.Part_.prototype._events = null;
flux.Part_.prototype.partID = null;
flux.Part_.prototype.state = null;
flux.Part_.prototype._info = null;
flux.Part_.prototype.sstopper = null;
flux.Part_.prototype.start = null;
flux.Part_.prototype.stop = null;
flux.Part_.prototype.observe = null;
flux.Part_.prototype.notify = null;
flux.Part_.prototype.observeState = null;
flux.Part_.prototype.notifyState = null;
flux.Part_.prototype.peer = null;
flux.Part_.prototype.setStop = null;
flux.Part_.prototype.__class__ = flux.Part_;
flux.Part = $hxClasses['flux.Part'] = function() { };
flux.Part.__name__ = ["flux","Part"];
flux.Part.prototype.part_ = null;
flux.Part.prototype.start_ = null;
flux.Part.prototype.__class__ = flux.Part;
flux.Core = $hxClasses['flux.Core'] = function() { };
flux.Core.__name__ = ["flux","Core"];
flux.Core.init = function() {
	flux.core.LogImpl.init(null);
};
flux.Core.future = function() {
	return new flux.core.FutureImpl();
};
flux.Core.outcome = function(cancel) {
	return new flux.core.FutureImpl();
};
flux.Core.part = function(parent,info) {
	return new flux.core.PartBaseImpl(parent,info);
};
flux.Core.cancelledFuture = function() {
	return flux.core.FutureImpl.dead();
};
flux.Core.event = function() {
	return new flux.core.ObservableImpl();
};
flux.Core.toOption = function(t) {
	return t == null?flux.Option.None:flux.Option.Some(t);
};
flux.Core.logInit = function(fileName) {
	flux.core.LogImpl.init(fileName);
};
flux.Core.info = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.info(msg,category,inf);
};
flux.Core.warn = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.warn(msg,category,inf);
};
flux.Core.error = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.error(msg,category,inf);
};
flux.Core.debug = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.debug(msg,category,inf);
};
flux.Core.parse = function(str) {
	return haxe.Json.parse(str);
};
flux.Core.stringify = function(obj) {
	return haxe.Json.stringify(obj);
};
flux.Core.waitOut = function(toJoin) {
	var count = toJoin.length, oc = new flux.core.FutureImpl();
	flux.ArrayX.foreach(toJoin,function(xprm) {
		xprm.deliver(function(r) {
			count--;
			if(count == 0) oc.resolve(flux.Either.Right(flux.ArrayX.map(toJoin,function(el) {
				var z = el._result;
				return z;
			})));
		});
	});
	return oc;
};
flux.Core.waitFut = function(toJoin) {
	var count = toJoin.length, fut = new flux.core.FutureImpl();
	flux.ArrayX.foreach(toJoin,function(xprm) {
		if(!js.Boot.__instanceof(xprm,flux.Future)) throw "not a future:" + Std.string(xprm);
		xprm.deliver(function(r) {
			count--;
			if(count == 0) fut.resolve(flux.ArrayX.map(toJoin,function(el) {
				return flux.OptionX.get(el.value());
			}));
		});
	});
	return fut;
};
flux.Core.listParts = function() {
	flux.ArrayX.foreach(flux.core.PartBaseImpl.runningParts,function(p) {
		if(flux.PartX.info(p) != null) console.log(flux.PartX.info(p));
	});
};
flux.Core.assert = function(cond,pos) {
	if(!cond) flux.core.LogImpl.error("Assert failed in " + pos.className + "::" + pos.methodName,"",pos);
};
flux.Core.prototype.__class__ = flux.Core;
flux.DynamicX = $hxClasses['flux.DynamicX'] = function() { };
flux.DynamicX.__name__ = ["flux","DynamicX"];
flux.DynamicX.into = function(a,f) {
	return f(a);
};
flux.DynamicX.isInstanceOf = function(o,c) {
	return js.Boot.__instanceof(o,c);
};
flux.DynamicX.toThunk = function(t) {
	return function() {
		return t;
	};
};
flux.DynamicX.stringify = function(o) {
	return JSON.stringify(o);
};
flux.DynamicX.prototype.__class__ = flux.DynamicX;
flux.BoolX = $hxClasses['flux.BoolX'] = function() { };
flux.BoolX.__name__ = ["flux","BoolX"];
flux.BoolX.toInt = function(v) {
	return v?1:0;
};
flux.BoolX.ifTrue = function(v,f) {
	return v?flux.Option.Some(f()):flux.Option.None;
};
flux.BoolX.ifFalse = function(v,f) {
	return !v?flux.Option.Some(f()):flux.Option.None;
};
flux.BoolX.ifElse = function(v,f1,f2) {
	return v?f1():f2();
};
flux.BoolX.compare = function(v1,v2) {
	return !v1 && v2?-1:v1 && !v2?1:0;
};
flux.BoolX.equals = function(v1,v2) {
	return v1 == v2;
};
flux.BoolX.hashCode = function(v) {
	return v?786433:393241;
};
flux.BoolX.toString = function(v) {
	return v?"true":"false";
};
flux.BoolX.prototype.__class__ = flux.BoolX;
flux.IntX = $hxClasses['flux.IntX'] = function() { };
flux.IntX.__name__ = ["flux","IntX"];
flux.IntX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
};
flux.IntX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
};
flux.IntX.toBool = function(v) {
	return v == 0?false:true;
};
flux.IntX.toFloat = function(v) {
	return v;
};
flux.IntX.to = function(start,end) {
	return { iterator : function() {
		var cur = start;
		return { hasNext : function() {
			return cur <= end;
		}, next : function() {
			var next = cur;
			++cur;
			return next;
		}};
	}};
};
flux.IntX.until = function(start,end) {
	return flux.IntX.to(start,end - 1);
};
flux.IntX.compare = function(v1,v2) {
	return v1 - v2;
};
flux.IntX.equals = function(v1,v2) {
	return v1 == v2;
};
flux.IntX.toString = function(v) {
	return "" + v;
};
flux.IntX.hashCode = function(v) {
	return v * 196613;
};
flux.IntX.prototype.__class__ = flux.IntX;
flux.FloatX = $hxClasses['flux.FloatX'] = function() { };
flux.FloatX.__name__ = ["flux","FloatX"];
flux.FloatX.round = function(v) {
	return Math.round(v);
};
flux.FloatX.ceil = function(v) {
	return Math.ceil(v);
};
flux.FloatX.floor = function(v) {
	return Math.floor(v);
};
flux.FloatX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
};
flux.FloatX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
};
flux.FloatX.toInt = function(v) {
	return v | 0;
};
flux.FloatX.compare = function(v1,v2) {
	return v1 < v2?-1:v1 > v2?1:0;
};
flux.FloatX.equals = function(v1,v2) {
	return v1 == v2;
};
flux.FloatX.toString = function(v) {
	return "" + v;
};
flux.FloatX.hashCode = function(v) {
	return v * 98317 | 0;
};
flux.FloatX.prototype.__class__ = flux.FloatX;
flux.StringX = $hxClasses['flux.StringX'] = function() { };
flux.StringX.__name__ = ["flux","StringX"];
flux.StringX.toBool = function(v,d) {
	if(v == null) return d;
	var vLower = v.toLowerCase();
	return flux.OptionX.getOrElseC(vLower == "false" || v == "0"?flux.Option.Some(false):vLower == "true" || v == "1"?flux.Option.Some(true):flux.Option.None,d);
};
flux.StringX.toInt = function(v,d) {
	if(v == null) return d;
	return flux.OptionX.getOrElseC(flux.OptionX.filter(flux.Core.toOption(Std.parseInt(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
};
flux.StringX.toFloat = function(v,d) {
	if(v == null) return d;
	return flux.OptionX.getOrElseC(flux.OptionX.filter(flux.Core.toOption(Std.parseFloat(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
};
flux.StringX.startsWith = function(v,frag) {
	return v.length >= frag.length && frag == HxOverrides.substr(v,0,frag.length)?true:false;
};
flux.StringX.endsWith = function(v,frag) {
	return v.length >= frag.length && frag == HxOverrides.substr(v,v.length - frag.length,null)?true:false;
};
flux.StringX.urlEncode = function(v) {
	return StringTools.urlEncode(v);
};
flux.StringX.urlDecode = function(v) {
	return StringTools.urlDecode(v);
};
flux.StringX.htmlEscape = function(v) {
	return StringTools.htmlEscape(v);
};
flux.StringX.htmlUnescape = function(v) {
	return StringTools.htmlUnescape(v);
};
flux.StringX.trim = function(v) {
	return StringTools.trim(v);
};
flux.StringX.contains = function(v,s) {
	return v.indexOf(s) != -1;
};
flux.StringX.replace = function(s,sub,by) {
	return StringTools.replace(s,sub,by);
};
flux.StringX.compare = function(v1,v2) {
	return v1 == v2?0:v1 > v2?1:-1;
};
flux.StringX.equals = function(v1,v2) {
	return v1 == v2;
};
flux.StringX.toString = function(v) {
	return v;
};
flux.StringX.parse = function(str) {
	return JSON.parse(str);
};
flux.StringX.clone = function(o) {
	return JSON.parse(JSON.stringify(o));
};
flux.StringX.info = function(msg,inf) {
	flux.core.LogImpl.info(msg,null,inf);
};
flux.StringX.warn = function(msg,inf) {
	flux.core.LogImpl.warn(msg,null,inf);
};
flux.StringX.error = function(msg,inf) {
	flux.core.LogImpl.error(msg,null,inf);
};
flux.StringX.prototype.__class__ = flux.StringX;
flux.DateX = $hxClasses['flux.DateX'] = function() { };
flux.DateX.__name__ = ["flux","DateX"];
flux.DateX.compare = function(v1,v2) {
	var diff = v1.getTime() - v2.getTime();
	return diff < 0?-1:diff > 0?1:0;
};
flux.DateX.equals = function(v1,v2) {
	return v1.getTime() == v2.getTime();
};
flux.DateX.toString = function(v) {
	return HxOverrides.dateStr(v);
};
flux.DateX.UTCString = function(d) {
	return d.toUTCString();
};
flux.DateX.prototype.__class__ = flux.DateX;
flux.ArrayX = $hxClasses['flux.ArrayX'] = function() { };
flux.ArrayX.__name__ = ["flux","ArrayX"];
flux.ArrayX.stringify = function(a) {
	return JSON.stringify(o);
};
flux.ArrayX.filter = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(f(e)) n.push(e);
	}
	return n;
};
flux.ArrayX.size = function(a) {
	return a.length;
};
flux.ArrayX.indexOf = function(a,t) {
	var index = 0;
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(e == t) return index;
		++index;
	}
	return -1;
};
flux.ArrayX.map = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		n.push(f(e));
	}
	return n;
};
flux.ArrayX.mapi = function(a,f) {
	var n = [];
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		n.push(f(a[i],i));
	}
	return n;
};
flux.ArrayX.next = function(a1,a2) {
	return a2;
};
flux.ArrayX.flatMap = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e1 = a[_g];
		++_g;
		var $it0 = $iterator(f(e1))();
		while( $it0.hasNext() ) {
			var e2 = $it0.next();
			n.push(e2);
		}
	}
	return n;
};
flux.ArrayX.foldl = function(a,z,f) {
	var r = z;
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		r = f(r,e);
	}
	return r;
};
flux.ArrayX.foldr = function(a,z,f) {
	var r = z;
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		var e = a[a.length - 1 - i];
		r = f(e,r);
	}
	return r;
};
flux.ArrayX.append = function(a,t) {
	var copy = flux.ArrayX.snapshot(a);
	copy.push(t);
	return copy;
};
flux.ArrayX.snapshot = function(a) {
	return [].concat(a);
};
flux.ArrayX.first = function(a) {
	return a[0];
};
flux.ArrayX.firstOption = function(a) {
	return a.length == 0?flux.Option.None:flux.Option.Some(a[0]);
};
flux.ArrayX.last = function(a) {
	return a[a.length - 1];
};
flux.ArrayX.lastOption = function(a) {
	return a.length == 0?flux.Option.None:flux.Option.Some(a[a.length - 1]);
};
flux.ArrayX.contains = function(a,t) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(t == e) return true;
	}
	return false;
};
flux.ArrayX.foreach = function(a,f) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		f(e);
	}
	return a;
};
flux.ArrayX.take = function(a,n) {
	return a.slice(0,flux.IntX.min(n,a.length));
};
flux.ArrayX.takeWhile = function(a,p) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.push(e); else break;
	}
	return r;
};
flux.ArrayX.drop = function(a,n) {
	return n >= a.length?[]:a.slice(n);
};
flux.ArrayX.dropWhile = function(a,p) {
	var r = [].concat(a);
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.shift(); else break;
	}
	return r;
};
flux.ArrayX.prototype.__class__ = flux.ArrayX;
flux.HashX = $hxClasses['flux.HashX'] = function() { };
flux.HashX.__name__ = ["flux","HashX"];
flux.HashX.getOption = function(h,key) {
	var v = h.get(key);
	return v == null?flux.Option.None:flux.Option.Some(v);
};
flux.HashX.values = function(h) {
	var a = [];
	var $it0 = h.iterator();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
};
flux.HashX.keyArray = function(h) {
	var a = [];
	var $it0 = h.keys();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
};
flux.HashX.prototype.__class__ = flux.HashX;
flux.OptionX = $hxClasses['flux.OptionX'] = function() { };
flux.OptionX.__name__ = ["flux","OptionX"];
flux.OptionX.toOption = function(t) {
	return t == null?flux.Option.None:flux.Option.Some(t);
};
flux.OptionX.toArray = function(o) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = [];
			break;
		case 1:
			var v = $e[2];
			$r = [v];
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.map = function(o,f) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = flux.Option.None;
			break;
		case 1:
			var v = $e[2];
			$r = flux.Option.Some(f(v));
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.next = function(o1,o2) {
	return o2;
};
flux.OptionX.foreach = function(o,f) {
	var $e = (o);
	switch( $e[1] ) {
	case 0:
		break;
	case 1:
		var v = $e[2];
		f(v);
		break;
	}
};
flux.OptionX.filter = function(o,f) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = flux.Option.None;
			break;
		case 1:
			var v = $e[2];
			$r = f(v)?flux.Option.Some(v):flux.Option.None;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.flatMap = function(o,f) {
	return flux.OptionX.flatten(flux.OptionX.map(o,f));
};
flux.OptionX.flatten = function(o1) {
	return (function($this) {
		var $r;
		var $e = (o1);
		switch( $e[1] ) {
		case 0:
			$r = flux.Option.None;
			break;
		case 1:
			var o2 = $e[2];
			$r = o2;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.get = function(o) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = (function($this) {
				var $r;
				throw "Error: Option is empty";
				return $r;
			}($this));
			break;
		case 1:
			var v = $e[2];
			$r = v;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.orElse = function(o1,thunk) {
	return (function($this) {
		var $r;
		var $e = (o1);
		switch( $e[1] ) {
		case 0:
			$r = thunk();
			break;
		case 1:
			var v = $e[2];
			$r = o1;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.getOrElse = function(o,thunk) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = thunk();
			break;
		case 1:
			var v = $e[2];
			$r = v;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.orElseC = function(o1,o2) {
	return flux.OptionX.orElse(o1,flux.DynamicX.toThunk(o2));
};
flux.OptionX.getOrElseC = function(o,c) {
	return flux.OptionX.getOrElse(o,flux.DynamicX.toThunk(c));
};
flux.OptionX.orEither = function(o1,thunk) {
	return (function($this) {
		var $r;
		var $e = (o1);
		switch( $e[1] ) {
		case 0:
			$r = flux.EitherX.toLeft(thunk());
			break;
		case 1:
			var v = $e[2];
			$r = flux.EitherX.toRight(v);
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.orEitherC = function(o1,c) {
	return flux.OptionX.orEither(o1,flux.DynamicX.toThunk(c));
};
flux.OptionX.isEmpty = function(o) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = true;
			break;
		case 1:
			var v = $e[2];
			$r = false;
			break;
		}
		return $r;
	}(this));
};
flux.OptionX.prototype.__class__ = flux.OptionX;
flux.EitherX = $hxClasses['flux.EitherX'] = function() { };
flux.EitherX.__name__ = ["flux","EitherX"];
flux.EitherX.toLeft = function(v) {
	return flux.Either.Left(v);
};
flux.EitherX.toRight = function(v) {
	return flux.Either.Right(v);
};
flux.EitherX.flip = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = flux.Either.Right(v);
			break;
		case 1:
			var v = $e[2];
			$r = flux.Either.Left(v);
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.left = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = flux.Option.Some(v);
			break;
		default:
			$r = flux.Option.None;
		}
		return $r;
	}(this));
};
flux.EitherX.isLeft = function(e) {
	return (function($this) {
		var $r;
		switch( (e)[1] ) {
		case 0:
			$r = true;
			break;
		case 1:
			$r = false;
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.isRight = function(e) {
	return (function($this) {
		var $r;
		switch( (e)[1] ) {
		case 0:
			$r = false;
			break;
		case 1:
			$r = true;
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.right = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 1:
			var v = $e[2];
			$r = flux.Option.Some(v);
			break;
		default:
			$r = flux.Option.None;
		}
		return $r;
	}(this));
};
flux.EitherX.get = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = v;
			break;
		case 1:
			var v = $e[2];
			$r = v;
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.mapLeft = function(e,f) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = flux.Either.Left(f(v));
			break;
		case 1:
			var v = $e[2];
			$r = flux.Either.Right(v);
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.map = function(e,f1,f2) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = flux.Either.Left(f1(v));
			break;
		case 1:
			var v = $e[2];
			$r = flux.Either.Right(f2(v));
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.mapRight = function(e,f) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = flux.Either.Left(v);
			break;
		case 1:
			var v = $e[2];
			$r = flux.Either.Right(f(v));
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.flatMap = function(e,f1,f2) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = f1(v);
			break;
		case 1:
			var v = $e[2];
			$r = f2(v);
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.composeLeft = function(e1,e2,ac,bc) {
	return (function($this) {
		var $r;
		var $e = (e1);
		switch( $e[1] ) {
		case 0:
			var v1 = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (e2);
				switch( $e[1] ) {
				case 0:
					var v2 = $e[2];
					$r = flux.Either.Left(ac(v1,v2));
					break;
				case 1:
					var v2 = $e[2];
					$r = flux.Either.Left(v1);
					break;
				}
				return $r;
			}($this));
			break;
		case 1:
			var v1 = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (e2);
				switch( $e[1] ) {
				case 0:
					var v2 = $e[2];
					$r = flux.Either.Left(v2);
					break;
				case 1:
					var v2 = $e[2];
					$r = flux.Either.Right(bc(v1,v2));
					break;
				}
				return $r;
			}($this));
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.composeRight = function(e1,e2,ac,bc) {
	return (function($this) {
		var $r;
		var $e = (e1);
		switch( $e[1] ) {
		case 0:
			var v1 = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (e2);
				switch( $e[1] ) {
				case 0:
					var v2 = $e[2];
					$r = flux.Either.Left(ac(v1,v2));
					break;
				case 1:
					var v2 = $e[2];
					$r = flux.Either.Right(v2);
					break;
				}
				return $r;
			}($this));
			break;
		case 1:
			var v1 = $e[2];
			$r = (function($this) {
				var $r;
				var $e = (e2);
				switch( $e[1] ) {
				case 0:
					var v2 = $e[2];
					$r = flux.Either.Right(v1);
					break;
				case 1:
					var v2 = $e[2];
					$r = flux.Either.Right(bc(v1,v2));
					break;
				}
				return $r;
			}($this));
			break;
		}
		return $r;
	}(this));
};
flux.EitherX.prototype.__class__ = flux.EitherX;
flux.PartX = $hxClasses['flux.PartX'] = function() { };
flux.PartX.__name__ = ["flux","PartX"];
flux.PartX.start = function(part,data,oc) {
	return part.part_.start(data,oc);
};
flux.PartX.stop = function(part,data) {
	return part.part_.stop(data);
};
flux.PartX.stop_ = function(part,cb) {
	part.part_.setStop(cb);
};
flux.PartX.observe = function(part,cb) {
	return part.part_.observe(cb);
};
flux.PartX.notify = function(part,e) {
	part.part_.notify(e);
};
flux.PartX.partID = function(part) {
	return part.part_.partID;
};
flux.PartX.observeState = function(part,cb) {
	return part.part_._events.observe(cb);
};
flux.PartX.state = function(part) {
	return part.part_.state;
};
flux.PartX.info = function(part) {
	return part.part_._info;
};
flux.PartX.prototype.__class__ = flux.PartX;
flux.OutcomeX = $hxClasses['flux.OutcomeX'] = function() { };
flux.OutcomeX.__name__ = ["flux","OutcomeX"];
flux.OutcomeX.outcome = function(oc,cb,err) {
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) cb(flux.OptionX.get(flux.EitherX.right(either))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 916, className : "flux.OutcomeX", methodName : "outcome"});
	});
};
flux.OutcomeX.oflatMap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) flux.OutcomeX.outcome(cb(flux.OptionX.get(flux.EitherX.right(either))),function(val) {
			roc.resolve(flux.Either.Right(val));
		},err); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 935, className : "flux.OutcomeX", methodName : "oflatMap"});
	});
	return roc;
};
flux.OutcomeX.omap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) roc.resolve(flux.Either.Right(cb(flux.OptionX.get(flux.EitherX.right(either))))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 954, className : "flux.OutcomeX", methodName : "omap"});
	});
	return roc;
};
flux.OutcomeX.prototype.__class__ = flux.OutcomeX;
if(!flux.core) flux.core = {};
flux.core.FutureImpl = $hxClasses['flux.core.FutureImpl'] = function() {
	this._listeners = [];
	this._result = null;
	this._isSet = false;
	this._isCanceled = false;
	this._cancelers = [];
	this._canceled = [];
	this._combined = 0;
};
flux.core.FutureImpl.__name__ = ["flux","core","FutureImpl"];
flux.core.FutureImpl.dead = function() {
	var prm = new flux.core.FutureImpl();
	prm.cancel();
	return prm;
};
flux.core.FutureImpl.create = function() {
	return new flux.core.FutureImpl();
};
flux.core.FutureImpl.prototype._listeners = null;
flux.core.FutureImpl.prototype._result = null;
flux.core.FutureImpl.prototype._isSet = null;
flux.core.FutureImpl.prototype._isCanceled = null;
flux.core.FutureImpl.prototype._cancelers = null;
flux.core.FutureImpl.prototype._canceled = null;
flux.core.FutureImpl.prototype._combined = null;
flux.core.FutureImpl.prototype.resolve = function(t) {
	return this._isCanceled?this:this._isSet?(function($this) {
		var $r;
		throw "Future already delivered";
		return $r;
	}(this)):(function($this) {
		var $r;
		$this._result = t;
		$this._isSet = true;
		{
			var _g = 0, _g1 = $this._listeners;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l($this._result);
			}
		}
		$this._listeners = [];
		$r = $this;
		return $r;
	}(this));
};
flux.core.FutureImpl.prototype.allowCancelOnlyIf = function(f) {
	if(!this.isDone()) this._cancelers.push(f);
	return this;
};
flux.core.FutureImpl.prototype.ifCanceled = function(f) {
	if(this.isCanceled()) f(); else if(!this.isDone()) this._canceled.push(f);
	return this;
};
flux.core.FutureImpl.prototype.cancel = function() {
	return this.isDone()?false:this.isCanceled()?true:(function($this) {
		var $r;
		var r = true;
		{
			var _g = 0, _g1 = $this._cancelers;
			while(_g < _g1.length) {
				var canceller = _g1[_g];
				++_g;
				r = r && canceller();
			}
		}
		if(r) $this.forceCancel();
		$r = r;
		return $r;
	}(this));
};
flux.core.FutureImpl.prototype.isDone = function() {
	return this.isDelivered() || this.isCanceled();
};
flux.core.FutureImpl.prototype.isDelivered = function() {
	return this._isSet;
};
flux.core.FutureImpl.prototype.isCanceled = function() {
	return this._isCanceled;
};
flux.core.FutureImpl.prototype.deliver = function(f) {
	if(this.isCanceled()) return this; else if(this.isDelivered()) f(this._result); else this._listeners.push(f);
	return this;
};
flux.core.FutureImpl.prototype.map = function(f) {
	var fut = new flux.core.FutureImpl();
	this.deliver(function(t) {
		fut.resolve(f(t));
	});
	this.ifCanceled(function() {
		fut.forceCancel();
	});
	return fut;
};
flux.core.FutureImpl.prototype.then = function(f) {
	return f;
};
flux.core.FutureImpl.prototype.flatMap = function(f) {
	var fut = new flux.core.FutureImpl();
	this.deliver(function(t) {
		f(t).deliver(function(s) {
			fut.resolve(s);
		}).ifCanceled(function() {
			fut.forceCancel();
		});
	});
	this.ifCanceled(function() {
		fut.forceCancel();
	});
	return fut;
};
flux.core.FutureImpl.prototype.filter = function(f) {
	var fut = new flux.core.FutureImpl();
	this.deliver(function(t) {
		if(f(t)) fut.resolve(t); else fut.forceCancel();
	});
	this.ifCanceled(function() {
		fut.forceCancel();
	});
	return fut;
};
flux.core.FutureImpl.prototype.value = function() {
	return this._isSet?flux.Option.Some(this._result):flux.Option.None;
};
flux.core.FutureImpl.prototype.toOption = function() {
	return this.value();
};
flux.core.FutureImpl.prototype.toArray = function() {
	return flux.OptionX.toArray(this.value());
};
flux.core.FutureImpl.prototype.forceCancel = function() {
	if(!this._isCanceled) {
		this._isCanceled = true;
		var _g = 0, _g1 = this._canceled;
		while(_g < _g1.length) {
			var canceled = _g1[_g];
			++_g;
			canceled();
		}
	}
	return this;
};
flux.core.FutureImpl.prototype.__class__ = flux.core.FutureImpl;
flux.core.FutureImpl.__interfaces__ = [flux.Future];
flux.core.LogImpl = $hxClasses['flux.core.LogImpl'] = function() { };
flux.core.LogImpl.__name__ = ["flux","core","LogImpl"];
flux.core.LogImpl.format = function(type,msg,cat,inf) {
	var pos = "";
	if(inf != null) {
		if(inf.fileName != "Log.hx") pos = inf.fileName + ":" + inf.lineNumber;
	}
	var d = new Date();
	var category = cat != ""?"|" + cat:cat;
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	return "[" + pos + "|" + time + "|" + type + category + "]" + Std.string(msg);
};
flux.core.LogImpl.myTrace = function(v,inf) {
	flux.core.LogImpl.debug(v,"",inf);
};
flux.core.LogImpl.init = function(fileName) {
};
flux.core.LogImpl.write = function(msg,type) {
	if(msg != null) switch(type) {
	case "info":
		console.info(msg);
		break;
	case "warn":
		console.warn(msg);
		break;
	case "error":
		console.error(msg);
		break;
	case "debug":
		console.debug(msg);
		break;
	default:
		console.log(msg);
	}
};
flux.core.LogImpl.doTrace = function(type,category,msg,inf) {
	if(type == "error") {
		var stack = haxe.Stack.toString(haxe.Stack.exceptionStack());
		if(stack.length == 0) stack = "No haXe stack trace available";
		msg = Std.string(msg) + "\n" + stack;
	}
	flux.core.LogImpl.write(flux.core.LogImpl.format(type,msg,category,inf),type);
};
flux.core.LogImpl.info = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("info",category,msg,inf);
};
flux.core.LogImpl.warn = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("warn",category,msg,inf);
};
flux.core.LogImpl.error = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("error",category,msg,inf);
};
flux.core.LogImpl.debug = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("debug",category,msg,inf);
};
flux.core.LogImpl.prototype.__class__ = flux.core.LogImpl;
flux.core.ObservableImpl = $hxClasses['flux.core.ObservableImpl'] = function() {
	this._observers = [];
	this._unsubscribes = 0;
};
flux.core.ObservableImpl.__name__ = ["flux","core","ObservableImpl"];
flux.core.ObservableImpl.prototype.preNotify = null;
flux.core.ObservableImpl.prototype._unsubscribes = null;
flux.core.ObservableImpl.prototype._observers = null;
flux.core.ObservableImpl.prototype._event = null;
flux.core.ObservableImpl.prototype.notify = function(v) {
	if(this.preNotify != null) {
		v = this.preNotify(v);
		if(v == null) return;
	}
	var _g = 0, _g1 = this._observers;
	while(_g < _g1.length) {
		var ob = _g1[_g];
		++_g;
		if(ob.handler != null) ob.handler(v);
	}
};
flux.core.ObservableImpl.prototype.observe = function(cb,info) {
	var me = this;
	var h = { handler : cb, info : flux.Core.toOption(info)};
	this._observers.push(h);
	if(this._event != null) this._event.notify(flux.EOperation.Add(info));
	return function() {
		if(h.handler != null) {
			h.handler = null;
			me._unsubscribes++;
			if(me._unsubscribes >= flux.core.ObservableImpl.CLEANUP) me.cleanup();
			if(me._event != null) me._event.notify(flux.EOperation.Del(info));
		}
	};
};
flux.core.ObservableImpl.prototype.cleanup = function() {
	console.log("cleaning up");
	this._unsubscribes = 0;
	this._observers = flux.ArrayX.filter(this._observers,function(s) {
		if(s.handler == null) console.log("filtering " + Std.string(s.info));
		return s.handler != null;
	});
};
flux.core.ObservableImpl.prototype.peers = function() {
	return flux.ArrayX.map(flux.ArrayX.filter(this._observers,function(el) {
		return el.handler != null;
	}),function(el) {
		return el.info;
	});
};
flux.core.ObservableImpl.prototype.peek = function(cb) {
	if(this._event == null) this._event = new flux.core.ObservableImpl();
	this._event.observe(cb);
};
flux.core.ObservableImpl.prototype.removePeers = function() {
	flux.ArrayX.foreach(this._observers,function(s) {
		s.handler = null;
		s.info = null;
	});
	this._observers = [];
};
flux.core.ObservableImpl.prototype.__class__ = flux.core.ObservableImpl;
flux.core.ObservableImpl.__interfaces__ = [flux.Observable];
flux.core.PartBaseImpl = $hxClasses['flux.core.PartBaseImpl'] = function(parent,info) {
	var me = this;
	this._parent = parent;
	this._info = info;
	this._ID = flux.core.PartBaseImpl._nextID++;
	this._observers = [];
	this.partID = Type.getClassName(Type.getClass(this._parent)) + Std.string(this._ID);
	this._events = new flux.core.ObservableImpl();
	this.sstopper = function(d) {
		throw "Default stop function called for :" + me.partID + ". Add a stop function with stop_(stopFunction)";
		return null;
	};
};
flux.core.PartBaseImpl.__name__ = ["flux","core","PartBaseImpl"];
flux.core.PartBaseImpl.prototype.partID = null;
flux.core.PartBaseImpl.prototype._events = null;
flux.core.PartBaseImpl.prototype.state = null;
flux.core.PartBaseImpl.prototype._info = null;
flux.core.PartBaseImpl.prototype.sstopper = null;
flux.core.PartBaseImpl.prototype._observers = null;
flux.core.PartBaseImpl.prototype._ID = null;
flux.core.PartBaseImpl.prototype._parent = null;
flux.core.PartBaseImpl.prototype.peer = function() {
	return this._parent;
};
flux.core.PartBaseImpl.prototype.notify = function(e) {
	this._events.notify(flux.EPartState.Event(e));
};
flux.core.PartBaseImpl.prototype.notifyState = function(s) {
	this._events.notify(s);
};
flux.core.PartBaseImpl.prototype.observe = function(cb,info) {
	var unsub = this._events.observe(function(s) {
		var $e = (s);
		switch( $e[1] ) {
		case 2:
			var s1 = $e[2];
			cb(s1);
			break;
		default:
		}
	},this.partID);
	this._observers.push(unsub);
	return unsub;
};
flux.core.PartBaseImpl.prototype.observeState = function(cb) {
	this._events.observe(cb);
};
flux.core.PartBaseImpl.prototype.start = function(d,oc) {
	var me = this;
	var p = this._parent.start_(d,oc);
	this.checkErr("start",p);
	flux.OutcomeX.outcome(p,function(outcome) {
		me.partInfo("started");
		me.state = flux.EPartState.Started;
		me._events.notify(flux.EPartState.Started);
	},function(msg) {
		return me._events.notify(flux.EPartState.Error(Std.string(msg)));
	});
	return p;
};
flux.core.PartBaseImpl.prototype.stop = function(d) {
	var me = this;
	var p = this.sstopper(d);
	this.checkErr("stop",p);
	flux.OutcomeX.outcome(p,function(outcome) {
		me.state = flux.EPartState.Stopped;
		me.partInfo("stopped");
		me._events.notify(flux.EPartState.Stopped);
		flux.ArrayX.foreach(me._observers,function(observerRemove) {
			observerRemove();
		});
	},function(msg) {
		me._events.notify(flux.EPartState.Error(msg));
	});
	return p;
};
flux.core.PartBaseImpl.prototype.setStop = function(cb) {
	this.partInfo("with user stop_()");
	this.sstopper = cb;
};
flux.core.PartBaseImpl.prototype.partInfo = function(info) {
};
flux.core.PartBaseImpl.prototype.checkErr = function(type,outcome) {
	if(outcome == null) throw this.partID + " should not return null for " + type + " function";
	return outcome;
};
flux.core.PartBaseImpl.prototype.__class__ = flux.core.PartBaseImpl;
flux.core.PartBaseImpl.__interfaces__ = [flux.Part_];
if(typeof haxe=='undefined') haxe = {};
haxe.Http = $hxClasses['haxe.Http'] = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
};
haxe.Http.prototype.url = null;
haxe.Http.prototype.async = null;
haxe.Http.prototype.postData = null;
haxe.Http.prototype.headers = null;
haxe.Http.prototype.params = null;
haxe.Http.prototype.setHeader = function(header,value) {
	this.headers.set(header,value);
};
haxe.Http.prototype.setParameter = function(param,value) {
	this.params.set(param,value);
};
haxe.Http.prototype.setPostData = function(data) {
	this.postData = data;
};
haxe.Http.prototype.request = function(post) {
	var me = this;
	var r = new js.XMLHttpRequest();
	var onreadystatechange = function() {
		if(r.readyState != 4) return;
		var s = (function($this) {
			var $r;
			try {
				$r = r.status;
			} catch( e ) {
				$r = null;
			}
			return $r;
		}(this));
		if(s == undefined) s = null;
		if(s != null) me.onStatus(s);
		if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
		case null: case undefined:
			me.onError("Failed to connect or resolve host");
			break;
		case 12029:
			me.onError("Failed to connect to host");
			break;
		case 12007:
			me.onError("Unknown host");
			break;
		default:
			me.onError("Http Error #" + r.status);
		}
	};
	if(this.async) r.onreadystatechange = onreadystatechange;
	var uri = this.postData;
	if(uri != null) post = true; else {
		var $it0 = this.params.keys();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			if(uri == null) uri = ""; else uri += "&";
			uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
		}
	}
	try {
		if(post) r.open("POST",this.url,this.async); else if(uri != null) {
			var question = this.url.split("?").length <= 1;
			r.open("GET",this.url + (question?"?":"&") + uri,this.async);
			uri = null;
		} else r.open("GET",this.url,this.async);
	} catch( e ) {
		this.onError(e.toString());
		return;
	}
	if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var $it1 = this.headers.keys();
	while( $it1.hasNext() ) {
		var h = $it1.next();
		r.setRequestHeader(h,this.headers.get(h));
	}
	r.send(uri);
	if(!this.async) onreadystatechange();
};
haxe.Http.prototype.onData = function(data) {
};
haxe.Http.prototype.onError = function(msg) {
};
haxe.Http.prototype.onStatus = function(status) {
};
haxe.Http.prototype.__class__ = haxe.Http;
haxe.Json = $hxClasses['haxe.Json'] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
};
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
};
haxe.Json.prototype.buf = null;
haxe.Json.prototype.str = null;
haxe.Json.prototype.pos = null;
haxe.Json.prototype.reg_float = null;
haxe.Json.prototype.toString = function(v) {
	this.buf = new StringBuf();
	this.toStringRec(v);
	return this.buf.b.join("");
};
haxe.Json.prototype.fieldsString = function(v,fields) {
	var first = true;
	this.buf.add("{");
	var _g = 0;
	while(_g < fields.length) {
		var f = fields[_g];
		++_g;
		var value = Reflect.field(v,f);
		if(Reflect.isFunction(value)) continue;
		if(first) first = false; else this.buf.add(",");
		this.quote(f);
		this.buf.add(":");
		this.toStringRec(value);
	}
	this.buf.add("}");
};
haxe.Json.prototype.objString = function(v) {
	this.fieldsString(v,Reflect.fields(v));
};
haxe.Json.prototype.toStringRec = function(v) {
	var $e = (Type["typeof"](v));
	switch( $e[1] ) {
	case 8:
		this.buf.add("\"???\"");
		break;
	case 4:
		this.objString(v);
		break;
	case 1:
	case 2:
		this.buf.add(v);
		break;
	case 5:
		this.buf.add("\"<fun>\"");
		break;
	case 6:
		var c = $e[2];
		if(c == String) this.quote(v); else if(c == Array) {
			var v1 = v;
			this.buf.add("[");
			var len = v1.length;
			if(len > 0) {
				this.toStringRec(v1[0]);
				var i = 1;
				while(i < len) {
					this.buf.add(",");
					this.toStringRec(v1[i++]);
				}
			}
			this.buf.add("]");
		} else if(c == Hash) {
			var v1 = v;
			var o = { };
			var $it0 = v1.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				o[k] = v1.get(k);
			}
			this.objString(o);
		} else this.objString(v);
		break;
	case 7:
		var e = $e[2];
		this.buf.add(v[1]);
		break;
	case 3:
		this.buf.add(v?"true":"false");
		break;
	case 0:
		this.buf.add("null");
		break;
	}
};
haxe.Json.prototype.quote = function(s) {
	this.buf.add("\"");
	var i = 0;
	while(true) {
		var c = s.charCodeAt(i++);
		if(c != c) break;
		switch(c) {
		case 34:
			this.buf.add("\\\"");
			break;
		case 92:
			this.buf.add("\\\\");
			break;
		case 10:
			this.buf.add("\\n");
			break;
		case 13:
			this.buf.add("\\r");
			break;
		case 9:
			this.buf.add("\\t");
			break;
		case 8:
			this.buf.add("\\b");
			break;
		case 12:
			this.buf.add("\\f");
			break;
		default:
			this.buf.addChar(c);
		}
	}
	this.buf.add("\"");
};
haxe.Json.prototype.doParse = function(str) {
	this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
	this.str = str;
	this.pos = 0;
	return this.parseRec();
};
haxe.Json.prototype.invalidChar = function() {
	this.pos--;
	throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
};
haxe.Json.prototype.nextChar = function() {
	return this.str.charCodeAt(this.pos++);
};
haxe.Json.prototype.parseRec = function() {
	while(true) {
		var c = this.str.charCodeAt(this.pos++);
		switch(c) {
		case 32:case 13:case 10:case 9:
			break;
		case 123:
			var obj = { }, field = null, comma = null;
			while(true) {
				var c1 = this.str.charCodeAt(this.pos++);
				switch(c1) {
				case 32:case 13:case 10:case 9:
					break;
				case 125:
					if(field != null || comma == false) this.invalidChar();
					return obj;
				case 58:
					if(field == null) this.invalidChar();
					obj[field] = this.parseRec();
					field = null;
					comma = true;
					break;
				case 44:
					if(comma) comma = false; else this.invalidChar();
					break;
				case 34:
					if(comma) this.invalidChar();
					field = this.parseString();
					break;
				default:
					this.invalidChar();
				}
			}
			break;
		case 91:
			var arr = [], comma = null;
			while(true) {
				var c1 = this.str.charCodeAt(this.pos++);
				switch(c1) {
				case 32:case 13:case 10:case 9:
					break;
				case 93:
					if(comma == false) this.invalidChar();
					return arr;
				case 44:
					if(comma) comma = false; else this.invalidChar();
					break;
				default:
					if(comma) this.invalidChar();
					this.pos--;
					arr.push(this.parseRec());
					comma = true;
				}
			}
			break;
		case 116:
			var save = this.pos;
			if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
				this.pos = save;
				this.invalidChar();
			}
			return true;
		case 102:
			var save = this.pos;
			if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
				this.pos = save;
				this.invalidChar();
			}
			return false;
		case 110:
			var save = this.pos;
			if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
				this.pos = save;
				this.invalidChar();
			}
			return null;
		case 34:
			return this.parseString();
		case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
			this.pos--;
			if(!this.reg_float.match(HxOverrides.substr(this.str,this.pos,null))) throw "Invalid float at position " + this.pos;
			var v = this.reg_float.matched(0);
			this.pos += v.length;
			var f = Std.parseFloat(v);
			var i = f | 0;
			return i == f?i:f;
		default:
			this.invalidChar();
		}
	}
};
haxe.Json.prototype.parseString = function() {
	var start = this.pos;
	var buf = new StringBuf();
	while(true) {
		var c = this.str.charCodeAt(this.pos++);
		if(c == 34) break;
		if(c == 92) {
			buf.b[buf.b.length] = HxOverrides.substr(this.str,start,this.pos - start - 1);
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 114:
				buf.b[buf.b.length] = String.fromCharCode(13);
				break;
			case 110:
				buf.b[buf.b.length] = String.fromCharCode(10);
				break;
			case 116:
				buf.b[buf.b.length] = String.fromCharCode(9);
				break;
			case 98:
				buf.b[buf.b.length] = String.fromCharCode(8);
				break;
			case 102:
				buf.b[buf.b.length] = String.fromCharCode(12);
				break;
			case 47:case 92:case 34:
				buf.b[buf.b.length] = String.fromCharCode(c);
				break;
			case 117:
				var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
				this.pos += 4;
				buf.b[buf.b.length] = String.fromCharCode(uc);
				break;
			default:
				throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
			}
			start = this.pos;
		} else if(c != c) throw "Unclosed string";
	}
	buf.b[buf.b.length] = HxOverrides.substr(this.str,start,this.pos - start - 1);
	return buf.b.join("");
};
haxe.Json.prototype.__class__ = haxe.Json;
haxe.Serializer = $hxClasses['haxe.Serializer'] = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
};
haxe.Serializer.prototype.buf = null;
haxe.Serializer.prototype.cache = null;
haxe.Serializer.prototype.shash = null;
haxe.Serializer.prototype.scount = null;
haxe.Serializer.prototype.useCache = null;
haxe.Serializer.prototype.useEnumIndex = null;
haxe.Serializer.prototype.toString = function() {
	return this.buf.b.join("");
};
haxe.Serializer.prototype.serializeString = function(s) {
	var x = this.shash.get(s);
	if(x != null) {
		this.buf.add("R");
		this.buf.add(x);
		return;
	}
	this.shash.set(s,this.scount++);
	this.buf.add("y");
	s = StringTools.urlEncode(s);
	this.buf.add(s.length);
	this.buf.add(":");
	this.buf.add(s);
};
haxe.Serializer.prototype.serializeRef = function(v) {
	var vt = typeof(v);
	var _g1 = 0, _g = this.cache.length;
	while(_g1 < _g) {
		var i = _g1++;
		var ci = this.cache[i];
		if(typeof(ci) == vt && ci == v) {
			this.buf.add("r");
			this.buf.add(i);
			return true;
		}
	}
	this.cache.push(v);
	return false;
};
haxe.Serializer.prototype.serializeFields = function(v) {
	var _g = 0, _g1 = Reflect.fields(v);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		this.serializeString(f);
		this.serialize(Reflect.field(v,f));
	}
	this.buf.add("g");
};
haxe.Serializer.prototype.serialize = function(v) {
	var $e = (Type["typeof"](v));
	switch( $e[1] ) {
	case 0:
		this.buf.add("n");
		break;
	case 1:
		if(v == 0) {
			this.buf.add("z");
			return;
		}
		this.buf.add("i");
		this.buf.add(v);
		break;
	case 2:
		if(Math.isNaN(v)) this.buf.add("k"); else if(!Math.isFinite(v)) this.buf.add(v < 0?"m":"p"); else {
			this.buf.add("d");
			this.buf.add(v);
		}
		break;
	case 3:
		this.buf.add(v?"t":"f");
		break;
	case 6:
		var c = $e[2];
		if(c == String) {
			this.serializeString(v);
			return;
		}
		if(this.useCache && this.serializeRef(v)) return;
		switch(c) {
		case Array:
			var ucount = 0;
			this.buf.add("a");
			var l = v.length;
			var _g = 0;
			while(_g < l) {
				var i = _g++;
				if(v[i] == null) ucount++; else {
					if(ucount > 0) {
						if(ucount == 1) this.buf.add("n"); else {
							this.buf.add("u");
							this.buf.add(ucount);
						}
						ucount = 0;
					}
					this.serialize(v[i]);
				}
			}
			if(ucount > 0) {
				if(ucount == 1) this.buf.add("n"); else {
					this.buf.add("u");
					this.buf.add(ucount);
				}
			}
			this.buf.add("h");
			break;
		case List:
			this.buf.add("l");
			var v1 = v;
			var $it0 = v1.iterator();
			while( $it0.hasNext() ) {
				var i = $it0.next();
				this.serialize(i);
			}
			this.buf.add("h");
			break;
		case Date:
			var d = v;
			this.buf.add("v");
			this.buf.add(HxOverrides.dateStr(d));
			break;
		case Hash:
			this.buf.add("b");
			var v1 = v;
			var $it1 = v1.keys();
			while( $it1.hasNext() ) {
				var k = $it1.next();
				this.serializeString(k);
				this.serialize(v1.get(k));
			}
			this.buf.add("h");
			break;
		case IntHash:
			this.buf.add("q");
			var v1 = v;
			var $it2 = v1.keys();
			while( $it2.hasNext() ) {
				var k = $it2.next();
				this.buf.add(":");
				this.buf.add(k);
				this.serialize(v1.get(k));
			}
			this.buf.add("h");
			break;
		case haxe.io.Bytes:
			var v1 = v;
			var i = 0;
			var max = v1.length - 2;
			var chars = "";
			var b64 = haxe.Serializer.BASE64;
			while(i < max) {
				var b1 = v1.b[i++];
				var b2 = v1.b[i++];
				var b3 = v1.b[i++];
				chars += b64.charAt(b1 >> 2) + b64.charAt((b1 << 4 | b2 >> 4) & 63) + b64.charAt((b2 << 2 | b3 >> 6) & 63) + b64.charAt(b3 & 63);
			}
			if(i == max) {
				var b1 = v1.b[i++];
				var b2 = v1.b[i++];
				chars += b64.charAt(b1 >> 2) + b64.charAt((b1 << 4 | b2 >> 4) & 63) + b64.charAt(b2 << 2 & 63);
			} else if(i == max + 1) {
				var b1 = v1.b[i++];
				chars += b64.charAt(b1 >> 2) + b64.charAt(b1 << 4 & 63);
			}
			this.buf.add("s");
			this.buf.add(chars.length);
			this.buf.add(":");
			this.buf.add(chars);
			break;
		default:
			this.cache.pop();
			if(v.hxSerialize != null) {
				this.buf.add("C");
				this.serializeString(Type.getClassName(c));
				this.cache.push(v);
				v.hxSerialize(this);
				this.buf.add("g");
			} else {
				this.buf.add("c");
				this.serializeString(Type.getClassName(c));
				this.cache.push(v);
				this.serializeFields(v);
			}
		}
		break;
	case 4:
		if(this.useCache && this.serializeRef(v)) return;
		this.buf.add("o");
		this.serializeFields(v);
		break;
	case 7:
		var e = $e[2];
		if(this.useCache && this.serializeRef(v)) return;
		this.cache.pop();
		this.buf.add(this.useEnumIndex?"j":"w");
		this.serializeString(Type.getEnumName(e));
		if(this.useEnumIndex) {
			this.buf.add(":");
			this.buf.add(v[1]);
		} else this.serializeString(v[0]);
		this.buf.add(":");
		var l = v.length;
		this.buf.add(l - 2);
		var _g = 2;
		while(_g < l) {
			var i = _g++;
			this.serialize(v[i]);
		}
		this.cache.push(v);
		break;
	case 5:
		throw "Cannot serialize function";
		break;
	default:
		throw "Cannot serialize " + Std.string(v);
	}
};
haxe.Serializer.prototype.serializeException = function(e) {
	this.buf.add("x");
	this.serialize(e);
};
haxe.Serializer.prototype.__class__ = haxe.Serializer;
haxe.StackItem = $hxClasses['haxe.StackItem'] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] };
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.Stack = $hxClasses['haxe.Stack'] = function() { };
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	return [];
};
haxe.Stack.exceptionStack = function() {
	return [];
};
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b[b.b.length] = "\nCalled from ";
		haxe.Stack.itemToString(b,s);
	}
	return b.b.join("");
};
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b[b.b.length] = "a C function";
		break;
	case 1:
		var m = $e[2];
		b.b[b.b.length] = "module ";
		b.b[b.b.length] = m == null?"null":m;
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b[b.b.length] = " (";
		}
		b.b[b.b.length] = file == null?"null":file;
		b.b[b.b.length] = " line ";
		b.b[b.b.length] = line == null?"null":line;
		if(s1 != null) b.b[b.b.length] = ")";
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b[b.b.length] = cname == null?"null":cname;
		b.b[b.b.length] = ".";
		b.b[b.b.length] = meth == null?"null":meth;
		break;
	case 4:
		var n = $e[2];
		b.b[b.b.length] = "local function #";
		b.b[b.b.length] = n == null?"null":n;
		break;
	}
};
haxe.Stack.makeStack = function(s) {
	return null;
};
haxe.Stack.prototype.__class__ = haxe.Stack;
haxe.Unserializer = $hxClasses['haxe.Unserializer'] = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype.buf = null;
haxe.Unserializer.prototype.pos = null;
haxe.Unserializer.prototype.length = null;
haxe.Unserializer.prototype.cache = null;
haxe.Unserializer.prototype.scache = null;
haxe.Unserializer.prototype.resolver = null;
haxe.Unserializer.prototype.setResolver = function(r) {
	if(r == null) this.resolver = { resolveClass : function(_) {
		return null;
	}, resolveEnum : function(_) {
		return null;
	}}; else this.resolver = r;
};
haxe.Unserializer.prototype.getResolver = function() {
	return this.resolver;
};
haxe.Unserializer.prototype.get = function(p) {
	return this.buf.charCodeAt(p);
};
haxe.Unserializer.prototype.readDigits = function() {
	var k = 0;
	var s = false;
	var fpos = this.pos;
	while(true) {
		var c = this.buf.charCodeAt(this.pos);
		if(c != c) break;
		if(c == 45) {
			if(this.pos != fpos) break;
			s = true;
			this.pos++;
			continue;
		}
		if(c < 48 || c > 57) break;
		k = k * 10 + (c - 48);
		this.pos++;
	}
	if(s) k *= -1;
	return k;
};
haxe.Unserializer.prototype.unserializeObject = function(o) {
	while(true) {
		if(this.pos >= this.length) throw "Invalid object";
		if(this.buf.charCodeAt(this.pos) == 103) break;
		var k = this.unserialize();
		if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
		var v = this.unserialize();
		o[k] = v;
	}
	this.pos++;
};
haxe.Unserializer.prototype.unserializeEnum = function(edecl,tag) {
	if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
	var nargs = this.readDigits();
	if(nargs == 0) return Type.createEnum(edecl,tag);
	var args = new Array();
	while(nargs-- > 0) args.push(this.unserialize());
	return Type.createEnum(edecl,tag,args);
};
haxe.Unserializer.prototype.unserialize = function() {
	switch(this.buf.charCodeAt(this.pos++)) {
	case 110:
		return null;
	case 116:
		return true;
	case 102:
		return false;
	case 122:
		return 0;
	case 105:
		return this.readDigits();
	case 100:
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	case 121:
		var len = this.readDigits();
		if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
		var s = HxOverrides.substr(this.buf,this.pos,len);
		this.pos += len;
		s = StringTools.urlDecode(s);
		this.scache.push(s);
		return s;
	case 107:
		return Math.NaN;
	case 109:
		return Math.NEGATIVE_INFINITY;
	case 112:
		return Math.POSITIVE_INFINITY;
	case 97:
		var buf = this.buf;
		var a = new Array();
		this.cache.push(a);
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c == 104) {
				this.pos++;
				break;
			}
			if(c == 117) {
				this.pos++;
				var n = this.readDigits();
				a[a.length + n - 1] = null;
			} else a.push(this.unserialize());
		}
		return a;
	case 111:
		var o = { };
		this.cache.push(o);
		this.unserializeObject(o);
		return o;
	case 114:
		var n = this.readDigits();
		if(n < 0 || n >= this.cache.length) throw "Invalid reference";
		return this.cache[n];
	case 82:
		var n = this.readDigits();
		if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
		return this.scache[n];
	case 120:
		throw this.unserialize();
		break;
	case 99:
		var name = this.unserialize();
		var cl = this.resolver.resolveClass(name);
		if(cl == null) throw "Class not found " + name;
		var o = Type.createEmptyInstance(cl);
		this.cache.push(o);
		this.unserializeObject(o);
		return o;
	case 119:
		var name = this.unserialize();
		var edecl = this.resolver.resolveEnum(name);
		if(edecl == null) throw "Enum not found " + name;
		var e = this.unserializeEnum(edecl,this.unserialize());
		this.cache.push(e);
		return e;
	case 106:
		var name = this.unserialize();
		var edecl = this.resolver.resolveEnum(name);
		if(edecl == null) throw "Enum not found " + name;
		this.pos++;
		var index = this.readDigits();
		var tag = Type.getEnumConstructs(edecl)[index];
		if(tag == null) throw "Unknown enum index " + name + "@" + index;
		var e = this.unserializeEnum(edecl,tag);
		this.cache.push(e);
		return e;
	case 108:
		var l = new List();
		this.cache.push(l);
		var buf = this.buf;
		while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
		this.pos++;
		return l;
	case 98:
		var h = new Hash();
		this.cache.push(h);
		var buf = this.buf;
		while(this.buf.charCodeAt(this.pos) != 104) {
			var s = this.unserialize();
			h.set(s,this.unserialize());
		}
		this.pos++;
		return h;
	case 113:
		var h = new IntHash();
		this.cache.push(h);
		var buf = this.buf;
		var c = this.buf.charCodeAt(this.pos++);
		while(c == 58) {
			var i = this.readDigits();
			h.set(i,this.unserialize());
			c = this.buf.charCodeAt(this.pos++);
		}
		if(c != 104) throw "Invalid IntHash format";
		return h;
	case 118:
		var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
		this.cache.push(d);
		this.pos += 19;
		return d;
	case 115:
		var len = this.readDigits();
		var buf = this.buf;
		if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
		var codes = haxe.Unserializer.CODES;
		if(codes == null) {
			codes = haxe.Unserializer.initCodes();
			haxe.Unserializer.CODES = codes;
		}
		var i = this.pos;
		var rest = len & 3;
		var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
		var max = i + (len - rest);
		var bytes = haxe.io.Bytes.alloc(size);
		var bpos = 0;
		while(i < max) {
			var c1 = codes[buf.charCodeAt(i++)];
			var c2 = codes[buf.charCodeAt(i++)];
			bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
			var c3 = codes[buf.charCodeAt(i++)];
			bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
			var c4 = codes[buf.charCodeAt(i++)];
			bytes.b[bpos++] = (c3 << 6 | c4) & 255;
		}
		if(rest >= 2) {
			var c1 = codes[buf.charCodeAt(i++)];
			var c2 = codes[buf.charCodeAt(i++)];
			bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
			if(rest == 3) {
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
			}
		}
		this.pos += len;
		this.cache.push(bytes);
		return bytes;
	case 67:
		var name = this.unserialize();
		var cl = this.resolver.resolveClass(name);
		if(cl == null) throw "Class not found " + name;
		var o = Type.createEmptyInstance(cl);
		this.cache.push(o);
		o.hxUnserialize(this);
		if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
		return o;
	default:
	}
	this.pos--;
	throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
};
haxe.Unserializer.prototype.__class__ = haxe.Unserializer;
if(!haxe.io) haxe.io = {};
haxe.io.Bytes = $hxClasses['haxe.io.Bytes'] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.prototype.length = null;
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.get = function(pos) {
	return this.b[pos];
};
haxe.io.Bytes.prototype.set = function(pos,v) {
	this.b[pos] = v & 255;
};
haxe.io.Bytes.prototype.blit = function(pos,src,srcpos,len) {
	if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
	var b1 = this.b;
	var b2 = src.b;
	if(b1 == b2 && pos > srcpos) {
		var i = len;
		while(i > 0) {
			i--;
			b1[i + pos] = b2[i + srcpos];
		}
		return;
	}
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		b1[i + pos] = b2[i + srcpos];
	}
};
haxe.io.Bytes.prototype.sub = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
};
haxe.io.Bytes.prototype.compare = function(other) {
	var b1 = this.b;
	var b2 = other.b;
	var len = this.length < other.length?this.length:other.length;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		if(b1[i] != b2[i]) return b1[i] - b2[i];
	}
	return this.length - other.length;
};
haxe.io.Bytes.prototype.readString = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	var s = "";
	var b = this.b;
	var fcc = String.fromCharCode;
	var i = pos;
	var max = pos + len;
	while(i < max) {
		var c = b[i++];
		if(c < 128) {
			if(c == 0) break;
			s += fcc(c);
		} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
			var c2 = b[i++];
			s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
		} else {
			var c2 = b[i++];
			var c3 = b[i++];
			s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
		}
	}
	return s;
};
haxe.io.Bytes.prototype.toString = function() {
	return this.readString(0,this.length);
};
haxe.io.Bytes.prototype.toHex = function() {
	var s = new StringBuf();
	var chars = [];
	var str = "0123456789abcdef";
	var _g1 = 0, _g = str.length;
	while(_g1 < _g) {
		var i = _g1++;
		chars.push(HxOverrides.cca(str,i));
	}
	var _g1 = 0, _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = this.b[i];
		s.b[s.b.length] = String.fromCharCode(chars[c >> 4]);
		s.b[s.b.length] = String.fromCharCode(chars[c & 15]);
	}
	return s.b.join("");
};
haxe.io.Bytes.prototype.getData = function() {
	return this.b;
};
haxe.io.Bytes.prototype.__class__ = haxe.io.Bytes;
haxe.io.Error = $hxClasses['haxe.io.Error'] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
if(!haxe.remoting) haxe.remoting = {};
haxe.remoting.AsyncConnection = $hxClasses['haxe.remoting.AsyncConnection'] = function() { };
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype.resolve = null;
haxe.remoting.AsyncConnection.prototype.call = null;
haxe.remoting.AsyncConnection.prototype.setErrorHandler = null;
haxe.remoting.AsyncConnection.prototype.__class__ = haxe.remoting.AsyncConnection;
haxe.remoting.HttpAsyncConnection = $hxClasses['haxe.remoting.HttpAsyncConnection'] = function(data,path) {
	this.__data = data;
	this.__path = path;
};
haxe.remoting.HttpAsyncConnection.__name__ = ["haxe","remoting","HttpAsyncConnection"];
haxe.remoting.HttpAsyncConnection.urlConnect = function(url) {
	return new haxe.remoting.HttpAsyncConnection({ url : url, error : function(e) {
		throw e;
	}},[]);
};
haxe.remoting.HttpAsyncConnection.prototype.__data = null;
haxe.remoting.HttpAsyncConnection.prototype.__path = null;
haxe.remoting.HttpAsyncConnection.prototype.resolve = function(name) {
	var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.slice());
	c.__path.push(name);
	return c;
};
haxe.remoting.HttpAsyncConnection.prototype.setErrorHandler = function(h) {
	this.__data.error = h;
};
haxe.remoting.HttpAsyncConnection.prototype.call = function(params,onResult) {
	var h = new haxe.Http(this.__data.url);
	var s = new haxe.Serializer();
	s.serialize(this.__path);
	s.serialize(params);
	h.setHeader("X-Haxe-Remoting","1");
	h.setParameter("__x",s.toString());
	var error = this.__data.error;
	h.onData = function(response) {
		var ok = true;
		var ret;
		try {
			if(HxOverrides.substr(response,0,3) != "hxr") throw "Invalid response : '" + response + "'";
			var s1 = new haxe.Unserializer(HxOverrides.substr(response,3,null));
			ret = s1.unserialize();
		} catch( err ) {
			ret = null;
			ok = false;
			error(err);
		}
		if(ok && onResult != null) onResult(ret);
	};
	h.onError = error;
	h.request(true);
};
haxe.remoting.HttpAsyncConnection.prototype.__class__ = haxe.remoting.HttpAsyncConnection;
haxe.remoting.HttpAsyncConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
if(typeof js=='undefined') js = {};
js.Boot = $hxClasses['js.Boot'] = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
};
js.Boot.isClass = function(o) {
	return o.__name__;
};
js.Boot.isEnum = function(e) {
	return e.__ename__;
};
js.Boot.getClass = function(o) {
	return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Boot.prototype.__class__ = js.Boot;
Array.prototype.indexOf?HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}:null;
{
	Math.__name__ = ["Math"];
	Math.NaN = Number.NaN;
	Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
	Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
	$hxClasses.Math = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
};
{
	String.prototype.__class__ = $hxClasses.String = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses.Array = Array;
	Array.__name__ = ["Array"];
	Date.prototype.__class__ = $hxClasses.Date = Date;
	Date.__name__ = ["Date"];
	var Int = $hxClasses.Int = { __name__ : ["Int"]};
	var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
	var Float = $hxClasses.Float = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses.Bool = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses.Class = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses.Void = { __ename__ : ["Void"]};
};
if(typeof(JSON) != "undefined") haxe.Json = JSON;
{
	var q = window.jQuery;
	js.JQuery = q;
	q.fn.iterator = function() {
		return { pos : 0, j : this, hasNext : function() {
			return this.pos < this.j.length;
		}, next : function() {
			return $(this.j[this.pos++]);
		}};
	};
};
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
flux.Core.VER = "0.5";
;
flux.Core.CSROOT = "/__cs/";
;
flux.core.ObservableImpl.CLEANUP = 1;
;
flux.core.PartBaseImpl.runningParts = [];
;
flux.core.PartBaseImpl._nextID = 0;
;
haxe.Serializer.USE_CACHE = false;
;
haxe.Serializer.USE_ENUM_INDEX = false;
;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
;
haxe.Unserializer.DEFAULT_RESOLVER = Type;
;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
;
haxe.Unserializer.CODES = null;
;
Client.main();
