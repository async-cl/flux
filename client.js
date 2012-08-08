var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
var Client = $hxClasses["Client"] = function() { }
Client.__name__ = ["Client"];
Client.content = null;
Client.contentSide = null;
Client.main = function() {
	new js.JQuery("").ready(function(e) {
		Client.content = new js.JQuery("#main-content");
		Client.contentSide = new js.JQuery("#main-content-side");
		Client.loadFront();
	});
}
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
		Client.getUrl("/manual.json",function(json) {
			var meta = haxe.Json.parse(json);
			console.log("got meta" + json);
			meta.sort(Client.sortByIndex);
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
}
Client.recentBlog = function(onMeta) {
	Client.contentSide.html("<ul id=\"links\"></ul>");
	var blogLinks = new js.JQuery("#links");
	blogLinks.append("<h3>Recent Blog</h3><hr/>");
	Client.getUrl("/blog.json",function(json) {
		var meta = haxe.Json.parse(json);
		if(onMeta != null) onMeta(meta);
		var _g = 0;
		while(_g < meta.length) {
			var m = meta[_g];
			++_g;
			var p = "/blog/" + m.fileName + ".html", a = "<a id=\"" + m.fileName + "\" href=\"" + p + "\" target=\"frame-content\">" + m.title + " </a>";
			blogLinks.append("<li class=\"recent\">" + a + "</li>");
		}
	});
}
Client.sortByIndex = function(a,b) {
	var da = Std.parseInt(a.index), db = Std.parseInt(b.index);
	return da - db;
}
Client.getUrl = function(url,cb) {
	var u = new haxe.Http(url);
	u.onData = cb;
	u.request(false);
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
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
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
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
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var SiteRemotes = $hxClasses["SiteRemotes"] = function() {
	SiteRemotes.metaCache = new Hash();
};
SiteRemotes.__name__ = ["SiteRemotes"];
SiteRemotes.metaCache = null;
SiteRemotes.updateCache = function(dir,cb) {
}
SiteRemotes.prototype = {
	index: function(dir,cb) {
	}
	,__class__: SiteRemotes
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
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
}
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
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
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
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
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
}
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
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
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
}
var flux = flux || {}
flux.Option = $hxClasses["flux.Option"] = { __ename__ : ["flux","Option"], __constructs__ : ["None","Some"] }
flux.Option.None = ["None",0];
flux.Option.None.toString = $estr;
flux.Option.None.__enum__ = flux.Option;
flux.Option.Some = function(v) { var $x = ["Some",1,v]; $x.__enum__ = flux.Option; $x.toString = $estr; return $x; }
flux.Either = $hxClasses["flux.Either"] = { __ename__ : ["flux","Either"], __constructs__ : ["Left","Right"] }
flux.Either.Left = function(v) { var $x = ["Left",0,v]; $x.__enum__ = flux.Either; $x.toString = $estr; return $x; }
flux.Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = flux.Either; $x.toString = $estr; return $x; }
flux.Future = $hxClasses["flux.Future"] = function() { }
flux.Future.__name__ = ["flux","Future"];
flux.Future.prototype = {
	toArray: null
	,toOption: null
	,value: null
	,filter: null
	,flatMap: null
	,map: null
	,isDelivered: null
	,isDone: null
	,cancel: null
	,allowCancelOnlyIf: null
	,ifCanceled: null
	,isCanceled: null
	,deliver: null
	,resolve: null
	,__class__: flux.Future
}
flux.EOperation = $hxClasses["flux.EOperation"] = { __ename__ : ["flux","EOperation"], __constructs__ : ["Add","Del"] }
flux.EOperation.Add = function(info) { var $x = ["Add",0,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; }
flux.EOperation.Del = function(info) { var $x = ["Del",1,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; }
flux.Startable = $hxClasses["flux.Startable"] = function() { }
flux.Startable.__name__ = ["flux","Startable"];
flux.Startable.prototype = {
	start_: null
	,__class__: flux.Startable
}
flux.Stoppable = $hxClasses["flux.Stoppable"] = function() { }
flux.Stoppable.__name__ = ["flux","Stoppable"];
flux.Stoppable.prototype = {
	stop_: null
	,__class__: flux.Stoppable
}
flux.Infoable = $hxClasses["flux.Infoable"] = function() { }
flux.Infoable.__name__ = ["flux","Infoable"];
flux.Infoable.prototype = {
	info_: null
	,__class__: flux.Infoable
}
flux.Life = $hxClasses["flux.Life"] = { __ename__ : ["flux","Life"], __constructs__ : ["Started","Stopped"] }
flux.Life.Started = function(q) { var $x = ["Started",0,q]; $x.__enum__ = flux.Life; $x.toString = $estr; return $x; }
flux.Life.Stopped = function(q) { var $x = ["Stopped",1,q]; $x.__enum__ = flux.Life; $x.toString = $estr; return $x; }
flux.Observable = $hxClasses["flux.Observable"] = function() { }
flux.Observable.__name__ = ["flux","Observable"];
flux.Observable.prototype = {
	peek: null
	,removePeers: null
	,peers: null
	,observe: null
	,notify: null
	,__class__: flux.Observable
}
flux.ObservableDelegate = $hxClasses["flux.ObservableDelegate"] = function() { }
flux.ObservableDelegate.__name__ = ["flux","ObservableDelegate"];
flux.ObservableDelegate.prototype = {
	observable_: null
	,__class__: flux.ObservableDelegate
}
flux.ObservableDelegateX = $hxClasses["flux.ObservableDelegateX"] = function() { }
flux.ObservableDelegateX.__name__ = ["flux","ObservableDelegateX"];
flux.ObservableDelegateX.notify = function(od,o) {
	od.observable_().notify(o);
}
flux.ObservableDelegateX.observe = function(od,cb,info) {
	return od.observable_().observe(cb,info);
}
flux.ObservableDelegateX.peers = function(od) {
	return od.observable_().peers();
}
flux.ObservableDelegateX.removePeers = function(od) {
	od.observable_().removePeers();
}
flux.ObservableDelegateX.peek = function(od,cb) {
	od.observable_().peek(cb);
}
flux.Core = $hxClasses["flux.Core"] = function() { }
flux.Core.__name__ = ["flux","Core"];
flux.Core.life = null;
flux.Core.init = function() {
	flux.Core.life = new flux.core.ObservableImpl();
	flux.core.LogImpl.init(null);
}
flux.Core.future = function() {
	return new flux.core.FutureImpl();
}
flux.Core.outcome = function(cancel) {
	return new flux.core.FutureImpl();
}
flux.Core.cancelledFuture = function() {
	return flux.core.FutureImpl.dead();
}
flux.Core.observable = function() {
	return new flux.core.ObservableImpl();
}
flux.Core.toOption = function(t) {
	return t == null?flux.Option.None:flux.Option.Some(t);
}
flux.Core.logInit = function(fileName) {
	flux.core.LogImpl.init(fileName);
}
flux.Core.info = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.info(msg,category,inf);
}
flux.Core.warn = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.warn(msg,category,inf);
}
flux.Core.error = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.error(msg,category,inf);
}
flux.Core.debug = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.debug(msg,category,inf);
}
flux.Core.parse = function(str) {
	return haxe.Json.parse(str);
}
flux.Core.stringify = function(obj) {
	return haxe.Json.stringify(obj);
}
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
}
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
}
flux.Core.assert = function(cond,pos) {
	if(!cond) flux.core.LogImpl.error("Assert failed in " + pos.className + "::" + pos.methodName,"",pos);
}
flux.StartableX = $hxClasses["flux.StartableX"] = function() { }
flux.StartableX.__name__ = ["flux","StartableX"];
flux.StartableX.start = function(s,p,foc) {
	if(foc == null) foc = new flux.core.FutureImpl();
	var oc = new flux.core.FutureImpl();
	oc.deliver(function(o) {
		flux.OptionX.foreach(flux.EitherX.right(o),function(e) {
			if(js.Boot.__instanceof(e,flux.Infoable)) {
				var i = e;
				flux.Core.life.notify(flux.Life.Started(i.info_()));
			}
		});
		foc.resolve(o);
	});
	s.start_(p,oc);
	return foc;
}
flux.StoppableX = $hxClasses["flux.StoppableX"] = function() { }
flux.StoppableX.__name__ = ["flux","StoppableX"];
flux.StoppableX.stop = function(s,p,oc) {
	if(oc == null) oc = new flux.core.FutureImpl();
	return s.stop_(p,oc);
}
flux.DynamicX = $hxClasses["flux.DynamicX"] = function() { }
flux.DynamicX.__name__ = ["flux","DynamicX"];
flux.DynamicX.into = function(a,f) {
	return f(a);
}
flux.DynamicX.isInstanceOf = function(o,c) {
	return js.Boot.__instanceof(o,c);
}
flux.DynamicX.toThunk = function(t) {
	return function() {
		return t;
	};
}
flux.DynamicX.stringify = function(o) {
	return JSON.stringify(o);
}
flux.BoolX = $hxClasses["flux.BoolX"] = function() { }
flux.BoolX.__name__ = ["flux","BoolX"];
flux.BoolX.toInt = function(v) {
	return v?1:0;
}
flux.BoolX.ifTrue = function(v,f) {
	return v?flux.Option.Some(f()):flux.Option.None;
}
flux.BoolX.ifFalse = function(v,f) {
	return !v?flux.Option.Some(f()):flux.Option.None;
}
flux.BoolX.ifElse = function(v,f1,f2) {
	return v?f1():f2();
}
flux.BoolX.compare = function(v1,v2) {
	return !v1 && v2?-1:v1 && !v2?1:0;
}
flux.BoolX.equals = function(v1,v2) {
	return v1 == v2;
}
flux.BoolX.hashCode = function(v) {
	return v?786433:393241;
}
flux.BoolX.toString = function(v) {
	return v?"true":"false";
}
flux.IntX = $hxClasses["flux.IntX"] = function() { }
flux.IntX.__name__ = ["flux","IntX"];
flux.IntX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
}
flux.IntX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
}
flux.IntX.toBool = function(v) {
	return v == 0?false:true;
}
flux.IntX.toFloat = function(v) {
	return v;
}
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
}
flux.IntX.until = function(start,end) {
	return flux.IntX.to(start,end - 1);
}
flux.IntX.compare = function(v1,v2) {
	return v1 - v2;
}
flux.IntX.equals = function(v1,v2) {
	return v1 == v2;
}
flux.IntX.toString = function(v) {
	return "" + v;
}
flux.IntX.hashCode = function(v) {
	return v * 196613;
}
flux.FloatX = $hxClasses["flux.FloatX"] = function() { }
flux.FloatX.__name__ = ["flux","FloatX"];
flux.FloatX.round = function(v) {
	return Math.round(v);
}
flux.FloatX.ceil = function(v) {
	return Math.ceil(v);
}
flux.FloatX.floor = function(v) {
	return Math.floor(v);
}
flux.FloatX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
}
flux.FloatX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
}
flux.FloatX.toInt = function(v) {
	return v | 0;
}
flux.FloatX.compare = function(v1,v2) {
	return v1 < v2?-1:v1 > v2?1:0;
}
flux.FloatX.equals = function(v1,v2) {
	return v1 == v2;
}
flux.FloatX.toString = function(v) {
	return "" + v;
}
flux.FloatX.hashCode = function(v) {
	return v * 98317 | 0;
}
flux.StringX = $hxClasses["flux.StringX"] = function() { }
flux.StringX.__name__ = ["flux","StringX"];
flux.StringX.toBool = function(v,d) {
	if(v == null) return d;
	var vLower = v.toLowerCase();
	return flux.OptionX.getOrElseC(vLower == "false" || v == "0"?flux.Option.Some(false):vLower == "true" || v == "1"?flux.Option.Some(true):flux.Option.None,d);
}
flux.StringX.toInt = function(v,d) {
	if(v == null) return d;
	return flux.OptionX.getOrElseC(flux.OptionX.filter(flux.Core.toOption(Std.parseInt(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
}
flux.StringX.toFloat = function(v,d) {
	if(v == null) return d;
	return flux.OptionX.getOrElseC(flux.OptionX.filter(flux.Core.toOption(Std.parseFloat(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
}
flux.StringX.startsWith = function(v,frag) {
	return v.length >= frag.length && frag == HxOverrides.substr(v,0,frag.length)?true:false;
}
flux.StringX.endsWith = function(v,frag) {
	return v.length >= frag.length && frag == HxOverrides.substr(v,v.length - frag.length,null)?true:false;
}
flux.StringX.urlEncode = function(v) {
	return StringTools.urlEncode(v);
}
flux.StringX.urlDecode = function(v) {
	return StringTools.urlDecode(v);
}
flux.StringX.htmlEscape = function(v) {
	return StringTools.htmlEscape(v);
}
flux.StringX.htmlUnescape = function(v) {
	return StringTools.htmlUnescape(v);
}
flux.StringX.trim = function(v) {
	return StringTools.trim(v);
}
flux.StringX.contains = function(v,s) {
	return v.indexOf(s) != -1;
}
flux.StringX.replace = function(s,sub,by) {
	return StringTools.replace(s,sub,by);
}
flux.StringX.compare = function(v1,v2) {
	return v1 == v2?0:v1 > v2?1:-1;
}
flux.StringX.equals = function(v1,v2) {
	return v1 == v2;
}
flux.StringX.toString = function(v) {
	return v;
}
flux.StringX.parse = function(str) {
	return JSON.parse(str);
}
flux.StringX.clone = function(o) {
	return JSON.parse(JSON.stringify(o));
}
flux.StringX.info = function(msg,inf) {
	flux.core.LogImpl.info(msg,null,inf);
}
flux.StringX.warn = function(msg,inf) {
	flux.core.LogImpl.warn(msg,null,inf);
}
flux.StringX.error = function(msg,inf) {
	flux.core.LogImpl.error(msg,null,inf);
}
flux.DateX = $hxClasses["flux.DateX"] = function() { }
flux.DateX.__name__ = ["flux","DateX"];
flux.DateX.compare = function(v1,v2) {
	var diff = v1.getTime() - v2.getTime();
	return diff < 0?-1:diff > 0?1:0;
}
flux.DateX.equals = function(v1,v2) {
	return v1.getTime() == v2.getTime();
}
flux.DateX.toString = function(v) {
	return HxOverrides.dateStr(v);
}
flux.DateX.UTCString = function(d) {
	return d.toUTCString();
}
flux.ArrayX = $hxClasses["flux.ArrayX"] = function() { }
flux.ArrayX.__name__ = ["flux","ArrayX"];
flux.ArrayX.stringify = function(a) {
	return JSON.stringify(o);
}
flux.ArrayX.filter = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(f(e)) n.push(e);
	}
	return n;
}
flux.ArrayX.size = function(a) {
	return a.length;
}
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
}
flux.ArrayX.map = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		n.push(f(e));
	}
	return n;
}
flux.ArrayX.mapi = function(a,f) {
	var n = [];
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		n.push(f(a[i],i));
	}
	return n;
}
flux.ArrayX.next = function(a1,a2) {
	return a2;
}
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
}
flux.ArrayX.foldl = function(a,z,f) {
	var r = z;
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		r = f(r,e);
	}
	return r;
}
flux.ArrayX.foldr = function(a,z,f) {
	var r = z;
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		var e = a[a.length - 1 - i];
		r = f(e,r);
	}
	return r;
}
flux.ArrayX.append = function(a,t) {
	var copy = flux.ArrayX.snapshot(a);
	copy.push(t);
	return copy;
}
flux.ArrayX.snapshot = function(a) {
	return [].concat(a);
}
flux.ArrayX.first = function(a) {
	return a[0];
}
flux.ArrayX.firstOption = function(a) {
	return a.length == 0?flux.Option.None:flux.Option.Some(a[0]);
}
flux.ArrayX.last = function(a) {
	return a[a.length - 1];
}
flux.ArrayX.lastOption = function(a) {
	return a.length == 0?flux.Option.None:flux.Option.Some(a[a.length - 1]);
}
flux.ArrayX.contains = function(a,t) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(t == e) return true;
	}
	return false;
}
flux.ArrayX.foreach = function(a,f) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		f(e);
	}
	return a;
}
flux.ArrayX.take = function(a,n) {
	return a.slice(0,flux.IntX.min(n,a.length));
}
flux.ArrayX.takeWhile = function(a,p) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.push(e); else break;
	}
	return r;
}
flux.ArrayX.drop = function(a,n) {
	return n >= a.length?[]:a.slice(n);
}
flux.ArrayX.dropWhile = function(a,p) {
	var r = [].concat(a);
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.shift(); else break;
	}
	return r;
}
flux.HashX = $hxClasses["flux.HashX"] = function() { }
flux.HashX.__name__ = ["flux","HashX"];
flux.HashX.getOption = function(h,key) {
	var v = h.get(key);
	return v == null?flux.Option.None:flux.Option.Some(v);
}
flux.HashX.values = function(h) {
	var a = [];
	var $it0 = h.iterator();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
}
flux.HashX.keyArray = function(h) {
	var a = [];
	var $it0 = h.keys();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
}
flux.OptionX = $hxClasses["flux.OptionX"] = function() { }
flux.OptionX.__name__ = ["flux","OptionX"];
flux.OptionX.toOption = function(t) {
	return t == null?flux.Option.None:flux.Option.Some(t);
}
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
}
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
}
flux.OptionX.next = function(o1,o2) {
	return o2;
}
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
}
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
}
flux.OptionX.flatMap = function(o,f) {
	return flux.OptionX.flatten(flux.OptionX.map(o,f));
}
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
}
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
}
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
}
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
}
flux.OptionX.orElseC = function(o1,o2) {
	return flux.OptionX.orElse(o1,flux.DynamicX.toThunk(o2));
}
flux.OptionX.getOrElseC = function(o,c) {
	return flux.OptionX.getOrElse(o,flux.DynamicX.toThunk(c));
}
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
}
flux.OptionX.orEitherC = function(o1,c) {
	return flux.OptionX.orEither(o1,flux.DynamicX.toThunk(c));
}
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
}
flux.EitherX = $hxClasses["flux.EitherX"] = function() { }
flux.EitherX.__name__ = ["flux","EitherX"];
flux.EitherX.toLeft = function(v) {
	return flux.Either.Left(v);
}
flux.EitherX.toRight = function(v) {
	return flux.Either.Right(v);
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
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
}
flux.OutcomeX = $hxClasses["flux.OutcomeX"] = function() { }
flux.OutcomeX.__name__ = ["flux","OutcomeX"];
flux.OutcomeX.outcome = function(oc,cb,err) {
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) cb(flux.OptionX.get(flux.EitherX.right(either))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 885, className : "flux.OutcomeX", methodName : "outcome"});
	});
}
flux.OutcomeX.oflatMap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) flux.OutcomeX.outcome(cb(flux.OptionX.get(flux.EitherX.right(either))),function(val) {
			roc.resolve(flux.Either.Right(val));
		},err); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 904, className : "flux.OutcomeX", methodName : "oflatMap"});
	});
	return roc;
}
flux.OutcomeX.omap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) roc.resolve(flux.Either.Right(cb(flux.OptionX.get(flux.EitherX.right(either))))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 923, className : "flux.OutcomeX", methodName : "omap"});
	});
	return roc;
}
if(!flux.core) flux.core = {}
flux.core.FutureImpl = $hxClasses["flux.core.FutureImpl"] = function() {
	this._listeners = [];
	this._result = null;
	this._isSet = false;
	this._isCanceled = false;
	this._cancelers = [];
	this._canceled = [];
	this._combined = 0;
};
flux.core.FutureImpl.__name__ = ["flux","core","FutureImpl"];
flux.core.FutureImpl.__interfaces__ = [flux.Future];
flux.core.FutureImpl.dead = function() {
	var prm = new flux.core.FutureImpl();
	prm.cancel();
	return prm;
}
flux.core.FutureImpl.create = function() {
	return new flux.core.FutureImpl();
}
flux.core.FutureImpl.prototype = {
	forceCancel: function() {
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
	}
	,toArray: function() {
		return flux.OptionX.toArray(this.value());
	}
	,toOption: function() {
		return this.value();
	}
	,value: function() {
		return this._isSet?flux.Option.Some(this._result):flux.Option.None;
	}
	,filter: function(f) {
		var fut = new flux.core.FutureImpl();
		this.deliver(function(t) {
			if(f(t)) fut.resolve(t); else fut.forceCancel();
		});
		this.ifCanceled(function() {
			fut.forceCancel();
		});
		return fut;
	}
	,flatMap: function(f) {
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
	}
	,then: function(f) {
		return f;
	}
	,map: function(f) {
		var fut = new flux.core.FutureImpl();
		this.deliver(function(t) {
			fut.resolve(f(t));
		});
		this.ifCanceled(function() {
			fut.forceCancel();
		});
		return fut;
	}
	,deliver: function(f) {
		if(this.isCanceled()) return this; else if(this.isDelivered()) f(this._result); else this._listeners.push(f);
		return this;
	}
	,isCanceled: function() {
		return this._isCanceled;
	}
	,isDelivered: function() {
		return this._isSet;
	}
	,isDone: function() {
		return this.isDelivered() || this.isCanceled();
	}
	,cancel: function() {
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
	}
	,ifCanceled: function(f) {
		if(this.isCanceled()) f(); else if(!this.isDone()) this._canceled.push(f);
		return this;
	}
	,allowCancelOnlyIf: function(f) {
		if(!this.isDone()) this._cancelers.push(f);
		return this;
	}
	,resolve: function(t) {
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
	}
	,_combined: null
	,_canceled: null
	,_cancelers: null
	,_isCanceled: null
	,_isSet: null
	,_result: null
	,_listeners: null
	,__class__: flux.core.FutureImpl
}
flux.core.LogImpl = $hxClasses["flux.core.LogImpl"] = function() { }
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
}
flux.core.LogImpl.myTrace = function(v,inf) {
	flux.core.LogImpl.debug(v,"",inf);
}
flux.core.LogImpl.init = function(fileName) {
}
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
}
flux.core.LogImpl.doTrace = function(type,category,msg,inf) {
	if(type == "error") {
		var stack = haxe.Stack.toString(haxe.Stack.exceptionStack());
		if(stack.length == 0) stack = "No haXe stack trace available";
		msg = Std.string(msg) + "\n" + stack;
	}
	flux.core.LogImpl.write(flux.core.LogImpl.format(type,msg,category,inf),type);
}
flux.core.LogImpl.info = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("info",category,msg,inf);
}
flux.core.LogImpl.warn = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("warn",category,msg,inf);
}
flux.core.LogImpl.error = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("error",category,msg,inf);
}
flux.core.LogImpl.debug = function(msg,category,inf) {
	if(category == null) category = "";
	flux.core.LogImpl.doTrace("debug",category,msg,inf);
}
flux.core.ObservableImpl = $hxClasses["flux.core.ObservableImpl"] = function() {
	this._observers = [];
	this._unsubscribes = 0;
};
flux.core.ObservableImpl.__name__ = ["flux","core","ObservableImpl"];
flux.core.ObservableImpl.__interfaces__ = [flux.Observable];
flux.core.ObservableImpl.prototype = {
	removePeers: function() {
		flux.ArrayX.foreach(this._observers,function(s) {
			s.handler = null;
			s.info = null;
		});
		this._observers = [];
	}
	,peek: function(cb) {
		if(this._event == null) this._event = new flux.core.ObservableImpl();
		this._event.observe(cb);
	}
	,peers: function() {
		return flux.ArrayX.map(flux.ArrayX.filter(this._observers,function(el) {
			return el.handler != null;
		}),function(el) {
			return el.info;
		});
	}
	,cleanup: function() {
		console.log("cleaning up");
		this._unsubscribes = 0;
		this._observers = flux.ArrayX.filter(this._observers,function(s) {
			if(s.handler == null) console.log("filtering " + Std.string(s.info));
			return s.handler != null;
		});
	}
	,observe: function(cb,info) {
		var _g = this;
		var h = { handler : cb, info : flux.Core.toOption(info)};
		this._observers.push(h);
		if(this._event != null) this._event.notify(flux.EOperation.Add(info));
		return function() {
			if(h.handler != null) {
				h.handler = null;
				_g._unsubscribes++;
				if(_g._unsubscribes >= flux.core.ObservableImpl.CLEANUP) _g.cleanup();
				if(_g._event != null) _g._event.notify(flux.EOperation.Del(info));
			}
		};
	}
	,notify: function(v) {
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
	}
	,_event: null
	,_observers: null
	,_unsubscribes: null
	,preNotify: null
	,__class__: flux.core.ObservableImpl
}
var haxe = haxe || {}
haxe.Http = $hxClasses["haxe.Http"] = function(url) {
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
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
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
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Json = $hxClasses["haxe.Json"] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
}
haxe.Json.prototype = {
	parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += String.fromCharCode(13);
					break;
				case 110:
					buf.b += String.fromCharCode(10);
					break;
				case 116:
					buf.b += String.fromCharCode(9);
					break;
				case 98:
					buf.b += String.fromCharCode(8);
					break;
				case 102:
					buf.b += String.fromCharCode(12);
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.b += HxOverrides.substr(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
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
	}
	,nextChar: function() {
		return this.str.charCodeAt(this.pos++);
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += Std.string("\"");
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += Std.string("\\\"");
				break;
			case 92:
				this.buf.b += Std.string("\\\\");
				break;
			case 10:
				this.buf.b += Std.string("\\n");
				break;
			case 13:
				this.buf.b += Std.string("\\r");
				break;
			case 9:
				this.buf.b += Std.string("\\t");
				break;
			case 8:
				this.buf.b += Std.string("\\b");
				break;
			case 12:
				this.buf.b += Std.string("\\f");
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += Std.string("\"");
	}
	,toStringRec: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 8:
			this.buf.b += Std.string("\"???\"");
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
		case 2:
			this.buf.b += Std.string(v);
			break;
		case 5:
			this.buf.b += Std.string("\"<fun>\"");
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += Std.string("[");
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += Std.string(",");
						this.toStringRec(v1[i++]);
					}
				}
				this.buf.b += Std.string("]");
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
			this.buf.b += Std.string(v[1]);
			break;
		case 3:
			this.buf.b += Std.string(v?"true":"false");
			break;
		case 0:
			this.buf.b += Std.string("null");
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += Std.string("{");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += Std.string(",");
			this.quote(f);
			this.buf.b += Std.string(":");
			this.toStringRec(value);
		}
		this.buf.b += Std.string("}");
	}
	,toString: function(v) {
		this.buf = new StringBuf();
		this.toStringRec(v);
		return this.buf.b;
	}
	,reg_float: null
	,pos: null
	,str: null
	,buf: null
	,__class__: haxe.Json
}
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
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
}
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
}
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
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
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
if(typeof(JSON) != "undefined") haxe.Json = JSON;
var q = window.jQuery;
js.JQuery = q;
q.fn.iterator = function() {
	return { pos : 0, j : this, hasNext : function() {
		return this.pos < this.j.length;
	}, next : function() {
		return $(this.j[this.pos++]);
	}};
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
flux.Core.CSROOT = "/__cs/";
flux.core.ObservableImpl.CLEANUP = 1;
Client.main();
