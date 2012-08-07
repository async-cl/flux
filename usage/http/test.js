var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); };
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };;
EReg = $hxClasses['EReg'] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype.customReplace = function(s,f) {
	var buf = new StringBuf();
	while(true) {
		if(!this.match(s)) break;
		buf.b += Std.string(this.matchedLeft());
		buf.b += Std.string(f(this));
		s = this.matchedRight();
	}
	buf.b += Std.string(s);
	return buf.b;
};
EReg.prototype.replace = function(s,by) {
	return s.replace(this.r,by);
};
EReg.prototype.split = function(s) {
	var d = "#__delim__#";
	return s.replace(this.r,d).split(d);
};
EReg.prototype.matchedPos = function() {
	if(this.r.m == null) throw "No string matched";
	return { pos : this.r.m.index, len : this.r.m[0].length};
};
EReg.prototype.matchedRight = function() {
	if(this.r.m == null) throw "No string matched";
	var sz = this.r.m.index + this.r.m[0].length;
	return this.r.s.substr(sz,this.r.s.length - sz);
};
EReg.prototype.matchedLeft = function() {
	if(this.r.m == null) throw "No string matched";
	return this.r.s.substr(0,this.r.m.index);
};
EReg.prototype.matched = function(n) {
	return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
		var $r;
		throw "EReg::matched";
		return $r;
	}(this));
};
EReg.prototype.match = function(s) {
	if(this.r.global) this.r.lastIndex = 0;
	this.r.m = this.r.exec(s);
	this.r.s = s;
	return this.r.m != null;
};
EReg.prototype.r = null;
EReg.prototype.__class__ = EReg;
Hash = $hxClasses['Hash'] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype.toString = function() {
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
};
Hash.prototype.iterator = function() {
	return { ref : this.h, it : this.keys(), hasNext : function() {
		return this.it.hasNext();
	}, next : function() {
		var i = this.it.next();
		return this.ref["$" + i];
	}};
};
Hash.prototype.keys = function() {
	var a = [];
	for( var key in this.h ) {
	if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
	}
	return HxOverrides.iter(a);
};
Hash.prototype.remove = function(key) {
	key = "$" + key;
	if(!this.h.hasOwnProperty(key)) return false;
	delete(this.h[key]);
	return true;
};
Hash.prototype.exists = function(key) {
	return this.h.hasOwnProperty("$" + key);
};
Hash.prototype.get = function(key) {
	return this.h["$" + key];
};
Hash.prototype.set = function(key,value) {
	this.h["$" + key] = value;
};
Hash.prototype.h = null;
Hash.prototype.__class__ = Hash;
HttpTest = $hxClasses['HttpTest'] = function() { };
HttpTest.__name__ = ["HttpTest"];
HttpTest.main = function() {
	flux.Core.init();
	flux.OutcomeX.outcome(flux.StartableX.start(flux.Http.server().root("www").credentials("privatekey.pem","certificate.pem"),{ host : "localhost", port : 8000}),function(http) {
	});
};
HttpTest.prototype.__class__ = HttpTest;
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
IntIter = $hxClasses['IntIter'] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype.next = function() {
	return this.min++;
};
IntIter.prototype.hasNext = function() {
	return this.min < this.max;
};
IntIter.prototype.max = null;
IntIter.prototype.min = null;
IntIter.prototype.__class__ = IntIter;
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
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
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
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype.toString = function() {
	return this.b;
};
StringBuf.prototype.addSub = function(s,pos,len) {
	this.b += HxOverrides.substr(s,pos,len);
};
StringBuf.prototype.addChar = function(c) {
	this.b += String.fromCharCode(c);
};
StringBuf.prototype.add = function(x) {
	this.b += Std.string(x);
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
flux.Future = $hxClasses['flux.Future'] = function() { };
flux.Future.__name__ = ["flux","Future"];
flux.Future.prototype.toArray = null;
flux.Future.prototype.toOption = null;
flux.Future.prototype.value = null;
flux.Future.prototype.filter = null;
flux.Future.prototype.flatMap = null;
flux.Future.prototype.map = null;
flux.Future.prototype.isDelivered = null;
flux.Future.prototype.isDone = null;
flux.Future.prototype.cancel = null;
flux.Future.prototype.allowCancelOnlyIf = null;
flux.Future.prototype.ifCanceled = null;
flux.Future.prototype.isCanceled = null;
flux.Future.prototype.deliver = null;
flux.Future.prototype.resolve = null;
flux.Future.prototype.__class__ = flux.Future;
flux.EOperation = $hxClasses['flux.EOperation'] = { __ename__ : ["flux","EOperation"], __constructs__ : ["Add","Del"] };
flux.EOperation.Add = function(info) { var $x = ["Add",0,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; };
flux.EOperation.Del = function(info) { var $x = ["Del",1,info]; $x.__enum__ = flux.EOperation; $x.toString = $estr; return $x; };
flux.Startable = $hxClasses['flux.Startable'] = function() { };
flux.Startable.__name__ = ["flux","Startable"];
flux.Startable.prototype.start_ = null;
flux.Startable.prototype.__class__ = flux.Startable;
flux.Stoppable = $hxClasses['flux.Stoppable'] = function() { };
flux.Stoppable.__name__ = ["flux","Stoppable"];
flux.Stoppable.prototype.stop_ = null;
flux.Stoppable.prototype.__class__ = flux.Stoppable;
flux.Observable = $hxClasses['flux.Observable'] = function() { };
flux.Observable.__name__ = ["flux","Observable"];
flux.Observable.prototype.peek = null;
flux.Observable.prototype.removePeers = null;
flux.Observable.prototype.peers = null;
flux.Observable.prototype.observe = null;
flux.Observable.prototype.notify = null;
flux.Observable.prototype.__class__ = flux.Observable;
flux.Core = $hxClasses['flux.Core'] = function() { };
flux.Core.__name__ = ["flux","Core"];
flux.Core.init = function() {
	flux.core.LogImpl.init(null);
	flux.Sys.events().observe(function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 1:
			var exc = $e[2];
			flux.core.LogImpl.error("Uncaught exception: " + Std.string(exc),"",{ fileName : "Core.hx", lineNumber : 72, className : "flux.Core", methodName : "init"});
			break;
		case 0:
			break;
		case 2:
			var sig = $e[2];
			break;
		}
	});
};
flux.Core.future = function() {
	return new flux.core.FutureImpl();
};
flux.Core.outcome = function(cancel) {
	return new flux.core.FutureImpl();
};
flux.Core.cancelledFuture = function() {
	return flux.core.FutureImpl.dead();
};
flux.Core.observable = function() {
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
flux.Core.assert = function(cond,pos) {
	if(!cond) {
		flux.core.LogImpl.error("Assert failed in " + pos.className + "::" + pos.methodName,"",pos);
		flux.Sys.exit(1);
	}
};
flux.Core.prototype.__class__ = flux.Core;
flux.StartableX = $hxClasses['flux.StartableX'] = function() { };
flux.StartableX.__name__ = ["flux","StartableX"];
flux.StartableX.start = function(s,p,oc) {
	if(oc == null) oc = new flux.core.FutureImpl();
	return s.start_(p,oc);
};
flux.StartableX.prototype.__class__ = flux.StartableX;
flux.StoppableX = $hxClasses['flux.StoppableX'] = function() { };
flux.StoppableX.__name__ = ["flux","StoppableX"];
flux.StoppableX.stop = function(s,p,oc) {
	if(oc == null) oc = new flux.core.FutureImpl();
	return s.stop_(p,oc);
};
flux.StoppableX.prototype.__class__ = flux.StoppableX;
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
flux.OutcomeX = $hxClasses['flux.OutcomeX'] = function() { };
flux.OutcomeX.__name__ = ["flux","OutcomeX"];
flux.OutcomeX.outcome = function(oc,cb,err) {
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) cb(flux.OptionX.get(flux.EitherX.right(either))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 838, className : "flux.OutcomeX", methodName : "outcome"});
	});
};
flux.OutcomeX.oflatMap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) flux.OutcomeX.outcome(cb(flux.OptionX.get(flux.EitherX.right(either))),function(val) {
			roc.resolve(flux.Either.Right(val));
		},err); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 857, className : "flux.OutcomeX", methodName : "oflatMap"});
	});
	return roc;
};
flux.OutcomeX.omap = function(oc,cb,err) {
	var roc = new flux.core.FutureImpl();
	oc.deliver(function(either) {
		if(flux.EitherX.isRight(either)) roc.resolve(flux.Either.Right(cb(flux.OptionX.get(flux.EitherX.right(either))))); else if(err != null) err(flux.OptionX.get(flux.EitherX.left(either))); else flux.core.LogImpl.error(Std.string(flux.OptionX.get(flux.EitherX.left(either))),"",{ fileName : "Core.hx", lineNumber : 876, className : "flux.OutcomeX", methodName : "omap"});
	});
	return roc;
};
flux.OutcomeX.prototype.__class__ = flux.OutcomeX;
flux.HttpEvents = $hxClasses['flux.HttpEvents'] = { __ename__ : ["flux","HttpEvents"], __constructs__ : ["Connection","CheckContinue","Upgrade","ClientError","Close"] };
flux.HttpEvents.CheckContinue = ["CheckContinue",1];
flux.HttpEvents.CheckContinue.toString = $estr;
flux.HttpEvents.CheckContinue.__enum__ = flux.HttpEvents;
flux.HttpEvents.Connection = ["Connection",0];
flux.HttpEvents.Connection.toString = $estr;
flux.HttpEvents.Connection.__enum__ = flux.HttpEvents;
flux.HttpEvents.Close = ["Close",4];
flux.HttpEvents.Close.toString = $estr;
flux.HttpEvents.Close.__enum__ = flux.HttpEvents;
flux.HttpEvents.Upgrade = ["Upgrade",2];
flux.HttpEvents.Upgrade.toString = $estr;
flux.HttpEvents.Upgrade.__enum__ = flux.HttpEvents;
flux.HttpEvents.ClientError = ["ClientError",3];
flux.HttpEvents.ClientError.toString = $estr;
flux.HttpEvents.ClientError.__enum__ = flux.HttpEvents;
flux.HttpServer = $hxClasses['flux.HttpServer'] = function() { };
flux.HttpServer.__name__ = ["flux","HttpServer"];
flux.HttpServer.prototype.root = null;
flux.HttpServer.prototype.credentials = null;
flux.HttpServer.prototype.serverName = null;
flux.HttpServer.prototype.index = null;
flux.HttpServer.prototype.notFound = null;
flux.HttpServer.prototype.handler = null;
flux.HttpServer.prototype.serveNoCache = null;
flux.HttpServer.prototype.serve = null;
flux.HttpServer.prototype.fields = null;
flux.HttpServer.prototype.__class__ = flux.HttpServer;
flux.HttpServer.__interfaces__ = [flux.Observable,flux.Startable];
flux.Http = $hxClasses['flux.Http'] = function() { };
flux.Http.__name__ = ["flux","Http"];
flux.Http.server = function() {
	return new flux.http.HttpImpl();
};
flux.Http.get = function(url,params,headers) {
	var oc = new flux.core.FutureImpl(), pu = js.Node.url.parse(url), client = js.Node.http.createClient(Std.parseInt(pu.port == null?"80":pu.port),pu.hostname), myheaders = { host : pu.hostname}, request;
	if(headers != null) {
		var _g = 0, _g1 = Reflect.fields(headers);
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			myheaders[h] = Reflect.field(headers,h);
		}
	}
	request = client.request("GET",url,myheaders);
	request.addListener("response",function(response) {
		var resp = new StringBuf();
		response.on("data",function(chunk) {
			resp.b += Std.string(chunk);
		});
		response.on("end",function() {
			oc.resolve(flux.Either.Right(resp.b));
		});
	});
	if(params != null) request.end(js.Node.queryString.stringify(params)); else request.end();
	return oc;
};
flux.Http.post = function(url,payload,urlEncoded,headers) {
	if(urlEncoded == null) urlEncoded = true;
	var oc = new flux.core.FutureImpl(), pu = js.Node.url.parse(url), client = js.Node.http.createClient(Std.parseInt(pu.port == null?"80":pu.port),pu.hostname), myheaders = { host : pu.hostname}, request;
	if(headers != null) {
		var _g = 0, _g1 = Reflect.fields(headers);
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			myheaders[h] = Reflect.field(headers,h);
		}
	}
	if(urlEncoded) myheaders["Content-Type"] = "application/x-www-form-urlencoded"; else myheaders["Content-Length"] = Std.string(Std.string(payload).length);
	request = client.request("POST",url,myheaders);
	request.addListener("response",function(response) {
		var resp = new StringBuf();
		response.on("data",function(chunk) {
			resp.b += Std.string(chunk);
		});
		response.on("end",function() {
			oc.resolve(flux.Either.Right(resp.b));
		});
	});
	if(urlEncoded) request.end(js.Node.queryString.stringify(payload)); else request.end(payload);
	return oc;
};
flux.Http.prototype.__class__ = flux.Http;
flux.SysEnc = $hxClasses['flux.SysEnc'] = { __ename__ : ["flux","SysEnc"], __constructs__ : ["ASCII","UTF8","BINARY","BASE64"] };
flux.SysEnc.BASE64 = ["BASE64",3];
flux.SysEnc.BASE64.toString = $estr;
flux.SysEnc.BASE64.__enum__ = flux.SysEnc;
flux.SysEnc.ASCII = ["ASCII",0];
flux.SysEnc.ASCII.toString = $estr;
flux.SysEnc.ASCII.__enum__ = flux.SysEnc;
flux.SysEnc.UTF8 = ["UTF8",1];
flux.SysEnc.UTF8.toString = $estr;
flux.SysEnc.UTF8.__enum__ = flux.SysEnc;
flux.SysEnc.BINARY = ["BINARY",2];
flux.SysEnc.BINARY.toString = $estr;
flux.SysEnc.BINARY.__enum__ = flux.SysEnc;
flux.SysEvents = $hxClasses['flux.SysEvents'] = { __ename__ : ["flux","SysEvents"], __constructs__ : ["ProcessExit","ProcessUncaughtException","SigInt"] };
flux.SysEvents.ProcessUncaughtException = function(ex) { var $x = ["ProcessUncaughtException",1,ex]; $x.__enum__ = flux.SysEvents; $x.toString = $estr; return $x; };
flux.SysEvents.SigInt = function(s) { var $x = ["SigInt",2,s]; $x.__enum__ = flux.SysEvents; $x.toString = $estr; return $x; };
flux.SysEvents.ProcessExit = ["ProcessExit",0];
flux.SysEvents.ProcessExit.toString = $estr;
flux.SysEvents.ProcessExit.__enum__ = flux.SysEvents;
flux.SysWriteStreamEvents = $hxClasses['flux.SysWriteStreamEvents'] = { __ename__ : ["flux","SysWriteStreamEvents"], __constructs__ : ["Drain","Error","Close","Pipe"] };
flux.SysWriteStreamEvents.Drain = ["Drain",0];
flux.SysWriteStreamEvents.Drain.toString = $estr;
flux.SysWriteStreamEvents.Drain.__enum__ = flux.SysWriteStreamEvents;
flux.SysWriteStreamEvents.Pipe = function(src) { var $x = ["Pipe",3,src]; $x.__enum__ = flux.SysWriteStreamEvents; $x.toString = $estr; return $x; };
flux.SysWriteStreamEvents.Close = ["Close",2];
flux.SysWriteStreamEvents.Close.toString = $estr;
flux.SysWriteStreamEvents.Close.__enum__ = flux.SysWriteStreamEvents;
flux.SysWriteStreamEvents.Error = function(e) { var $x = ["Error",1,e]; $x.__enum__ = flux.SysWriteStreamEvents; $x.toString = $estr; return $x; };
flux.SysReadStreamEvents = $hxClasses['flux.SysReadStreamEvents'] = { __ename__ : ["flux","SysReadStreamEvents"], __constructs__ : ["Data","Error","End","Close","Fd"] };
flux.SysReadStreamEvents.Fd = ["Fd",4];
flux.SysReadStreamEvents.Fd.toString = $estr;
flux.SysReadStreamEvents.Fd.__enum__ = flux.SysReadStreamEvents;
flux.SysReadStreamEvents.Close = ["Close",3];
flux.SysReadStreamEvents.Close.toString = $estr;
flux.SysReadStreamEvents.Close.__enum__ = flux.SysReadStreamEvents;
flux.SysReadStreamEvents.Data = function(d) { var $x = ["Data",0,d]; $x.__enum__ = flux.SysReadStreamEvents; $x.toString = $estr; return $x; };
flux.SysReadStreamEvents.End = ["End",2];
flux.SysReadStreamEvents.End.toString = $estr;
flux.SysReadStreamEvents.End.__enum__ = flux.SysReadStreamEvents;
flux.SysReadStreamEvents.Error = function(e) { var $x = ["Error",1,e]; $x.__enum__ = flux.SysReadStreamEvents; $x.toString = $estr; return $x; };
flux.SysChildProcessEvents = $hxClasses['flux.SysChildProcessEvents'] = { __ename__ : ["flux","SysChildProcessEvents"], __constructs__ : ["Exit"] };
flux.SysChildProcessEvents.Exit = function(code,signal) { var $x = ["Exit",0,code,signal]; $x.__enum__ = flux.SysChildProcessEvents; $x.toString = $estr; return $x; };
flux.SysChildProcess = $hxClasses['flux.SysChildProcess'] = function() { };
flux.SysChildProcess.__name__ = ["flux","SysChildProcess"];
flux.SysChildProcess.prototype.kill = null;
flux.SysChildProcess.prototype.pid = null;
flux.SysChildProcess.prototype.stderr = null;
flux.SysChildProcess.prototype.stdout = null;
flux.SysChildProcess.prototype.stdin = null;
flux.SysChildProcess.prototype.__class__ = flux.SysChildProcess;
flux.SysChildProcess.__interfaces__ = [flux.Observable];
flux.SysWriteStream = $hxClasses['flux.SysWriteStream'] = function() { };
flux.SysWriteStream.__name__ = ["flux","SysWriteStream"];
flux.SysWriteStream.prototype.getNodeWriteStream = null;
flux.SysWriteStream.prototype.end = null;
flux.SysWriteStream.prototype.write = null;
flux.SysWriteStream.prototype.writeable = null;
flux.SysWriteStream.prototype.__class__ = flux.SysWriteStream;
flux.SysWriteStream.__interfaces__ = [flux.Observable];
flux.SysReadStream = $hxClasses['flux.SysReadStream'] = function() { };
flux.SysReadStream.__name__ = ["flux","SysReadStream"];
flux.SysReadStream.prototype.getNodeReadStream = null;
flux.SysReadStream.prototype.pipe = null;
flux.SysReadStream.prototype.setEncoding = null;
flux.SysReadStream.prototype.destroySoon = null;
flux.SysReadStream.prototype.destroy = null;
flux.SysReadStream.prototype.resume = null;
flux.SysReadStream.prototype.pause = null;
flux.SysReadStream.prototype.readable = null;
flux.SysReadStream.prototype.__class__ = flux.SysReadStream;
flux.SysReadStream.__interfaces__ = [flux.Observable];
if(typeof js=='undefined') js = {};
js.Node = $hxClasses['js.Node'] = function() { };
js.Node.__name__ = ["js","Node"];
js.Node.require = null;
js.Node.querystring = null;
js.Node.util = null;
js.Node.fs = null;
js.Node.dgram = null;
js.Node.net = null;
js.Node.os = null;
js.Node.http = null;
js.Node.https = null;
js.Node.path = null;
js.Node.url = null;
js.Node.dns = null;
js.Node.vm = null;
js.Node.process = null;
js.Node.tty = null;
js.Node.assert = null;
js.Node.crypto = null;
js.Node.tls = null;
js.Node.repl = null;
js.Node.childProcess = null;
js.Node.console = null;
js.Node.cluster = null;
js.Node.setTimeout = null;
js.Node.clearTimeout = null;
js.Node.setInterval = null;
js.Node.clearInterval = null;
js.Node.global = null;
js.Node.__filename = null;
js.Node.__dirname = null;
js.Node.module = null;
js.Node.stringify = null;
js.Node.parse = null;
js.Node.queryString = null;
js.Node.newSocket = function(options) {
	return new js.Node.net.Socket(options);
};
js.Node.prototype.__class__ = js.Node;
if(!flux.core) flux.core = {};
flux.core.ObservableImpl = $hxClasses['flux.core.ObservableImpl'] = function() {
	this._observers = [];
	this._unsubscribes = 0;
};
flux.core.ObservableImpl.__name__ = ["flux","core","ObservableImpl"];
flux.core.ObservableImpl.prototype.removePeers = function() {
	flux.ArrayX.foreach(this._observers,function(s) {
		s.handler = null;
		s.info = null;
	});
	this._observers = [];
};
flux.core.ObservableImpl.prototype.peek = function(cb) {
	if(this._event == null) this._event = new flux.core.ObservableImpl();
	this._event.observe(cb);
};
flux.core.ObservableImpl.prototype.peers = function() {
	return flux.ArrayX.map(flux.ArrayX.filter(this._observers,function(el) {
		return el.handler != null;
	}),function(el) {
		return el.info;
	});
};
flux.core.ObservableImpl.prototype.cleanup = function() {
	console.log("cleaning up");
	this._unsubscribes = 0;
	this._observers = flux.ArrayX.filter(this._observers,function(s) {
		if(s.handler == null) console.log("filtering " + Std.string(s.info));
		return s.handler != null;
	});
};
flux.core.ObservableImpl.prototype.observe = function(cb,info) {
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
};
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
flux.core.ObservableImpl.prototype._event = null;
flux.core.ObservableImpl.prototype._observers = null;
flux.core.ObservableImpl.prototype._unsubscribes = null;
flux.core.ObservableImpl.prototype.preNotify = null;
flux.core.ObservableImpl.prototype.__class__ = flux.core.ObservableImpl;
flux.core.ObservableImpl.__interfaces__ = [flux.Observable];
if(!flux.sys) flux.sys = {};
flux.sys.Events = $hxClasses['flux.sys.Events'] = function() {
	var _g = this;
	flux.core.ObservableImpl.call(this);
	js.Node.process.addListener("exit",function() {
		_g.notify(flux.SysEvents.ProcessExit);
	});
	js.Node.process.addListener("uncaughtException",function(ex) {
		_g.notify(flux.SysEvents.ProcessUncaughtException(ex));
	});
};
flux.sys.Events.__name__ = ["flux","sys","Events"];
flux.sys.Events.__super__ = flux.core.ObservableImpl;
for(var k in flux.core.ObservableImpl.prototype ) flux.sys.Events.prototype[k] = flux.core.ObservableImpl.prototype[k];
flux.sys.Events.prototype.__class__ = flux.sys.Events;
flux.Sys = $hxClasses['flux.Sys'] = function() { };
flux.Sys.__name__ = ["flux","Sys"];
flux.Sys.events = function() {
	return flux.Sys._events;
};
flux.Sys.argv = function() {
	return flux.Sys._proc.argv;
};
flux.Sys.stdout = function() {
	return new flux.sys.WriteStreamImpl(flux.Sys._proc.stdout);
};
flux.Sys.stdin = function() {
	return new flux.sys.ReadStreamImpl(flux.Sys._proc.stdin);
};
flux.Sys.stderr = function() {
	return new flux.sys.WriteStreamImpl(flux.Sys._proc.stderr);
};
flux.Sys.createWriteStream = function(path,opt) {
	return flux.sys.WriteStreamImpl.createWriteStream(path,opt);
};
flux.Sys.env = function() {
	return flux.Sys._proc.env;
};
flux.Sys.pid = function() {
	return flux.Sys._proc.pid;
};
flux.Sys.title = function() {
	return flux.Sys._proc.title;
};
flux.Sys.arch = function() {
	return flux.Sys._proc.arch;
};
flux.Sys.platform = function() {
	return flux.Sys._proc.platform;
};
flux.Sys.installPrefix = function() {
	return flux.Sys._proc.installPrefix;
};
flux.Sys.execPath = function() {
	return flux.Sys._proc.execPath;
};
flux.Sys.version = function() {
	return flux.Sys._proc.version;
};
flux.Sys.versions = function() {
	return flux.Sys._proc.versions;
};
flux.Sys.memoryUsage = function() {
	return flux.Sys._proc.memoryUsage();
};
flux.Sys.nextTick = function(fn) {
	flux.Sys._proc.nextTick(fn);
};
flux.Sys.exit = function(code) {
	flux.Sys._proc.exit(code);
};
flux.Sys.cwd = function() {
	return flux.Sys._proc.cwd();
};
flux.Sys.getuid = function() {
	return flux.Sys._proc.getuid();
};
flux.Sys.getgid = function() {
	return flux.Sys._proc.getgid();
};
flux.Sys.setuid = function(u) {
	flux.Sys._proc.setuid(u);
};
flux.Sys.setgid = function(g) {
	flux.Sys._proc.setgid(g);
};
flux.Sys.umask = function(m) {
	return flux.Sys._proc.umask(m);
};
flux.Sys.chdir = function(d) {
	flux.Sys._proc.chdir(d);
};
flux.Sys.kill = function(pid,signal) {
	flux.Sys._proc.kill(pid,signal);
};
flux.Sys.uptime = function() {
	return flux.Sys._proc.uptime();
};
flux.Sys.hostname = function() {
	return flux.Sys._os.hostname();
};
flux.Sys.type = function() {
	return flux.Sys._os.type();
};
flux.Sys.release = function() {
	return flux.Sys._os.release();
};
flux.Sys.osUptime = function() {
	return flux.Sys._os.uptime();
};
flux.Sys.loadavg = function() {
	return flux.Sys._os.loadavg();
};
flux.Sys.totalmem = function() {
	return flux.Sys._os.totalmem();
};
flux.Sys.freemem = function() {
	return flux.Sys._os.freemem();
};
flux.Sys.cpus = function() {
	return flux.Sys._os.cpus();
};
flux.Sys.networkInterfaces = function() {
	return flux.Sys._os.networkInterfaces();
};
flux.Sys.spawn = function(command,args,options) {
	if(args == null) args = [];
	return flux.sys.ChildProcessImpl.spawn(command,args,options);
};
flux.Sys.exec = function(command,options,cb) {
	return flux.sys.ChildProcessImpl.exec(command,options,cb);
};
flux.Sys.execFile = function(command,options,cb) {
	return flux.sys.ChildProcessImpl.execFile(command,options,cb);
};
flux.Sys.getEnc = function(enc) {
	if(enc == null) return "utf8";
	return (function($this) {
		var $r;
		switch( (enc)[1] ) {
		case 0:
			$r = "ascii";
			break;
		case 1:
			$r = "utf8";
			break;
		case 2:
			$r = "binary";
			break;
		case 3:
			$r = "base64";
			break;
		}
		return $r;
	}(this));
};
flux.Sys.exists = function(path) {
	var oc = new flux.core.FutureImpl();
	js.Node.path.exists(path,function(exists) {
		oc.resolve(exists?flux.Either.Right(path):flux.Either.Left(path));
	});
	return oc;
};
flux.Sys.rename = function(from,to) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.rename(from,to,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(to));
	});
	return prm;
};
flux.Sys.stat = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.stat(path,function(err,stat) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right({ path : path, stat : stat}));
	});
	return prm;
};
flux.Sys.lstat = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.lstat(path,function(err,stat) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(stat));
	});
	return prm;
};
flux.Sys.fstat = function(fd) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.fstat(fd,function(err,stat) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(stat));
	});
	return prm;
};
flux.Sys.link = function(srcPath,dstPath) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.link(srcPath,dstPath,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(dstPath));
	});
	return prm;
};
flux.Sys.unlink = function(srcPath) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.unlink(srcPath,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(srcPath));
	});
	return prm;
};
flux.Sys.symlink = function(linkData,path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.symlink(linkData,path,null,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(true));
	});
	return prm;
};
flux.Sys.readlink = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.readlink(path,function(err,s) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(s));
	});
	return prm;
};
flux.Sys.realpath = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.realpath(path,function(err,s) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(s));
	});
	return prm;
};
flux.Sys.chmod = function(path,mode) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.chmod(path,mode,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(path));
	});
	return prm;
};
flux.Sys.fchmod = function(fd,mode) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.fchmod(fd,mode,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fd));
	});
	return prm;
};
flux.Sys.chown = function(path,uid,gid) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.chown(path,uid,gid,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(path));
	});
	return prm;
};
flux.Sys.rmdir = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.rmdir(path,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(path));
	});
	return prm;
};
flux.Sys.mkdir = function(path,mode) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.mkdir(path,mode,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(path));
	});
	return prm;
};
flux.Sys.readdir = function(path) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.readdir(path,function(err,fileNames) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fileNames));
	});
	return prm;
};
flux.Sys.close = function(fd) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.close(fd,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fd));
	});
	return prm;
};
flux.Sys.open = function(path,flags,mode) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.open(path,flags,mode,function(err,i) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(i));
	});
	return prm;
};
flux.Sys.write = function(fd,bufOrStr,offset,length,position) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.write(fd,bufOrStr,offset,length,position,function(err,i) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(i));
	});
	return prm;
};
flux.Sys.read = function(fd,buffer,offset,length,position) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.read(fd,buffer,offset,length,position,function(err,i,nb) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(i));
	});
	return prm;
};
flux.Sys.truncate = function(fd,len) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.truncate(fd,len,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(len));
	});
	return prm;
};
flux.Sys.readFile = function(path,enc) {
	var oc = new flux.core.FutureImpl();
	js.Node.fs.readFile(path,flux.Sys.getEnc(enc),function(err,s) {
		oc.resolve(err != null?flux.Either.Left(err):flux.Either.Right(new String(s)));
	});
	return oc;
};
flux.Sys.writeFile = function(fileName,contents,enc) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.writeFile(fileName,contents,flux.Sys.getEnc(enc),function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fileName));
	});
	return prm;
};
flux.Sys.utimes = function(path,atime,mtime) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.utimes(path,atime,mtime,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(path));
	});
	return prm;
};
flux.Sys.futimes = function(fd,atime,mtime) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.futimes(fd,atime,mtime,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fd));
	});
	return prm;
};
flux.Sys.fsync = function(fd) {
	var prm = new flux.core.FutureImpl();
	js.Node.fs.fsync(fd,function(err) {
		prm.resolve(err != null?flux.Either.Left(err):flux.Either.Right(fd));
	});
	return prm;
};
flux.Sys.watchFile = function(fileName,options,listener) {
	js.Node.fs.watchFile(fileName,options,listener);
};
flux.Sys.unwatchFile = function(fileName) {
	js.Node.fs.unwatchFile(fileName);
};
flux.Sys.watch = function(fileName,options,listener) {
	var prm = new flux.core.FutureImpl();
	try {
		var w = js.Node.fs.watch(fileName,options,listener);
		prm.resolve(w == null?flux.Either.Left("can't create readStream"):flux.Either.Right(w));
	} catch( ex ) {
		prm.resolve(flux.Either.Left(ex));
	}
	return prm;
};
flux.Sys.nodeReadStream = function(path,options) {
	var prm = new flux.core.FutureImpl();
	try {
		var rs = js.Node.fs.createReadStream(path,options);
		prm.resolve(rs == null?flux.Either.Left("can't create readStream"):flux.Either.Right(rs));
	} catch( ex ) {
		prm.resolve(flux.Either.Left(ex));
	}
	return prm;
};
flux.Sys.nodeWriteStream = function(path,options) {
	var prm = new flux.core.FutureImpl();
	try {
		var ws = js.Node.fs.createWriteStream(path,options);
		prm.resolve(ws == null?flux.Either.Left("can't create writeStream"):flux.Either.Right(ws));
	} catch( ex ) {
		prm.resolve(flux.Either.Left(ex));
	}
	return prm;
};
flux.Sys.prototype.__class__ = flux.Sys;
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
flux.core.FutureImpl.prototype.toArray = function() {
	return flux.OptionX.toArray(this.value());
};
flux.core.FutureImpl.prototype.toOption = function() {
	return this.value();
};
flux.core.FutureImpl.prototype.value = function() {
	return this._isSet?flux.Option.Some(this._result):flux.Option.None;
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
flux.core.FutureImpl.prototype.then = function(f) {
	return f;
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
flux.core.FutureImpl.prototype.deliver = function(f) {
	if(this.isCanceled()) return this; else if(this.isDelivered()) f(this._result); else this._listeners.push(f);
	return this;
};
flux.core.FutureImpl.prototype.isCanceled = function() {
	return this._isCanceled;
};
flux.core.FutureImpl.prototype.isDelivered = function() {
	return this._isSet;
};
flux.core.FutureImpl.prototype.isDone = function() {
	return this.isDelivered() || this.isCanceled();
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
flux.core.FutureImpl.prototype.ifCanceled = function(f) {
	if(this.isCanceled()) f(); else if(!this.isDone()) this._canceled.push(f);
	return this;
};
flux.core.FutureImpl.prototype.allowCancelOnlyIf = function(f) {
	if(!this.isDone()) this._cancelers.push(f);
	return this;
};
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
flux.core.FutureImpl.prototype._combined = null;
flux.core.FutureImpl.prototype._canceled = null;
flux.core.FutureImpl.prototype._cancelers = null;
flux.core.FutureImpl.prototype._isCanceled = null;
flux.core.FutureImpl.prototype._isSet = null;
flux.core.FutureImpl.prototype._result = null;
flux.core.FutureImpl.prototype._listeners = null;
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
	if(fileName != null) flux.core.LogImpl.logFileFD = js.Node.fs.openSync(fileName,"a+",438); else flux.core.LogImpl.logFileFD = -1;
};
flux.core.LogImpl.write = function(msg,type) {
	if(msg != null) {
		if(flux.core.LogImpl.logFileFD != -1) {
			var b = new Buffer(msg + "\n","utf8");
			js.Node.fs.write(flux.core.LogImpl.logFileFD,b,0,b.length,null);
		} else {
			console.log(msg);
		}
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
if(!flux.http) flux.http = {};
flux.http.HttpImpl = $hxClasses['flux.http.HttpImpl'] = function() {
	this._root = null;
	this._index = "/index.html";
	flux.core.ObservableImpl.call(this);
	this._routes = [];
	this._index = "/index.html";
	this._root = null;
	this._serverName = "Flux " + flux.Core.VER;
	this._getHandler = $bind(this,this.defaultGetHandler);
	this._cache = new Hash();
};
flux.http.HttpImpl.__name__ = ["flux","http","HttpImpl"];
flux.http.HttpImpl.__super__ = flux.core.ObservableImpl;
for(var k in flux.core.ObservableImpl.prototype ) flux.http.HttpImpl.prototype[k] = flux.core.ObservableImpl.prototype[k];
flux.http.HttpImpl._formidable = null;
flux.http.HttpImpl.parseFields = function(req,cb,uploadDir) {
	var form = new flux.http.HttpImpl._formidable.IncomingForm(), fields = new Hash(), files = null;
	if(uploadDir != null) form.uploadDir = uploadDir;
	form.on("field",function(field,value) {
		fields.set(Std.string(field),Std.string(value));
	}).on("file",function(field,file) {
		if(files == null) files = [];
		files.push({ field : field, file : file});
	}).on("end",function() {
		cb(fields,files);
	});
	form.parse(req);
};
flux.http.HttpImpl.UTCString = function(d) {
	return d.toUTCString();
};
flux.http.HttpImpl.parse = function(d) {
	return Date.parse(d);
};
flux.http.HttpImpl.prototype.pipeFile = function(resp,path,stat,mtime) {
	var buf = new Buffer(stat.size), offset = 0;
	this._cache.set(path,{ mtime : mtime, buf : buf});
	js.Node.fs.createReadStream(path,flux.http.HttpImpl.readStreamOpt).on("error",function(err) {
		js.Node.console.error(err);
	}).on("data",function(chunk) {
		chunk.copy(buf,offset);
		offset += chunk.length;
	}).on("close",function() {
	}).pipe(resp);
};
flux.http.HttpImpl.prototype.serveFromCache = function(resp,path,stat,mtime) {
	var cached = this._cache.get(path);
	if(cached == null) this.pipeFile(resp,path,stat,mtime); else if(cached.mtime < mtime) this.pipeFile(resp,path,stat,mtime); else resp.end(cached.buf.toString("binary"));
};
flux.http.HttpImpl.prototype.headers = function(resp,size,path,etag,mtime) {
	resp.setHeader("Content-Length",size);
	resp.setHeader("Content-Type",Reflect.field(flux.http.Mime.types,HxOverrides.substr(js.Node.path.extname(path),1,null)));
	var d = new Date(Date.now());
	resp.setHeader("Date",d.toUTCString());
	if(etag != null) resp.setHeader("ETag",etag);
	resp.setHeader("Last-Modified",mtime.toUTCString());
	resp.setHeader("Server",this._serverName);
};
flux.http.HttpImpl.prototype.do404 = function(req,resp) {
	if(this._notFound != null) this._notFound(req,resp);
};
flux.http.HttpImpl.prototype.serveNoCache = function(path,req,resp,statusCode) {
	if(statusCode == null) statusCode = 200;
	var _g = this;
	var fileToServe = this._root != null?this._root + path:path;
	js.Node.fs.stat(fileToServe,function(e,stat) {
		if(e != null) {
			_g.do404(req,resp);
			return;
		}
		var mtime = stat.mtime, size = stat.size;
		if(stat.isFile()) {
			resp.statusCode = statusCode;
			_g.headers(resp,size,path,null,mtime);
			resp.setHeader("cache-control","no-cache");
			js.Node.fs.createReadStream(path,flux.http.HttpImpl.readStreamOpt).pipe(resp);
		} else if(stat.isDirectory()) _g.do404(req,resp); else _g.do404(req,resp);
	});
};
flux.http.HttpImpl.prototype.serve = function(path,req,resp,statusCode) {
	if(statusCode == null) statusCode = 200;
	var _g = this;
	var fileToServe = this._root != null?this._root + path:path;
	console.log("serving: " + path);
	js.Node.fs.stat(fileToServe,function(e,stat) {
		if(e != null) {
			_g.do404(req,resp);
			return;
		}
		if(stat.isFile()) {
			console.log("stat.mtime = " + stat.mtime.toDateString());
			var mtimeObj = stat.mtime, fmtime = mtimeObj.toDateString(), size = stat.size, eTag = js.Node.stringify([stat.ino,size,fmtime].join("-"));
			if(Reflect.field(req.headers,"if-none-match") == eTag) {
				resp.statusCode = 304;
				_g.headers(resp,size,path,eTag,mtimeObj);
				resp.end();
				return;
			}
			resp.statusCode = statusCode;
			_g.headers(resp,size,path,eTag,mtimeObj);
			_g.serveFromCache(resp,fileToServe,stat,mtimeObj.getTime());
		} else if(stat.isDirectory()) _g.do404(req,resp); else _g.do404(req,resp);
	});
};
flux.http.HttpImpl.prototype.fields = function(req,cb,uploadDir) {
	if(uploadDir == null) uploadDir = "/tmp";
	flux.http.HttpImpl.parseFields(req,cb,uploadDir);
};
flux.http.HttpImpl.prototype.defaultGetHandler = function(path,req,resp,statusCode) {
	this.do404(req,resp);
};
flux.http.HttpImpl.prototype.credentials = function(key,cert,ca) {
	var k = js.Node.fs.readFileSync(key);
	var c = js.Node.fs.readFileSync(cert);
	this._creds = { key : k, cert : c, ca : ca};
	return this;
};
flux.http.HttpImpl.prototype.root = function(rootDir) {
	this._root = !flux.StringX.endsWith(rootDir,"/")?rootDir:HxOverrides.substr(rootDir,0,-1);
	this._getHandler = $bind(this,this.serve);
	return this;
};
flux.http.HttpImpl.prototype.serverName = function(serverName) {
	this._serverName = serverName;
	return this;
};
flux.http.HttpImpl.prototype.index = function(indexFile) {
	this._index = indexFile;
	return this;
};
flux.http.HttpImpl.prototype.notFound = function(nf) {
	this._notFound = nf;
	return this;
};
flux.http.HttpImpl.prototype.handler = function(r,handler) {
	this._routes.push({ re : r, handler : handler});
	return this;
};
flux.http.HttpImpl.prototype.requestHandler = function(req,resp) {
	var url = req.url, match = false;
	if(this._routes != null) {
		var _g = 0, _g1 = this._routes;
		while(_g < _g1.length) {
			var r = _g1[_g];
			++_g;
			if(r.re.match(url)) {
				match = true;
				try {
					r.handler(r.re,req,resp);
				} catch( ex ) {
					flux.core.LogImpl.error("handler exp:" + Std.string(ex),"",{ fileName : "HttpImpl.hx", lineNumber : 108, className : "flux.http.HttpImpl", methodName : "requestHandler"});
				}
				break;
			}
		}
	}
	if(!match && this._root != null) {
		if(req.method == "GET") {
			if(url == "/") url = this._index;
			this._getHandler(url,req,resp,200);
		}
	}
};
flux.http.HttpImpl.prototype.start_ = function(d,oc) {
	var _g = this;
	var server = this._creds != null?js.Node.https.createServer(this._creds,$bind(this,this.requestHandler)):js.Node.http.createServer($bind(this,this.requestHandler));
	server.listen(d.port,d.host,function() {
		if(_g._creds != null) flux.core.LogImpl.info("Listening on Https " + _g._serverName + " on " + d.host + ":" + d.port,"",{ fileName : "HttpImpl.hx", lineNumber : 85, className : "flux.http.HttpImpl", methodName : "start_"}); else flux.core.LogImpl.info("Listening on Http " + _g._serverName + " on " + d.host + ":" + d.port,"",{ fileName : "HttpImpl.hx", lineNumber : 87, className : "flux.http.HttpImpl", methodName : "start_"});
		oc.resolve(flux.Either.Right(js.Boot.__cast(_g , flux.HttpServer)));
	});
	return oc;
};
flux.http.HttpImpl.prototype._serverName = null;
flux.http.HttpImpl.prototype._root = null;
flux.http.HttpImpl.prototype._index = null;
flux.http.HttpImpl.prototype._creds = null;
flux.http.HttpImpl.prototype._notFound = null;
flux.http.HttpImpl.prototype._routes = null;
flux.http.HttpImpl.prototype._getHandler = null;
flux.http.HttpImpl.prototype._cache = null;
flux.http.HttpImpl.prototype.__class__ = flux.http.HttpImpl;
flux.http.HttpImpl.__interfaces__ = [flux.HttpServer];
flux.http.Mime = $hxClasses['flux.http.Mime'] = function() { };
flux.http.Mime.__name__ = ["flux","http","Mime"];
flux.http.Mime.prototype.__class__ = flux.http.Mime;
flux.sys.ChildProcessImpl = $hxClasses['flux.sys.ChildProcessImpl'] = function(cp) {
	var _g = this;
	flux.core.ObservableImpl.call(this);
	this._childProc = cp;
	this._stdin = new flux.sys.WriteStreamImpl(cp.stdin);
	this._stdout = new flux.sys.ReadStreamImpl(cp.stdout);
	this._stderr = new flux.sys.ReadStreamImpl(cp.stderr);
	this._childProc.addListener("exit",function(code,sig) {
		_g.notify(flux.SysChildProcessEvents.Exit(code,sig));
	});
};
flux.sys.ChildProcessImpl.__name__ = ["flux","sys","ChildProcessImpl"];
flux.sys.ChildProcessImpl.__super__ = flux.core.ObservableImpl;
for(var k in flux.core.ObservableImpl.prototype ) flux.sys.ChildProcessImpl.prototype[k] = flux.core.ObservableImpl.prototype[k];
flux.sys.ChildProcessImpl.spawn = function(command,args,options) {
	var oc = new flux.core.FutureImpl();
	var forTyper = new flux.sys.ChildProcessImpl(js.Node.childProcess.spawn(command,args,options));
	oc.resolve(flux.Either.Right(forTyper));
	return oc;
};
flux.sys.ChildProcessImpl.exec = function(command,options,cb) {
	var oc = new flux.core.FutureImpl(), child = js.Node.childProcess.exec(command,options,function(err,so,se) {
		if(err != null) oc.resolve(flux.Either.Left({ code : err.code, stderr : new String(se)})); else oc.resolve(flux.Either.Right(new String(so)));
	});
	if(cb != null) cb(new flux.sys.ChildProcessImpl(child));
	return oc;
};
flux.sys.ChildProcessImpl.execFile = function(command,options,cb) {
	var oc = new flux.core.FutureImpl(), child = js.Node.childProcess.execFile(command,options,function(err,so,se) {
		if(err != null) oc.resolve(flux.Either.Left({ code : err.code, stderr : new String(se)})); else oc.resolve(flux.Either.Right(new String(so)));
	});
	if(cb != null) cb(new flux.sys.ChildProcessImpl(child));
	return oc;
};
flux.sys.ChildProcessImpl.prototype.kill = function(signal) {
};
flux.sys.ChildProcessImpl.prototype.getPid = function() {
	return this._childProc.pid;
};
flux.sys.ChildProcessImpl.prototype.getStdErr = function() {
	return this._stderr;
};
flux.sys.ChildProcessImpl.prototype.getStdOut = function() {
	return this._stdout;
};
flux.sys.ChildProcessImpl.prototype.getStdIn = function() {
	return this._stdin;
};
flux.sys.ChildProcessImpl.prototype._stderr = null;
flux.sys.ChildProcessImpl.prototype._stdout = null;
flux.sys.ChildProcessImpl.prototype._stdin = null;
flux.sys.ChildProcessImpl.prototype._childProc = null;
flux.sys.ChildProcessImpl.prototype.pid = null;
flux.sys.ChildProcessImpl.prototype.stderr = null;
flux.sys.ChildProcessImpl.prototype.stdout = null;
flux.sys.ChildProcessImpl.prototype.stdin = null;
flux.sys.ChildProcessImpl.prototype.__class__ = flux.sys.ChildProcessImpl;
flux.sys.ChildProcessImpl.__interfaces__ = [flux.SysChildProcess];
flux.sys.ReadStreamImpl = $hxClasses['flux.sys.ReadStreamImpl'] = function(rs) {
	var _g = this;
	flux.core.ObservableImpl.call(this);
	this._readStream = rs;
	this._readStream.addListener("data",function(d) {
		_g.notify(flux.SysReadStreamEvents.Data(new String(d)));
	});
	this._readStream.addListener("end",function() {
		_g.notify(flux.SysReadStreamEvents.End);
	});
	this._readStream.addListener("error",function(exception) {
		_g.notify(flux.SysReadStreamEvents.Error(new String(exception)));
	});
	this._readStream.addListener("close",function() {
		_g.notify(flux.SysReadStreamEvents.Close);
	});
};
flux.sys.ReadStreamImpl.__name__ = ["flux","sys","ReadStreamImpl"];
flux.sys.ReadStreamImpl.__super__ = flux.core.ObservableImpl;
for(var k in flux.core.ObservableImpl.prototype ) flux.sys.ReadStreamImpl.prototype[k] = flux.core.ObservableImpl.prototype[k];
flux.sys.ReadStreamImpl.prototype.getNodeReadStream = function() {
	return this._readStream;
};
flux.sys.ReadStreamImpl.prototype.pipe = function(dest,opts) {
	this._readStream.pipe(dest.getNodeWriteStream(),opts);
};
flux.sys.ReadStreamImpl.prototype.setEncoding = function(enc) {
	this._readStream.setEncoding(enc);
};
flux.sys.ReadStreamImpl.prototype.destroySoon = function() {
	this._readStream.destroySoon();
};
flux.sys.ReadStreamImpl.prototype.destroy = function() {
	this._readStream.destroy();
};
flux.sys.ReadStreamImpl.prototype.resume = function() {
	this._readStream.resume();
};
flux.sys.ReadStreamImpl.prototype.pause = function() {
	this._readStream.pause();
};
flux.sys.ReadStreamImpl.prototype.getReadable = function() {
	return this._readStream.readable;
};
flux.sys.ReadStreamImpl.prototype.readable = null;
flux.sys.ReadStreamImpl.prototype._readStream = null;
flux.sys.ReadStreamImpl.prototype.__class__ = flux.sys.ReadStreamImpl;
flux.sys.ReadStreamImpl.__interfaces__ = [flux.SysReadStream];
flux.sys.WriteStreamImpl = $hxClasses['flux.sys.WriteStreamImpl'] = function(s) {
	var _g = this;
	flux.core.ObservableImpl.call(this);
	this._writeStream = s;
	this._writeStream.addListener("drain",function() {
		_g.notify(flux.SysWriteStreamEvents.Drain);
	});
	this._writeStream.addListener("error",function(ex) {
		_g.notify(flux.SysWriteStreamEvents.Error(new String(ex)));
	});
	this._writeStream.addListener("close",function() {
		_g.notify(flux.SysWriteStreamEvents.Close);
	});
	this._writeStream.addListener("pipe",function(src) {
		_g.notify(flux.SysWriteStreamEvents.Pipe(new flux.sys.ReadStreamImpl(src)));
	});
};
flux.sys.WriteStreamImpl.__name__ = ["flux","sys","WriteStreamImpl"];
flux.sys.WriteStreamImpl.__super__ = flux.core.ObservableImpl;
for(var k in flux.core.ObservableImpl.prototype ) flux.sys.WriteStreamImpl.prototype[k] = flux.core.ObservableImpl.prototype[k];
flux.sys.WriteStreamImpl.createWriteStream = function(path,options) {
	return new flux.sys.WriteStreamImpl(js.Node.fs.createWriteStream(path,options));
};
flux.sys.WriteStreamImpl.prototype.getNodeWriteStream = function() {
	return this._writeStream;
};
flux.sys.WriteStreamImpl.prototype.end = function(s,enc) {
	this._writeStream.end(s,enc);
};
flux.sys.WriteStreamImpl.prototype.write = function(d,enc,fd) {
	return this._writeStream.write(d,enc,fd);
};
flux.sys.WriteStreamImpl.prototype.getWriteable = function() {
	return this._writeStream.writeable;
};
flux.sys.WriteStreamImpl.prototype.writeable = null;
flux.sys.WriteStreamImpl.prototype._writeStream = null;
flux.sys.WriteStreamImpl.prototype.__class__ = flux.sys.WriteStreamImpl;
flux.sys.WriteStreamImpl.__interfaces__ = [flux.SysWriteStream];
if(typeof haxe=='undefined') haxe = {};
haxe.Json = $hxClasses['haxe.Json'] = function() {
};
haxe.Json.__name__ = ["haxe","Json"];
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
};
haxe.Json.stringify = function(value) {
	return new haxe.Json().toString(value);
};
haxe.Json.prototype.parseString = function() {
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
haxe.Json.prototype.nextChar = function() {
	return this.str.charCodeAt(this.pos++);
};
haxe.Json.prototype.invalidChar = function() {
	this.pos--;
	throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
};
haxe.Json.prototype.doParse = function(str) {
	this.reg_float = new EReg("^-?(0|[1-9][0-9]*)(\\.[0-9]+)?([eE][+-]?[0-9]+)?","");
	this.str = str;
	this.pos = 0;
	return this.parseRec();
};
haxe.Json.prototype.quote = function(s) {
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
};
haxe.Json.prototype.toStringRec = function(v) {
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
};
haxe.Json.prototype.objString = function(v) {
	this.fieldsString(v,Reflect.fields(v));
};
haxe.Json.prototype.fieldsString = function(v,fields) {
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
};
haxe.Json.prototype.toString = function(v) {
	this.buf = new StringBuf();
	this.toStringRec(v);
	return this.buf.b;
};
haxe.Json.prototype.reg_float = null;
haxe.Json.prototype.pos = null;
haxe.Json.prototype.str = null;
haxe.Json.prototype.buf = null;
haxe.Json.prototype.__class__ = haxe.Json;
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
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
};
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
};
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
};
haxe.Stack.prototype.__class__ = haxe.Stack;
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
haxe.io.Bytes.prototype.getData = function() {
	return this.b;
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
		s.b += String.fromCharCode(chars[c >> 4]);
		s.b += String.fromCharCode(chars[c & 15]);
	}
	return s.b;
};
haxe.io.Bytes.prototype.toString = function() {
	return this.readString(0,this.length);
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
haxe.io.Bytes.prototype.sub = function(pos,len) {
	if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
	return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
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
haxe.io.Bytes.prototype.set = function(pos,v) {
	this.b[pos] = v & 255;
};
haxe.io.Bytes.prototype.get = function(pos) {
	return this.b[pos];
};
haxe.io.Bytes.prototype.b = null;
haxe.io.Bytes.prototype.length = null;
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
js.Boot = $hxClasses['js.Boot'] = function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
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
js.NodeC = $hxClasses['js.NodeC'] = function() { };
js.NodeC.__name__ = ["js","NodeC"];
js.NodeC.prototype.__class__ = js.NodeC;
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
{
	js.Node.__filename = __filename;
	js.Node.__dirname = __dirname;
	js.Node.setTimeout = setTimeout;
	js.Node.clearTimeout = clearTimeout;
	js.Node.setInterval = setInterval;
	js.Node.clearInterval = clearInterval;
	js.Node.global = global;
	js.Node.process = process;
	js.Node.require = require;
	js.Node.console = console;
	js.Node.module = module;
	js.Node.stringify = JSON.stringify;
	js.Node.parse = JSON.parse;
	js.Node.util = js.Node.require("util");
	js.Node.fs = js.Node.require("fs");
	js.Node.net = js.Node.require("net");
	js.Node.http = js.Node.require("http");
	js.Node.https = js.Node.require("https");
	js.Node.path = js.Node.require("path");
	js.Node.url = js.Node.require("url");
	js.Node.os = js.Node.require("os");
	js.Node.crypto = js.Node.require("crypto");
	js.Node.dns = js.Node.require("dns");
	js.Node.queryString = js.Node.require("querystring");
	js.Node.assert = js.Node.require("assert");
	js.Node.childProcess = js.Node.require("child_process");
	js.Node.vm = js.Node.require("vm");
	js.Node.tls = js.Node.require("tls");
	js.Node.dgram = js.Node.require("dgram");
	js.Node.assert = js.Node.require("assert");
	js.Node.repl = js.Node.require("repl");
	js.Node.cluster = js.Node.require("cluster");
};
flux.http.HttpImpl._formidable = js.Node.require("formidable");
if(typeof(JSON) != "undefined") haxe.Json = JSON;
flux.Core.VER = "0.5";
;
flux.Core.CSROOT = "/__cs/";
;
flux.core.ObservableImpl.CLEANUP = 1;
;
flux.Sys._events = new flux.sys.Events();
;
flux.Sys._proc = js.Node.process;
;
flux.Sys._os = js.Node.os;
;
flux.Sys._child = js.Node.childProcess;
;
flux.core.LogImpl.logFileFD = -1;
;
flux.http.HttpImpl.readStreamOpt = { flags : "r", mode : 666};
;
flux.http.Mime.types = { aiff : "audio/x-aiff", arj : "application/x-arj-compressed", asf : "video/x-ms-asf", asx : "video/x-ms-asx", au : "audio/ulaw", avi : "video/x-msvideo", bcpio : "application/x-bcpio", ccad : "application/clariscad", cod : "application/vnd.rim.cod", com : "application/x-msdos-program", cpio : "application/x-cpio", cpt : "application/mac-compactpro", csh : "application/x-csh", css : "text/css", deb : "application/x-debian-package", dl : "video/dl", doc : "application/msword", drw : "application/drafting", dvi : "application/x-dvi", dwg : "application/acad", dxf : "application/dxf", dxr : "application/x-director", etx : "text/x-setext", ez : "application/andrew-inset", fli : "video/x-fli", flv : "video/x-flv", gif : "image/gif", gl : "video/gl", gtar : "application/x-gtar", gz : "application/x-gzip", hdf : "application/x-hdf", hqx : "application/mac-binhex40", html : "text/html", ice : "x-conference/x-cooltalk", ico : "image/x-icon", ief : "image/ief", igs : "model/iges", ips : "application/x-ipscript", ipx : "application/x-ipix", jad : "text/vnd.sun.j2me.app-descriptor", jar : "application/java-archive", jpeg : "image/jpeg", jpg : "image/jpeg", js : "text/javascript", json : "application/json", latex : "application/x-latex", less : "text/css", lsp : "application/x-lisp", lzh : "application/octet-stream", m : "text/plain", m3u : "audio/x-mpegurl", man : "application/x-troff-man", manifest : "text/cache-manifest", me : "application/x-troff-me", midi : "audio/midi", mif : "application/x-mif", mime : "www/mime", movie : "video/x-sgi-movie", mp4 : "video/mp4", mpg : "video/mpeg", mpga : "audio/mpeg", ms : "application/x-troff-ms", nc : "application/x-netcdf", oda : "application/oda", ogm : "application/ogg", pbm : "image/x-portable-bitmap", pdf : "application/pdf", pgm : "image/x-portable-graymap", pgn : "application/x-chess-pgn", pgp : "application/pgp", pm : "application/x-perl", png : "image/png", pnm : "image/x-portable-anymap", ppm : "image/x-portable-pixmap", ppz : "application/vnd.ms-powerpoint", pre : "application/x-freelance", prt : "application/pro_eng", ps : "application/postscript", qt : "video/quicktime", ra : "audio/x-realaudio", rar : "application/x-rar-compressed", ras : "image/x-cmu-raster", rgb : "image/x-rgb", rm : "audio/x-pn-realaudio", rpm : "audio/x-pn-realaudio-plugin", rtf : "text/rtf", rtx : "text/richtext", scm : "application/x-lotusscreencam", set : "application/set", sgml : "text/sgml", sh : "application/x-sh", shar : "application/x-shar", silo : "model/mesh", sit : "application/x-stuffit", skt : "application/x-koan", smil : "application/smil", snd : "audio/basic", sol : "application/solids", spl : "application/x-futuresplash", src : "application/x-wais-source", stl : "application/SLA", stp : "application/STEP", sv4cpio : "application/x-sv4cpio", sv4crc : "application/x-sv4crc", svg : "image/svg+xml", swf : "application/x-shockwave-flash", tar : "application/x-tar", tcl : "application/x-tcl", tex : "application/x-tex", texinfo : "application/x-texinfo", tgz : "application/x-tar-gz", tiff : "image/tiff", tr : "application/x-troff", tsi : "audio/TSP-audio", tsp : "application/dsptype", tsv : "text/tab-separated-values", txt : "text/plain", unv : "application/i-deas", ustar : "application/x-ustar", vcd : "application/x-cdlink", vda : "application/vda", vivo : "video/vnd.vivo", vrm : "x-world/x-vrml", wav : "audio/x-wav", wax : "audio/x-ms-wax", wma : "audio/x-ms-wma", wmv : "video/x-ms-wmv", wmx : "video/x-ms-wmx", wrl : "model/vrml", wvx : "video/x-ms-wvx", xbm : "image/x-xbitmap", xlw : "application/vnd.ms-excel", xml : "text/xml", xpm : "image/x-xpixmap", xwd : "image/x-xwindowdump", xyz : "chemical/x-pdb", zip : "application/zip"};
;
js.NodeC.UTF8 = "utf8";
;
js.NodeC.ASCII = "ascii";
;
js.NodeC.BINARY = "binary";
;
js.NodeC.BASE64 = "base64";
;
js.NodeC.HEX = "hex";
;
js.NodeC.EVENT_EVENTEMITTER_NEWLISTENER = "newListener";
;
js.NodeC.EVENT_EVENTEMITTER_ERROR = "error";
;
js.NodeC.EVENT_STREAM_DATA = "data";
;
js.NodeC.EVENT_STREAM_END = "end";
;
js.NodeC.EVENT_STREAM_ERROR = "error";
;
js.NodeC.EVENT_STREAM_CLOSE = "close";
;
js.NodeC.EVENT_STREAM_DRAIN = "drain";
;
js.NodeC.EVENT_STREAM_CONNECT = "connect";
;
js.NodeC.EVENT_STREAM_SECURE = "secure";
;
js.NodeC.EVENT_STREAM_TIMEOUT = "timeout";
;
js.NodeC.EVENT_STREAM_PIPE = "pipe";
;
js.NodeC.EVENT_PROCESS_EXIT = "exit";
;
js.NodeC.EVENT_PROCESS_UNCAUGHTEXCEPTION = "uncaughtException";
;
js.NodeC.EVENT_PROCESS_SIGINT = "SIGINT";
;
js.NodeC.EVENT_PROCESS_SIGUSR1 = "SIGUSR1";
;
js.NodeC.EVENT_CHILDPROCESS_EXIT = "exit";
;
js.NodeC.EVENT_HTTPSERVER_REQUEST = "request";
;
js.NodeC.EVENT_HTTPSERVER_CONNECTION = "connection";
;
js.NodeC.EVENT_HTTPSERVER_CLOSE = "close";
;
js.NodeC.EVENT_HTTPSERVER_UPGRADE = "upgrade";
;
js.NodeC.EVENT_HTTPSERVER_CLIENTERROR = "clientError";
;
js.NodeC.EVENT_HTTPSERVERREQUEST_DATA = "data";
;
js.NodeC.EVENT_HTTPSERVERREQUEST_END = "end";
;
js.NodeC.EVENT_CLIENTREQUEST_RESPONSE = "response";
;
js.NodeC.EVENT_CLIENTRESPONSE_DATA = "data";
;
js.NodeC.EVENT_CLIENTRESPONSE_END = "end";
;
js.NodeC.EVENT_NETSERVER_CONNECTION = "connection";
;
js.NodeC.EVENT_NETSERVER_CLOSE = "close";
;
js.NodeC.FILE_READ = "r";
;
js.NodeC.FILE_READ_APPEND = "r+";
;
js.NodeC.FILE_WRITE = "w";
;
js.NodeC.FILE_WRITE_APPEND = "a+";
;
js.NodeC.FILE_READWRITE = "a";
;
js.NodeC.FILE_READWRITE_APPEND = "a+";
;
HttpTest.main();
