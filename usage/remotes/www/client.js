var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); };
Async_Server =  $hxClasses['Async_Server'] = function(c) {
	this.__cnx = c;
};
Async_Server.__name__ = ["Async_Server"];
Async_Server.prototype.__cnx = null;
Async_Server.prototype.echo = function(s,cb) {
	this.__cnx.resolve("echo").call([s],cb);
};
Async_Server.prototype.__class__ = Async_Server;
ClientProxy =  $hxClasses['ClientProxy'] = function(c) {
	Async_Server.call(this,c);
};
ClientProxy.__name__ = ["ClientProxy"];
ClientProxy.__super__ = Async_Server;
for(var k in Async_Server.prototype ) ClientProxy.prototype[k] = Async_Server.prototype[k];
ClientProxy.prototype.__class__ = ClientProxy;
Client =  $hxClasses['Client'] = function() {
	var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("http://localhost:8082/remotes");
	cnx.setErrorHandler(function(err) {
		haxe.Log.trace("Error : " + Std.string(err),{ fileName : "Client.hx", lineNumber : 19, className : "Client", methodName : "new"});
	});
	var p = new ClientProxy(cnx.resolve("Test"));
	p.echo("woot",function(s) {
		haxe.Log.trace("client return:" + s,{ fileName : "Client.hx", lineNumber : 23, className : "Client", methodName : "new"});
	});
};
Client.__name__ = ["Client"];
Client.main = function() {
	new Client();
};
Client.prototype.__class__ = Client;
EReg =  $hxClasses['EReg'] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype.r = null;
EReg.prototype.match = function(s) {
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
Hash =  $hxClasses['Hash'] = function() {
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
	return a.iterator();
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
IntHash =  $hxClasses['IntHash'] = function() {
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
	return a.iterator();
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
IntIter =  $hxClasses['IntIter'] = function(min,max) {
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
List =  $hxClasses['List'] = function() {
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
Reflect =  $hxClasses['Reflect'] = function() { };
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
	return typeof(f) == "function" && f.__name__ == null;
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
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && v.__name__ != null;
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
Std =  $hxClasses['Std'] = function() { };
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
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
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
StringBuf =  $hxClasses['StringBuf'] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.add = function(x) {
	this.b[this.b.length] = x == null?"null":x;
};
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b[this.b.length] = s.substr(pos,len);
};
StringBuf.prototype.addChar = function(c) {
	this.b[this.b.length] = String.fromCharCode(c);
};
StringBuf.prototype.toString = function() {
	return this.b.join("");
};
StringBuf.prototype.b = null;
StringBuf.prototype.__class__ = StringBuf;
StringTools =  $hxClasses['StringTools'] = function() { };
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
	return s.length >= start.length && s.substr(0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && s.substr(slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = s.charCodeAt(pos);
	return c >= 9 && c <= 13 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return s.substr(r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return s.substr(0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += c.substr(0,l - sl);
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
		ns += c.substr(0,l - sl);
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
	return s.cca(index);
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
Type =  $hxClasses['Type'] = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	if(o.__enum__ != null) return null;
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
	if(cl == null || cl.__name__ == null) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || e.__ename__ == null) return null;
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
	a.remove("__class__");
	a.remove("__properties__");
	return a;
};
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	a.remove("__name__");
	a.remove("__interfaces__");
	a.remove("__properties__");
	a.remove("__super__");
	a.remove("prototype");
	return a;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.copy();
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
		if(v.__name__ != null) return ValueType.TObject;
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
if(typeof cloudshift=='undefined') cloudshift = {};
cloudshift.Option = $hxClasses['cloudshift.Option'] = { __ename__ : ["cloudshift","Option"], __constructs__ : ["None","Some"] };
cloudshift.Option.None = ["None",0];
cloudshift.Option.None.toString = $estr;
cloudshift.Option.None.__enum__ = cloudshift.Option;
cloudshift.Option.Some = function(v) { var $x = ["Some",1,v]; $x.__enum__ = cloudshift.Option; $x.toString = $estr; return $x; };
cloudshift.Either = $hxClasses['cloudshift.Either'] = { __ename__ : ["cloudshift","Either"], __constructs__ : ["Left","Right"] };
cloudshift.Either.Left = function(v) { var $x = ["Left",0,v]; $x.__enum__ = cloudshift.Either; $x.toString = $estr; return $x; };
cloudshift.Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = cloudshift.Either; $x.toString = $estr; return $x; };
cloudshift.ELogLevel = $hxClasses['cloudshift.ELogLevel'] = { __ename__ : ["cloudshift","ELogLevel"], __constructs__ : ["I","W","E"] };
cloudshift.ELogLevel.I = function(s) { var $x = ["I",0,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.ELogLevel.E = function(s) { var $x = ["E",2,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.ELogLevel.W = function(s) { var $x = ["W",1,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.EOperation = $hxClasses['cloudshift.EOperation'] = { __ename__ : ["cloudshift","EOperation"], __constructs__ : ["Add","Del"] };
cloudshift.EOperation.Add = function(info) { var $x = ["Add",0,info]; $x.__enum__ = cloudshift.EOperation; $x.toString = $estr; return $x; };
cloudshift.EOperation.Del = function(info) { var $x = ["Del",1,info]; $x.__enum__ = cloudshift.EOperation; $x.toString = $estr; return $x; };
cloudshift.Observable =  $hxClasses['cloudshift.Observable'] = function() { };
cloudshift.Observable.__name__ = ["cloudshift","Observable"];
cloudshift.Observable.prototype.preNotify = null;
cloudshift.Observable.prototype.notify = null;
cloudshift.Observable.prototype.observe = null;
cloudshift.Observable.prototype.peers = null;
cloudshift.Observable.prototype.removePeers = null;
cloudshift.Observable.prototype.peek = null;
cloudshift.Observable.prototype.__class__ = cloudshift.Observable;
cloudshift.Future =  $hxClasses['cloudshift.Future'] = function() { };
cloudshift.Future.__name__ = ["cloudshift","Future"];
cloudshift.Future.prototype.resolve = null;
cloudshift.Future.prototype.deliver = null;
cloudshift.Future.prototype.isCanceled = null;
cloudshift.Future.prototype.ifCanceled = null;
cloudshift.Future.prototype.allowCancelOnlyIf = null;
cloudshift.Future.prototype.cancel = null;
cloudshift.Future.prototype.isDone = null;
cloudshift.Future.prototype.isDelivered = null;
cloudshift.Future.prototype.map = null;
cloudshift.Future.prototype.flatMap = null;
cloudshift.Future.prototype.filter = null;
cloudshift.Future.prototype.value = null;
cloudshift.Future.prototype.toOption = null;
cloudshift.Future.prototype.toArray = null;
cloudshift.Future.prototype.__class__ = cloudshift.Future;
cloudshift.EPartState = $hxClasses['cloudshift.EPartState'] = { __ename__ : ["cloudshift","EPartState"], __constructs__ : ["Started","Stopped","Event","Error","Except"] };
cloudshift.EPartState.Except = function(e) { var $x = ["Except",4,e]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Event = function(event) { var $x = ["Event",2,event]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Started = ["Started",0];
cloudshift.EPartState.Started.toString = $estr;
cloudshift.EPartState.Started.__enum__ = cloudshift.EPartState;
cloudshift.EPartState.Error = function(msg) { var $x = ["Error",3,msg]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Stopped = ["Stopped",1];
cloudshift.EPartState.Stopped.toString = $estr;
cloudshift.EPartState.Stopped.__enum__ = cloudshift.EPartState;
cloudshift.Part_ =  $hxClasses['cloudshift.Part_'] = function() { };
cloudshift.Part_.__name__ = ["cloudshift","Part_"];
cloudshift.Part_.prototype._events = null;
cloudshift.Part_.prototype.partID = null;
cloudshift.Part_.prototype.state = null;
cloudshift.Part_.prototype._info = null;
cloudshift.Part_.prototype.sstopper = null;
cloudshift.Part_.prototype.start = null;
cloudshift.Part_.prototype.stop = null;
cloudshift.Part_.prototype.observe = null;
cloudshift.Part_.prototype.notify = null;
cloudshift.Part_.prototype.observeState = null;
cloudshift.Part_.prototype.notifyState = null;
cloudshift.Part_.prototype.peer = null;
cloudshift.Part_.prototype.setStop = null;
cloudshift.Part_.prototype.__class__ = cloudshift.Part_;
cloudshift.Part =  $hxClasses['cloudshift.Part'] = function() { };
cloudshift.Part.__name__ = ["cloudshift","Part"];
cloudshift.Part.prototype.part_ = null;
cloudshift.Part.prototype.start_ = null;
cloudshift.Part.prototype.__class__ = cloudshift.Part;
cloudshift.Core =  $hxClasses['cloudshift.Core'] = function() { };
cloudshift.Core.__name__ = ["cloudshift","Core"];
cloudshift.Core.init = function() {
	cloudshift.core.LogImpl.init(null);
};
cloudshift.Core.future = function() {
	return new cloudshift.core.FutureImpl();
};
cloudshift.Core.outcome = function(cancel) {
	return new cloudshift.core.FutureImpl();
};
cloudshift.Core.part = function(parent,info) {
	return new cloudshift.core.PartBaseImpl(parent,info);
};
cloudshift.Core.cancelledFuture = function() {
	return cloudshift.core.FutureImpl.dead();
};
cloudshift.Core.event = function() {
	return new cloudshift.core.ObservableImpl();
};
cloudshift.Core.toOption = function(t) {
	return t == null?cloudshift.Option.None:cloudshift.Option.Some(t);
};
cloudshift.Core.logInit = function(fileName) {
	cloudshift.core.LogImpl.init(fileName);
};
cloudshift.Core.log = function(l,category,inf) {
	if(category == null) category = "";
	var $e = (l);
	switch( $e[1] ) {
	case 0:
		var m = $e[2];
		cloudshift.core.LogImpl.info(m,category,inf);
		break;
	case 1:
		var m = $e[2];
		cloudshift.core.LogImpl.warn(m,category,inf);
		break;
	case 2:
		var m = $e[2];
		cloudshift.core.LogImpl.error(m,category,inf);
		break;
	}
};
cloudshift.Core.info = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.info(msg,category,inf);
};
cloudshift.Core.warn = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.warn(msg,category,inf);
};
cloudshift.Core.error = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.error(msg,category,inf);
};
cloudshift.Core.debug = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.debug(msg,category,inf);
};
cloudshift.Core.parse = function(str) {
	return haxe.Json.parse(str);
};
cloudshift.Core.stringify = function(obj) {
	return haxe.Json.stringify(obj);
};
cloudshift.Core.waitOut = function(toJoin) {
	var count = toJoin.length, oc = new cloudshift.core.FutureImpl();
	cloudshift.ArrayX.foreach(toJoin,function(xprm) {
		xprm.deliver(function(r) {
			count--;
			if(count == 0) oc.resolve(cloudshift.Either.Right(cloudshift.ArrayX.map(toJoin,function(el) {
				var z = el._result;
				return z;
			})));
		});
	});
	return oc;
};
cloudshift.Core.waitFut = function(toJoin) {
	var count = toJoin.length, fut = new cloudshift.core.FutureImpl();
	cloudshift.ArrayX.foreach(toJoin,function(xprm) {
		if(!Std["is"](xprm,cloudshift.Future)) throw "not a future:" + xprm;
		xprm.deliver(function(r) {
			count--;
			if(count == 0) fut.resolve(cloudshift.ArrayX.map(toJoin,function(el) {
				return cloudshift.OptionX.get(el.value());
			}));
		});
	});
	return fut;
};
cloudshift.Core.listParts = function() {
	cloudshift.ArrayX.foreach(cloudshift.core.PartBaseImpl.runningParts,function(p) {
		if(cloudshift.PartX.info(p) != null) haxe.Log.trace(cloudshift.PartX.info(p),{ fileName : "Core.hx", lineNumber : 241, className : "cloudshift.Core", methodName : "listParts"});
	});
};
cloudshift.Core.assert = function(cond,pos) {
	if(!cond) cloudshift.core.LogImpl.error("Assert failed in " + pos.className + "::" + pos.methodName,"",pos);
};
cloudshift.Core.prototype.__class__ = cloudshift.Core;
cloudshift.Mixin =  $hxClasses['cloudshift.Mixin'] = function() { };
cloudshift.Mixin.__name__ = ["cloudshift","Mixin"];
cloudshift.Mixin.error = function(msg) {
	throw msg;
	return null;
};
cloudshift.Mixin.prototype.__class__ = cloudshift.Mixin;
cloudshift.DynamicX =  $hxClasses['cloudshift.DynamicX'] = function() { };
cloudshift.DynamicX.__name__ = ["cloudshift","DynamicX"];
cloudshift.DynamicX.into = function(a,f) {
	return f(a);
};
cloudshift.DynamicX.isInstanceOf = function(o,c) {
	return Std["is"](o,c);
};
cloudshift.DynamicX.toThunk = function(t) {
	return function() {
		return t;
	};
};
cloudshift.DynamicX.stringify = function(o) {
	return JSON.stringify(o);
};
cloudshift.DynamicX.prototype.__class__ = cloudshift.DynamicX;
cloudshift.BoolX =  $hxClasses['cloudshift.BoolX'] = function() { };
cloudshift.BoolX.__name__ = ["cloudshift","BoolX"];
cloudshift.BoolX.toInt = function(v) {
	return v?1:0;
};
cloudshift.BoolX.ifTrue = function(v,f) {
	return v?cloudshift.Option.Some(f()):cloudshift.Option.None;
};
cloudshift.BoolX.ifFalse = function(v,f) {
	return !v?cloudshift.Option.Some(f()):cloudshift.Option.None;
};
cloudshift.BoolX.ifElse = function(v,f1,f2) {
	return v?f1():f2();
};
cloudshift.BoolX.compare = function(v1,v2) {
	return !v1 && v2?-1:v1 && !v2?1:0;
};
cloudshift.BoolX.equals = function(v1,v2) {
	return v1 == v2;
};
cloudshift.BoolX.hashCode = function(v) {
	return v?786433:393241;
};
cloudshift.BoolX.toString = function(v) {
	return v?"true":"false";
};
cloudshift.BoolX.prototype.__class__ = cloudshift.BoolX;
cloudshift.IntX =  $hxClasses['cloudshift.IntX'] = function() { };
cloudshift.IntX.__name__ = ["cloudshift","IntX"];
cloudshift.IntX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
};
cloudshift.IntX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
};
cloudshift.IntX.toBool = function(v) {
	return v == 0?false:true;
};
cloudshift.IntX.toFloat = function(v) {
	return v;
};
cloudshift.IntX.to = function(start,end) {
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
cloudshift.IntX.until = function(start,end) {
	return cloudshift.IntX.to(start,end - 1);
};
cloudshift.IntX.compare = function(v1,v2) {
	return v1 - v2;
};
cloudshift.IntX.equals = function(v1,v2) {
	return v1 == v2;
};
cloudshift.IntX.toString = function(v) {
	return "" + v;
};
cloudshift.IntX.hashCode = function(v) {
	return v * 196613;
};
cloudshift.IntX.prototype.__class__ = cloudshift.IntX;
cloudshift.FloatX =  $hxClasses['cloudshift.FloatX'] = function() { };
cloudshift.FloatX.__name__ = ["cloudshift","FloatX"];
cloudshift.FloatX.round = function(v) {
	return Math.round(v);
};
cloudshift.FloatX.ceil = function(v) {
	return Math.ceil(v);
};
cloudshift.FloatX.floor = function(v) {
	return Math.floor(v);
};
cloudshift.FloatX.max = function(v1,v2) {
	return v2 > v1?v2:v1;
};
cloudshift.FloatX.min = function(v1,v2) {
	return v2 < v1?v2:v1;
};
cloudshift.FloatX.toInt = function(v) {
	return v | 0;
};
cloudshift.FloatX.compare = function(v1,v2) {
	return v1 < v2?-1:v1 > v2?1:0;
};
cloudshift.FloatX.equals = function(v1,v2) {
	return v1 == v2;
};
cloudshift.FloatX.toString = function(v) {
	return "" + v;
};
cloudshift.FloatX.hashCode = function(v) {
	return v * 98317 | 0;
};
cloudshift.FloatX.prototype.__class__ = cloudshift.FloatX;
cloudshift.StringX =  $hxClasses['cloudshift.StringX'] = function() { };
cloudshift.StringX.__name__ = ["cloudshift","StringX"];
cloudshift.StringX.toBool = function(v,d) {
	if(v == null) return d;
	var vLower = v.toLowerCase();
	return cloudshift.OptionX.getOrElseC(vLower == "false" || v == "0"?cloudshift.Option.Some(false):vLower == "true" || v == "1"?cloudshift.Option.Some(true):cloudshift.Option.None,d);
};
cloudshift.StringX.toInt = function(v,d) {
	if(v == null) return d;
	return cloudshift.OptionX.getOrElseC(cloudshift.OptionX.filter(cloudshift.OptionX.toOption(Std.parseInt(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
};
cloudshift.StringX.toFloat = function(v,d) {
	if(v == null) return d;
	return cloudshift.OptionX.getOrElseC(cloudshift.OptionX.filter(cloudshift.OptionX.toOption(Std.parseFloat(v)),function(i) {
		return !Math.isNaN(i);
	}),d);
};
cloudshift.StringX.startsWith = function(v,frag) {
	return v.length >= frag.length && frag == v.substr(0,frag.length)?true:false;
};
cloudshift.StringX.endsWith = function(v,frag) {
	return v.length >= frag.length && frag == v.substr(v.length - frag.length)?true:false;
};
cloudshift.StringX.urlEncode = function(v) {
	return StringTools.urlEncode(v);
};
cloudshift.StringX.urlDecode = function(v) {
	return StringTools.urlDecode(v);
};
cloudshift.StringX.htmlEscape = function(v) {
	return StringTools.htmlEscape(v);
};
cloudshift.StringX.htmlUnescape = function(v) {
	return StringTools.htmlUnescape(v);
};
cloudshift.StringX.trim = function(v) {
	return StringTools.trim(v);
};
cloudshift.StringX.contains = function(v,s) {
	return v.indexOf(s) != -1;
};
cloudshift.StringX.replace = function(s,sub,by) {
	return StringTools.replace(s,sub,by);
};
cloudshift.StringX.compare = function(v1,v2) {
	return v1 == v2?0:v1 > v2?1:-1;
};
cloudshift.StringX.equals = function(v1,v2) {
	return v1 == v2;
};
cloudshift.StringX.toString = function(v) {
	return v;
};
cloudshift.StringX.parse = function(str) {
	return JSON.parse(str);
};
cloudshift.StringX.clone = function(o) {
	return JSON.parse(JSON.stringify(o));
};
cloudshift.StringX.info = function(msg,inf) {
	cloudshift.core.LogImpl.info(msg,null,inf);
};
cloudshift.StringX.warn = function(msg,inf) {
	cloudshift.core.LogImpl.warn(msg,null,inf);
};
cloudshift.StringX.error = function(msg,inf) {
	cloudshift.core.LogImpl.error(msg,null,inf);
};
cloudshift.StringX.prototype.__class__ = cloudshift.StringX;
cloudshift.DateX =  $hxClasses['cloudshift.DateX'] = function() { };
cloudshift.DateX.__name__ = ["cloudshift","DateX"];
cloudshift.DateX.compare = function(v1,v2) {
	var diff = v1.getTime() - v2.getTime();
	return diff < 0?-1:diff > 0?1:0;
};
cloudshift.DateX.equals = function(v1,v2) {
	return v1.getTime() == v2.getTime();
};
cloudshift.DateX.toString = function(v) {
	return v.toString();
};
cloudshift.DateX.UTCString = function(d) {
	return d.toUTCString();
};
cloudshift.DateX.prototype.__class__ = cloudshift.DateX;
cloudshift.ArrayX =  $hxClasses['cloudshift.ArrayX'] = function() { };
cloudshift.ArrayX.__name__ = ["cloudshift","ArrayX"];
cloudshift.ArrayX.stringify = function(a) {
	return JSON.stringify(o);
};
cloudshift.ArrayX.filter = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(f(e)) n.push(e);
	}
	return n;
};
cloudshift.ArrayX.size = function(a) {
	return a.length;
};
cloudshift.ArrayX.indexOf = function(a,t) {
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
cloudshift.ArrayX.map = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		n.push(f(e));
	}
	return n;
};
cloudshift.ArrayX.mapi = function(a,f) {
	var n = [];
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		n.push(f(a[i],i));
	}
	return n;
};
cloudshift.ArrayX.next = function(a1,a2) {
	return a2;
};
cloudshift.ArrayX.flatMap = function(a,f) {
	var n = [];
	var _g = 0;
	while(_g < a.length) {
		var e1 = a[_g];
		++_g;
		var $it0 = f(e1).iterator();
		while( $it0.hasNext() ) {
			var e2 = $it0.next();
			n.push(e2);
		}
	}
	return n;
};
cloudshift.ArrayX.foldl = function(a,z,f) {
	var r = z;
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		r = f(r,e);
	}
	return r;
};
cloudshift.ArrayX.foldr = function(a,z,f) {
	var r = z;
	var _g1 = 0, _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		var e = a[a.length - 1 - i];
		r = f(e,r);
	}
	return r;
};
cloudshift.ArrayX.append = function(a,t) {
	var copy = cloudshift.ArrayX.snapshot(a);
	copy.push(t);
	return copy;
};
cloudshift.ArrayX.snapshot = function(a) {
	return [].concat(a);
};
cloudshift.ArrayX.first = function(a) {
	return a[0];
};
cloudshift.ArrayX.firstOption = function(a) {
	return a.length == 0?cloudshift.Option.None:cloudshift.Option.Some(a[0]);
};
cloudshift.ArrayX.last = function(a) {
	return a[a.length - 1];
};
cloudshift.ArrayX.lastOption = function(a) {
	return a.length == 0?cloudshift.Option.None:cloudshift.Option.Some(a[a.length - 1]);
};
cloudshift.ArrayX.contains = function(a,t) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(t == e) return true;
	}
	return false;
};
cloudshift.ArrayX.foreach = function(a,f) {
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		f(e);
	}
	return a;
};
cloudshift.ArrayX.take = function(a,n) {
	return a.slice(0,cloudshift.IntX.min(n,a.length));
};
cloudshift.ArrayX.takeWhile = function(a,p) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.push(e); else break;
	}
	return r;
};
cloudshift.ArrayX.drop = function(a,n) {
	return n >= a.length?[]:a.slice(n);
};
cloudshift.ArrayX.dropWhile = function(a,p) {
	var r = [].concat(a);
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		if(p(e)) r.shift(); else break;
	}
	return r;
};
cloudshift.ArrayX.prototype.__class__ = cloudshift.ArrayX;
cloudshift.HashX =  $hxClasses['cloudshift.HashX'] = function() { };
cloudshift.HashX.__name__ = ["cloudshift","HashX"];
cloudshift.HashX.getOption = function(h,key) {
	var v = h.get(key);
	return v == null?cloudshift.Option.None:cloudshift.Option.Some(v);
};
cloudshift.HashX.values = function(h) {
	var a = [];
	var $it0 = h.iterator();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
};
cloudshift.HashX.keyArray = function(h) {
	var a = [];
	var $it0 = h.keys();
	while( $it0.hasNext() ) {
		var v = $it0.next();
		a.push(v);
	}
	return a;
};
cloudshift.HashX.prototype.__class__ = cloudshift.HashX;
cloudshift.OptionX =  $hxClasses['cloudshift.OptionX'] = function() { };
cloudshift.OptionX.__name__ = ["cloudshift","OptionX"];
cloudshift.OptionX.toOption = function(t) {
	return t == null?cloudshift.Option.None:cloudshift.Option.Some(t);
};
cloudshift.OptionX.toArray = function(o) {
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
cloudshift.OptionX.map = function(o,f) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = cloudshift.Option.None;
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.Option.Some(f(v));
			break;
		}
		return $r;
	}(this));
};
cloudshift.OptionX.next = function(o1,o2) {
	return o2;
};
cloudshift.OptionX.foreach = function(o,f) {
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
cloudshift.OptionX.filter = function(o,f) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = cloudshift.Option.None;
			break;
		case 1:
			var v = $e[2];
			$r = f(v)?cloudshift.Option.Some(v):cloudshift.Option.None;
			break;
		}
		return $r;
	}(this));
};
cloudshift.OptionX.flatMap = function(o,f) {
	return cloudshift.OptionX.flatten(cloudshift.OptionX.map(o,f));
};
cloudshift.OptionX.flatten = function(o1) {
	return (function($this) {
		var $r;
		var $e = (o1);
		switch( $e[1] ) {
		case 0:
			$r = cloudshift.Option.None;
			break;
		case 1:
			var o2 = $e[2];
			$r = o2;
			break;
		}
		return $r;
	}(this));
};
cloudshift.OptionX.get = function(o) {
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = cloudshift.Mixin.error("Error: Option is empty");
			break;
		case 1:
			var v = $e[2];
			$r = v;
			break;
		}
		return $r;
	}(this));
};
cloudshift.OptionX.orElse = function(o1,thunk) {
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
cloudshift.OptionX.getOrElse = function(o,thunk) {
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
cloudshift.OptionX.orElseC = function(o1,o2) {
	return cloudshift.OptionX.orElse(o1,cloudshift.DynamicX.toThunk(o2));
};
cloudshift.OptionX.getOrElseC = function(o,c) {
	return cloudshift.OptionX.getOrElse(o,cloudshift.DynamicX.toThunk(c));
};
cloudshift.OptionX.orEither = function(o1,thunk) {
	return (function($this) {
		var $r;
		var $e = (o1);
		switch( $e[1] ) {
		case 0:
			$r = cloudshift.EitherX.toLeft(thunk());
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.EitherX.toRight(v);
			break;
		}
		return $r;
	}(this));
};
cloudshift.OptionX.orEitherC = function(o1,c) {
	return cloudshift.OptionX.orEither(o1,cloudshift.DynamicX.toThunk(c));
};
cloudshift.OptionX.isEmpty = function(o) {
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
cloudshift.OptionX.prototype.__class__ = cloudshift.OptionX;
cloudshift.EitherX =  $hxClasses['cloudshift.EitherX'] = function() { };
cloudshift.EitherX.__name__ = ["cloudshift","EitherX"];
cloudshift.EitherX.toLeft = function(v) {
	return cloudshift.Either.Left(v);
};
cloudshift.EitherX.toRight = function(v) {
	return cloudshift.Either.Right(v);
};
cloudshift.EitherX.flip = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = cloudshift.Either.Right(v);
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.Either.Left(v);
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.left = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = cloudshift.Option.Some(v);
			break;
		default:
			$r = cloudshift.Option.None;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.isLeft = function(e) {
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
cloudshift.EitherX.isRight = function(e) {
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
cloudshift.EitherX.right = function(e) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 1:
			var v = $e[2];
			$r = cloudshift.Option.Some(v);
			break;
		default:
			$r = cloudshift.Option.None;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.get = function(e) {
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
cloudshift.EitherX.mapLeft = function(e,f) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = cloudshift.Either.Left(f(v));
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.Either.Right(v);
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.map = function(e,f1,f2) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = cloudshift.Either.Left(f1(v));
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.Either.Right(f2(v));
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.mapRight = function(e,f) {
	return (function($this) {
		var $r;
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			$r = cloudshift.Either.Left(v);
			break;
		case 1:
			var v = $e[2];
			$r = cloudshift.Either.Right(f(v));
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.flatMap = function(e,f1,f2) {
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
cloudshift.EitherX.composeLeft = function(e1,e2,ac,bc) {
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
					$r = cloudshift.Either.Left(ac(v1,v2));
					break;
				case 1:
					var v2 = $e[2];
					$r = cloudshift.Either.Left(v1);
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
					$r = cloudshift.Either.Left(v2);
					break;
				case 1:
					var v2 = $e[2];
					$r = cloudshift.Either.Right(bc(v1,v2));
					break;
				}
				return $r;
			}($this));
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.composeRight = function(e1,e2,ac,bc) {
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
					$r = cloudshift.Either.Left(ac(v1,v2));
					break;
				case 1:
					var v2 = $e[2];
					$r = cloudshift.Either.Right(v2);
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
					$r = cloudshift.Either.Right(v1);
					break;
				case 1:
					var v2 = $e[2];
					$r = cloudshift.Either.Right(bc(v1,v2));
					break;
				}
				return $r;
			}($this));
			break;
		}
		return $r;
	}(this));
};
cloudshift.EitherX.prototype.__class__ = cloudshift.EitherX;
cloudshift.PartX =  $hxClasses['cloudshift.PartX'] = function() { };
cloudshift.PartX.__name__ = ["cloudshift","PartX"];
cloudshift.PartX.start = function(part,data,oc) {
	return part.part_.start(data,oc);
};
cloudshift.PartX.stop = function(part,data) {
	return part.part_.stop(data);
};
cloudshift.PartX.stop_ = function(part,cb) {
	part.part_.setStop(cb);
};
cloudshift.PartX.observe = function(part,cb) {
	return part.part_.observe(cb);
};
cloudshift.PartX.notify = function(part,e) {
	part.part_.notify(e);
};
cloudshift.PartX.partID = function(part) {
	return part.part_.partID;
};
cloudshift.PartX.observeState = function(part,cb) {
	return part.part_._events.observe(cb);
};
cloudshift.PartX.state = function(part) {
	return part.part_.state;
};
cloudshift.PartX.info = function(part) {
	return part.part_._info;
};
cloudshift.PartX.prototype.__class__ = cloudshift.PartX;
cloudshift.OutcomeX =  $hxClasses['cloudshift.OutcomeX'] = function() { };
cloudshift.OutcomeX.__name__ = ["cloudshift","OutcomeX"];
cloudshift.OutcomeX.outcome = function(oc,cb,err) {
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))); else if(err != null) err(cloudshift.OptionX.get(cloudshift.EitherX.left(either))); else cloudshift.core.LogImpl.error(Std.string(cloudshift.OptionX.get(cloudshift.EitherX.left(either))),"",{ fileName : "Mixin.hx", lineNumber : 691, className : "cloudshift.OutcomeX", methodName : "outcome"});
	});
};
cloudshift.OutcomeX.oflatMap = function(oc,cb,err) {
	var roc = new cloudshift.core.FutureImpl();
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) cloudshift.OutcomeX.outcome(cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))),function(val) {
			roc.resolve(cloudshift.Either.Right(val));
		},err); else cloudshift.core.LogImpl.error(Std.string(cloudshift.OptionX.get(cloudshift.EitherX.left(either))),"",{ fileName : "Mixin.hx", lineNumber : 710, className : "cloudshift.OutcomeX", methodName : "oflatMap"});
	});
	return roc;
};
cloudshift.OutcomeX.omap = function(oc,cb,err) {
	var roc = new cloudshift.core.FutureImpl();
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) roc.resolve(cloudshift.Either.Right(cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))))); else if(err != null) err(cloudshift.OptionX.get(cloudshift.EitherX.left(either))); else cloudshift.core.LogImpl.error(Std.string(cloudshift.OptionX.get(cloudshift.EitherX.left(either))),"",{ fileName : "Mixin.hx", lineNumber : 729, className : "cloudshift.OutcomeX", methodName : "omap"});
	});
	return roc;
};
cloudshift.OutcomeX.prototype.__class__ = cloudshift.OutcomeX;
if(!cloudshift.core) cloudshift.core = {};
cloudshift.core.FutureImpl =  $hxClasses['cloudshift.core.FutureImpl'] = function() {
	this._listeners = [];
	this._result = null;
	this._isSet = false;
	this._isCanceled = false;
	this._cancelers = [];
	this._canceled = [];
	this._combined = 0;
};
cloudshift.core.FutureImpl.__name__ = ["cloudshift","core","FutureImpl"];
cloudshift.core.FutureImpl.dead = function() {
	var prm = new cloudshift.core.FutureImpl();
	prm.cancel();
	return prm;
};
cloudshift.core.FutureImpl.create = function() {
	return new cloudshift.core.FutureImpl();
};
cloudshift.core.FutureImpl.prototype._listeners = null;
cloudshift.core.FutureImpl.prototype._result = null;
cloudshift.core.FutureImpl.prototype._isSet = null;
cloudshift.core.FutureImpl.prototype._isCanceled = null;
cloudshift.core.FutureImpl.prototype._cancelers = null;
cloudshift.core.FutureImpl.prototype._canceled = null;
cloudshift.core.FutureImpl.prototype._combined = null;
cloudshift.core.FutureImpl.prototype.resolve = function(t) {
	return this._isCanceled?this:this._isSet?cloudshift.Mixin.error("Future already delivered"):(function($this) {
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
cloudshift.core.FutureImpl.prototype.allowCancelOnlyIf = function(f) {
	if(!this.isDone()) this._cancelers.push(f);
	return this;
};
cloudshift.core.FutureImpl.prototype.ifCanceled = function(f) {
	if(this.isCanceled()) f(); else if(!this.isDone()) this._canceled.push(f);
	return this;
};
cloudshift.core.FutureImpl.prototype.cancel = function() {
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
cloudshift.core.FutureImpl.prototype.isDone = function() {
	return this.isDelivered() || this.isCanceled();
};
cloudshift.core.FutureImpl.prototype.isDelivered = function() {
	return this._isSet;
};
cloudshift.core.FutureImpl.prototype.isCanceled = function() {
	return this._isCanceled;
};
cloudshift.core.FutureImpl.prototype.deliver = function(f) {
	if(this.isCanceled()) return this; else if(this.isDelivered()) f(this._result); else this._listeners.push(f);
	return this;
};
cloudshift.core.FutureImpl.prototype.map = function(f) {
	var fut = new cloudshift.core.FutureImpl();
	this.deliver(function(t) {
		fut.resolve(f(t));
	});
	this.ifCanceled(function() {
		fut.forceCancel();
	});
	return fut;
};
cloudshift.core.FutureImpl.prototype.then = function(f) {
	return f;
};
cloudshift.core.FutureImpl.prototype.flatMap = function(f) {
	var fut = new cloudshift.core.FutureImpl();
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
cloudshift.core.FutureImpl.prototype.filter = function(f) {
	var fut = new cloudshift.core.FutureImpl();
	this.deliver(function(t) {
		if(f(t)) fut.resolve(t); else fut.forceCancel();
	});
	this.ifCanceled(function() {
		fut.forceCancel();
	});
	return fut;
};
cloudshift.core.FutureImpl.prototype.value = function() {
	return this._isSet?cloudshift.Option.Some(this._result):cloudshift.Option.None;
};
cloudshift.core.FutureImpl.prototype.toOption = function() {
	return this.value();
};
cloudshift.core.FutureImpl.prototype.toArray = function() {
	return cloudshift.OptionX.toArray(this.value());
};
cloudshift.core.FutureImpl.prototype.forceCancel = function() {
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
cloudshift.core.FutureImpl.prototype.__class__ = cloudshift.core.FutureImpl;
cloudshift.core.FutureImpl.__interfaces__ = [cloudshift.Future];
cloudshift.core.LogImpl =  $hxClasses['cloudshift.core.LogImpl'] = function() { };
cloudshift.core.LogImpl.__name__ = ["cloudshift","core","LogImpl"];
cloudshift.core.LogImpl.format = function(type,msg,cat,inf) {
	var pos = "";
	if(inf != null) {
		if(inf.fileName != "Log.hx") pos = inf.fileName + ":" + inf.lineNumber;
	}
	var d = Date.now();
	var category = cat != ""?"|" + cat:cat;
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	return "[" + pos + "|" + time + "|" + type + category + "]" + Std.string(msg);
};
cloudshift.core.LogImpl.myTrace = function(v,inf) {
	cloudshift.core.LogImpl.debug(v,"",inf);
};
cloudshift.core.LogImpl.init = function(fileName) {
};
cloudshift.core.LogImpl.write = function(msg,type) {
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
cloudshift.core.LogImpl.doTrace = function(type,category,msg,inf) {
	if(type == "error") {
		var stack = haxe.Stack.toString(haxe.Stack.exceptionStack());
		if(stack.length == 0) stack = "No haXe stack trace available";
		msg = msg + "\n" + stack;
	}
	cloudshift.core.LogImpl.write(cloudshift.core.LogImpl.format(type,msg,category,inf),type);
};
cloudshift.core.LogImpl.info = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.doTrace("info",category,msg,inf);
};
cloudshift.core.LogImpl.warn = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.doTrace("warn",category,msg,inf);
};
cloudshift.core.LogImpl.error = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.doTrace("error",category,msg,inf);
};
cloudshift.core.LogImpl.debug = function(msg,category,inf) {
	if(category == null) category = "";
	cloudshift.core.LogImpl.doTrace("debug",category,msg,inf);
};
cloudshift.core.LogImpl.prototype.__class__ = cloudshift.core.LogImpl;
cloudshift.core.ObservableImpl =  $hxClasses['cloudshift.core.ObservableImpl'] = function() {
	this._observers = [];
	this._unsubscribes = 0;
};
cloudshift.core.ObservableImpl.__name__ = ["cloudshift","core","ObservableImpl"];
cloudshift.core.ObservableImpl.prototype.preNotify = null;
cloudshift.core.ObservableImpl.prototype._unsubscribes = null;
cloudshift.core.ObservableImpl.prototype._observers = null;
cloudshift.core.ObservableImpl.prototype._event = null;
cloudshift.core.ObservableImpl.prototype.notify = function(v) {
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
cloudshift.core.ObservableImpl.prototype.observe = function(cb,info) {
	var me = this;
	var h = { handler : cb, info : cloudshift.Core.toOption(info)};
	this._observers.push(h);
	if(this._event != null) this._event.notify(cloudshift.EOperation.Add(info));
	return function() {
		if(h.handler != null) {
			h.handler = null;
			me._unsubscribes++;
			if(me._unsubscribes >= cloudshift.core.ObservableImpl.CLEANUP) me.cleanup();
			if(me._event != null) me._event.notify(cloudshift.EOperation.Del(info));
		}
	};
};
cloudshift.core.ObservableImpl.prototype.cleanup = function() {
	haxe.Log.trace("cleaning up",{ fileName : "ObservableImpl.hx", lineNumber : 66, className : "cloudshift.core.ObservableImpl", methodName : "cleanup"});
	this._unsubscribes = 0;
	this._observers = cloudshift.ArrayX.filter(this._observers,function(s) {
		if(s.handler == null) haxe.Log.trace("filtering " + s.info,{ fileName : "ObservableImpl.hx", lineNumber : 70, className : "cloudshift.core.ObservableImpl", methodName : "cleanup"});
		return s.handler != null;
	});
};
cloudshift.core.ObservableImpl.prototype.peers = function() {
	return cloudshift.ArrayX.map(cloudshift.ArrayX.filter(this._observers,function(el) {
		return el.handler != null;
	}),function(el) {
		return el.info;
	});
};
cloudshift.core.ObservableImpl.prototype.peek = function(cb) {
	if(this._event == null) this._event = new cloudshift.core.ObservableImpl();
	this._event.observe(cb);
};
cloudshift.core.ObservableImpl.prototype.removePeers = function() {
	cloudshift.ArrayX.foreach(this._observers,function(s) {
		s.handler = null;
		s.info = null;
	});
	this._observers = [];
};
cloudshift.core.ObservableImpl.prototype.__class__ = cloudshift.core.ObservableImpl;
cloudshift.core.ObservableImpl.__interfaces__ = [cloudshift.Observable];
cloudshift.core.PartBaseImpl =  $hxClasses['cloudshift.core.PartBaseImpl'] = function(parent,info) {
	var me = this;
	this._parent = parent;
	this._info = info;
	this._ID = cloudshift.core.PartBaseImpl._nextID++;
	this._observers = [];
	this.partID = Type.getClassName(Type.getClass(this._parent)) + Std.string(this._ID);
	this._events = new cloudshift.core.ObservableImpl();
	this.sstopper = function(d) {
		throw "Default stop function called for :" + me.partID + ". Add a stop function with stop_(stopFunction)";
		return null;
	};
};
cloudshift.core.PartBaseImpl.__name__ = ["cloudshift","core","PartBaseImpl"];
cloudshift.core.PartBaseImpl.prototype.partID = null;
cloudshift.core.PartBaseImpl.prototype._events = null;
cloudshift.core.PartBaseImpl.prototype.state = null;
cloudshift.core.PartBaseImpl.prototype._info = null;
cloudshift.core.PartBaseImpl.prototype.sstopper = null;
cloudshift.core.PartBaseImpl.prototype._observers = null;
cloudshift.core.PartBaseImpl.prototype._ID = null;
cloudshift.core.PartBaseImpl.prototype._parent = null;
cloudshift.core.PartBaseImpl.prototype.peer = function() {
	return this._parent;
};
cloudshift.core.PartBaseImpl.prototype.notify = function(e) {
	this._events.notify(cloudshift.EPartState.Event(e));
};
cloudshift.core.PartBaseImpl.prototype.notifyState = function(s) {
	this._events.notify(s);
};
cloudshift.core.PartBaseImpl.prototype.observe = function(cb,info) {
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
cloudshift.core.PartBaseImpl.prototype.observeState = function(cb) {
	this._events.observe(cb);
};
cloudshift.core.PartBaseImpl.prototype.start = function(d,oc) {
	var me = this;
	var p = this._parent.start_(d,oc);
	this.checkErr("start",p);
	cloudshift.OutcomeX.outcome(p,function(outcome) {
		me.partInfo("started");
		me.state = cloudshift.EPartState.Started;
		me._events.notify(cloudshift.EPartState.Started);
	},function(msg) {
		return me._events.notify(cloudshift.EPartState.Error(Std.string(msg)));
	});
	return p;
};
cloudshift.core.PartBaseImpl.prototype.stop = function(d) {
	var me = this;
	var p = this.sstopper(d);
	this.checkErr("stop",p);
	cloudshift.OutcomeX.outcome(p,function(outcome) {
		me.state = cloudshift.EPartState.Stopped;
		me.partInfo("stopped");
		me._events.notify(cloudshift.EPartState.Stopped);
		cloudshift.ArrayX.foreach(me._observers,function(observerRemove) {
			observerRemove();
		});
	},function(msg) {
		me._events.notify(cloudshift.EPartState.Error(msg));
	});
	return p;
};
cloudshift.core.PartBaseImpl.prototype.setStop = function(cb) {
	this.partInfo("with user stop_()");
	this.sstopper = cb;
};
cloudshift.core.PartBaseImpl.prototype.partInfo = function(info) {
};
cloudshift.core.PartBaseImpl.prototype.checkErr = function(type,outcome) {
	if(outcome == null) throw this.partID + " should not return null for " + type + " function";
	return outcome;
};
cloudshift.core.PartBaseImpl.prototype.__class__ = cloudshift.core.PartBaseImpl;
cloudshift.core.PartBaseImpl.__interfaces__ = [cloudshift.Part_];
if(typeof haxe=='undefined') haxe = {};
haxe.Http =  $hxClasses['haxe.Http'] = function(url) {
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
			uri += StringTools.urlDecode(p) + "=" + StringTools.urlEncode(this.params.get(p));
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
haxe.Json =  $hxClasses['haxe.Json'] = function() {
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
haxe.Json.prototype.objString = function(v) {
	var first = true;
	this.buf.add("{");
	var _g = 0, _g1 = Reflect.fields(v);
	while(_g < _g1.length) {
		var f = _g1[_g];
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
		} else if(v.iterator != null) {
			var a = [];
			var it = v.iterator();
			while( it.hasNext() ) {
				var v1 = it.next();
				a.push(v1);
			}
			this.toStringRec(a);
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
		var c = s.cca(i++);
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
	throw "Invalid char " + this.str.cca(this.pos) + " at position " + this.pos;
};
haxe.Json.prototype.nextChar = function() {
	return this.str.cca(this.pos++);
};
haxe.Json.prototype.parseRec = function() {
	while(true) {
		var c = this.str.cca(this.pos++);
		switch(c) {
		case 32:case 13:case 10:case 9:
			break;
		case 123:
			var obj = { }, field = null, comma = null;
			while(true) {
				var c1 = this.str.cca(this.pos++);
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
				var c1 = this.str.cca(this.pos++);
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
			if(this.str.cca(this.pos++) != 114 || this.str.cca(this.pos++) != 117 || this.str.cca(this.pos++) != 101) {
				this.pos = save;
				this.invalidChar();
			}
			return true;
		case 102:
			var save = this.pos;
			if(this.str.cca(this.pos++) != 97 || this.str.cca(this.pos++) != 108 || this.str.cca(this.pos++) != 115 || this.str.cca(this.pos++) != 101) {
				this.pos = save;
				this.invalidChar();
			}
			return false;
		case 110:
			var save = this.pos;
			if(this.str.cca(this.pos++) != 117 || this.str.cca(this.pos++) != 108 || this.str.cca(this.pos++) != 108) {
				this.pos = save;
				this.invalidChar();
			}
			return null;
		case 34:
			return this.parseString();
		case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
			this.pos--;
			if(!this.reg_float.match(this.str.substr(this.pos))) throw "Invalid float at position " + this.pos;
			var v = this.reg_float.matched(0);
			this.pos += v.length;
			var f = Std.parseFloat(v);
			var i = f | 0;
			return i == f?i:f;
		default:
			this.invalidChar();
		}
	}
	return null;
};
haxe.Json.prototype.parseString = function() {
	var start = this.pos;
	var buf = new StringBuf();
	while(true) {
		var c = this.str.cca(this.pos++);
		if(c == 34) break;
		if(c == 92) {
			buf.b[buf.b.length] = this.str.substr(start,this.pos - start - 1);
			c = this.str.cca(this.pos++);
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
				var uc = Std.parseInt("0x" + this.str.substr(this.pos,4));
				this.pos += 4;
				buf.b[buf.b.length] = String.fromCharCode(uc);
				break;
			default:
				throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
			}
			start = this.pos;
		} else if(c != c) throw "Unclosed string";
	}
	buf.b[buf.b.length] = this.str.substr(start,this.pos - start - 1);
	return buf.b.join("");
};
haxe.Json.prototype.__class__ = haxe.Json;
haxe.Log =  $hxClasses['haxe.Log'] = function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
};
haxe.Log.prototype.__class__ = haxe.Log;
haxe.Serializer =  $hxClasses['haxe.Serializer'] = function() {
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
			var l = v["length"];
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
			this.buf.add(d.toString());
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
		var l = v["length"];
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
haxe.Stack =  $hxClasses['haxe.Stack'] = function() { };
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
haxe.Unserializer =  $hxClasses['haxe.Unserializer'] = function(buf) {
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
		codes[haxe.Unserializer.BASE64.cca(i)] = i;
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
	return this.buf.cca(p);
};
haxe.Unserializer.prototype.readDigits = function() {
	var k = 0;
	var s = false;
	var fpos = this.pos;
	while(true) {
		var c = this.buf.cca(this.pos);
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
		if(this.buf.cca(this.pos) == 103) break;
		var k = this.unserialize();
		if(!Std["is"](k,String)) throw "Invalid object key";
		var v = this.unserialize();
		o[k] = v;
	}
	this.pos++;
};
haxe.Unserializer.prototype.unserializeEnum = function(edecl,tag) {
	if(this.buf.cca(this.pos++) != 58) throw "Invalid enum format";
	var nargs = this.readDigits();
	if(nargs == 0) return Type.createEnum(edecl,tag);
	var args = new Array();
	while(nargs-- > 0) args.push(this.unserialize());
	return Type.createEnum(edecl,tag,args);
};
haxe.Unserializer.prototype.unserialize = function() {
	switch(this.buf.cca(this.pos++)) {
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
			var c = this.buf.cca(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(this.buf.substr(p1,this.pos - p1));
	case 121:
		var len = this.readDigits();
		if(this.buf.cca(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
		var s = this.buf.substr(this.pos,len);
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
			var c = this.buf.cca(this.pos);
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
		while(this.buf.cca(this.pos) != 104) l.add(this.unserialize());
		this.pos++;
		return l;
	case 98:
		var h = new Hash();
		this.cache.push(h);
		var buf = this.buf;
		while(this.buf.cca(this.pos) != 104) {
			var s = this.unserialize();
			h.set(s,this.unserialize());
		}
		this.pos++;
		return h;
	case 113:
		var h = new IntHash();
		this.cache.push(h);
		var buf = this.buf;
		var c = this.buf.cca(this.pos++);
		while(c == 58) {
			var i = this.readDigits();
			h.set(i,this.unserialize());
			c = this.buf.cca(this.pos++);
		}
		if(c != 104) throw "Invalid IntHash format";
		return h;
	case 118:
		var d = Date.fromString(this.buf.substr(this.pos,19));
		this.cache.push(d);
		this.pos += 19;
		return d;
	case 115:
		var len = this.readDigits();
		var buf = this.buf;
		if(this.buf.cca(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
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
			var c1 = codes[buf.cca(i++)];
			var c2 = codes[buf.cca(i++)];
			bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
			var c3 = codes[buf.cca(i++)];
			bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
			var c4 = codes[buf.cca(i++)];
			bytes.b[bpos++] = (c3 << 6 | c4) & 255;
		}
		if(rest >= 2) {
			var c1 = codes[buf.cca(i++)];
			var c2 = codes[buf.cca(i++)];
			bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
			if(rest == 3) {
				var c3 = codes[buf.cca(i++)];
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
		if(this.buf.cca(this.pos++) != 103) throw "Invalid custom data";
		return o;
	default:
	}
	this.pos--;
	throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
};
haxe.Unserializer.prototype.__class__ = haxe.Unserializer;
if(!haxe.io) haxe.io = {};
haxe.io.Bytes =  $hxClasses['haxe.io.Bytes'] = function(length,b) {
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
		var c = s.cca(i);
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
		chars.push(str.charCodeAt(i));
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
haxe.remoting.AsyncConnection =  $hxClasses['haxe.remoting.AsyncConnection'] = function() { };
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype.resolve = null;
haxe.remoting.AsyncConnection.prototype.call = null;
haxe.remoting.AsyncConnection.prototype.setErrorHandler = null;
haxe.remoting.AsyncConnection.prototype.__class__ = haxe.remoting.AsyncConnection;
haxe.remoting.HttpAsyncConnection =  $hxClasses['haxe.remoting.HttpAsyncConnection'] = function(data,path) {
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
	var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.copy());
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
			if(response.substr(0,3) != "hxr") throw "Invalid response : '" + response + "'";
			var s1 = new haxe.Unserializer(response.substr(3));
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
js.Boot =  $hxClasses['js.Boot'] = function() { };
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
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
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
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
};
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return undefined;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	Function.prototype["$bind"] = function(o) {
		var f = function() {
			return f.method.apply(f.scope,arguments);
		};
		f.scope = o;
		f.method = this;
		return f;
	};
};
js.Boot.prototype.__class__ = js.Boot;
js.Lib =  $hxClasses['js.Lib'] = function() { };
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
js.Lib.eval = function(code) {
	return eval(code);
};
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
};
js.Lib.prototype.__class__ = js.Lib;
$_ = {};
js.Boot.__res = {};
js.Boot.__init();
{
	var d = Date;
	d.now = function() {
		return new Date();
	};
	d.fromTime = function(t) {
		var d1 = new Date();
		d1["setTime"](t);
		return d1;
	};
	d.fromString = function(s) {
		switch(s.length) {
		case 8:
			var k = s.split(":");
			var d1 = new Date();
			d1["setTime"](0);
			d1["setUTCHours"](k[0]);
			d1["setUTCMinutes"](k[1]);
			d1["setUTCSeconds"](k[2]);
			return d1;
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
	d.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d1 = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d1 < 10?"0" + d1:"" + d1) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
	};
	d.prototype.__class__ = $hxClasses["Date"] = d;
	d.__name__ = ["Date"];
};
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
};
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	var Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses["Bool"] = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
};
if(typeof(JSON) != "undefined") haxe.Json = JSON;
{
	if(typeof document != "undefined") js.Lib.document = document;
	if(typeof window != "undefined") {
		js.Lib.window = window;
		js.Lib.window.onerror = function(msg,url,line) {
			var f = js.Lib.onerror;
			if(f == null) return false;
			return f(msg,[url + ":" + line]);
		};
	}
};
js["XMLHttpRequest"] = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
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
cloudshift.Core.CSROOT = "/__cs/";
;
cloudshift.core.ObservableImpl.CLEANUP = 1;
;
cloudshift.core.PartBaseImpl.runningParts = [];
;
cloudshift.core.PartBaseImpl._nextID = 0;
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
js.Lib.onerror = null;
;
Client.main();
