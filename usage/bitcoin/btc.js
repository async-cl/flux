var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
        function inherit() {}; inherit.prototype = from; var proto = new inherit();
        for (var name in fields) proto[name] = fields[name];
        return proto;
}
;
if(typeof haxe=='undefined') haxe = {};
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] };
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.Stack = $hxClasses["haxe.Stack"] =  function() { };
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	return haxe.Stack.makeStack("$s");
};
haxe.Stack.exceptionStack = function() {
	return haxe.Stack.makeStack("$e");
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
	var a = (function($this) {
		var $r;
		try {
			$r = eval(s);
		} catch( e ) {
			$r = [];
		}
		return $r;
	}(this));
	var m = new Array();
	var _g1 = 0, _g = a.length - (s == "$s"?2:0);
	while(_g1 < _g) {
		var i = _g1++;
		var d = a[i].split("::");
		m.unshift(haxe.StackItem.Method(d[0],d[1]));
	}
	return m;
};
haxe.Stack.prototype.__class__ = haxe.Stack;
if(typeof js=='undefined') js = {};
js.NodeC = $hxClasses["js.NodeC"] =  function() { };
js.NodeC.__name__ = ["js","NodeC"];
js.NodeC.prototype.__class__ = js.NodeC;
js.Node = $hxClasses["js.Node"] =  function() { };
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
StringTools = $hxClasses["StringTools"] =  function() { };
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
Reflect = $hxClasses["Reflect"] =  function() { };
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	if(o.hasOwnProperty != null) return o.hasOwnProperty(field);
	var arr = Reflect.fields(o);
	var $it0 = arr.iterator();
	while( $it0.hasNext() ) {
		var t = $it0.next();
		if(t == field) return true;
	}
	return false;
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
	if(o == null) return new Array();
	var a = new Array();
	if(o.hasOwnProperty) {
		for(var i in o) if( o.hasOwnProperty(i) ) a.push(i);
	} else {
		var t;
		try {
			t = o.__proto__;
		} catch( e ) {
			t = null;
		}
		if(t != null) o.__proto__ = null;
		for(var i in o) if( i != "__proto__" ) a.push(i);
		if(t != null) o.__proto__ = t;
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
		var a = new Array();
		var _g1 = 0, _g = arguments.length;
		while(_g1 < _g) {
			var i = _g1++;
			a.push(arguments[i]);
		}
		return f(a);
	};
};
Reflect.prototype.__class__ = Reflect;
if(typeof cloudshift=='undefined') cloudshift = {};
if(!cloudshift.http) cloudshift.http = {};
cloudshift.http.Mime = $hxClasses["cloudshift.http.Mime"] =  function() { };
cloudshift.http.Mime.__name__ = ["cloudshift","http","Mime"];
cloudshift.http.Mime.prototype.__class__ = cloudshift.http.Mime;
haxe.Log = $hxClasses["haxe.Log"] =  function() { };
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
};
haxe.Log.prototype.__class__ = haxe.Log;
StringBuf = $hxClasses["StringBuf"] =  function() {
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
cloudshift.Part_ = $hxClasses["cloudshift.Part_"] =  function() { };
cloudshift.Part_.__name__ = ["cloudshift","Part_"];
cloudshift.Part_.prototype._events = null;
cloudshift.Part_.prototype.partID = null;
cloudshift.Part_.prototype.start = null;
cloudshift.Part_.prototype.stop = null;
cloudshift.Part_.prototype.observe = null;
cloudshift.Part_.prototype.notify = null;
cloudshift.Part_.prototype.observeState = null;
cloudshift.Part_.prototype.notifyState = null;
cloudshift.Part_.prototype.peer = null;
cloudshift.Part_.prototype.__class__ = cloudshift.Part_;
if(!cloudshift.core) cloudshift.core = {};
cloudshift.core.PartBaseImpl = $hxClasses["cloudshift.core.PartBaseImpl"] =  function(parent) {
	this.parent = parent;
	this.partID = Type.getClassName(Type.getClass(parent));
	this._events = new cloudshift.core.ObservableImpl();
};
cloudshift.core.PartBaseImpl.__name__ = ["cloudshift","core","PartBaseImpl"];
cloudshift.core.PartBaseImpl.prototype.partID = null;
cloudshift.core.PartBaseImpl.prototype._events = null;
cloudshift.core.PartBaseImpl.prototype.parent = null;
cloudshift.core.PartBaseImpl.prototype.peer = function() {
	return this.parent;
};
cloudshift.core.PartBaseImpl.prototype.notify = function(e) {
	this._events.notify(cloudshift.EPartState.Event(e));
};
cloudshift.core.PartBaseImpl.prototype.notifyState = function(s) {
	this._events.notify(s);
};
cloudshift.core.PartBaseImpl.prototype.observe = function(cb,info) {
	return this._events.observe(function(s) {
		var $e = (s);
		switch( $e[1] ) {
		case 2:
			var s1 = $e[2];
			cb(s1);
			break;
		default:
		}
	},info);
};
cloudshift.core.PartBaseImpl.prototype.observeState = function(cb) {
	this._events.observe(cb);
};
cloudshift.core.PartBaseImpl.prototype.start = function(d,oc) {
	var me = this;
	var p = null;
	p = this.parent.start_(d,oc);
	this.checkErr("start",p);
	cloudshift.OutcomeX.outcome(p,function(outcome) {
		me._events.notify(cloudshift.EPartState.Started);
	},function(msg) {
		return me._events.notify(cloudshift.EPartState.Error(Std.string(msg)));
	});
	return p;
};
cloudshift.core.PartBaseImpl.prototype.stop = function(d) {
	var me = this;
	var p = null;
	p = this.parent.stop_(d);
	this.checkErr("stop",p);
	cloudshift.OutcomeX.outcome(p,function(outcome) {
		me._events.notify(cloudshift.EPartState.Stopped);
	},function(msg) {
		me._events.notify(cloudshift.EPartState.Error(msg));
	});
	return p;
};
cloudshift.core.PartBaseImpl.prototype.checkErr = function(type,outcome) {
	if(outcome == null) throw Type.getClassName(Type.getClass(this.parent)) + " should not return null for " + type + " function";
	return outcome;
};
cloudshift.core.PartBaseImpl.prototype.__class__ = cloudshift.core.PartBaseImpl;
cloudshift.core.PartBaseImpl.__interfaces__ = [cloudshift.Part_];
cloudshift.Future = $hxClasses["cloudshift.Future"] =  function() { };
cloudshift.Future.__name__ = ["cloudshift","Future"];
cloudshift.Future.prototype.sequence = null;
cloudshift.Future.prototype.resolve = null;
cloudshift.Future.prototype.deliver = null;
cloudshift.Future.prototype.deliverMe = null;
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
cloudshift.core.FutureImpl = $hxClasses["cloudshift.core.FutureImpl"] =  function() {
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
cloudshift.core.FutureImpl.waitFor = function(toJoin) {
	var joinLen = toJoin.length, myprm = cloudshift.core.FutureImpl.create(), combined = [], sequence = 0;
	cloudshift.ArrayX.foreach(toJoin,function(xprm) {
		if(!Std["is"](xprm,cloudshift.Future)) throw "not a promise:" + xprm;
		xprm.sequence = sequence++;
		xprm.deliverMe(function(r) {
			combined.push({ seq : r.sequence, val : r._result});
			if(combined.length == joinLen) {
				combined.sort(function(x,y) {
					return x.seq - y.seq;
				});
				myprm.resolve(cloudshift.ArrayX.map(combined,function(el) {
					return el.val;
				}));
			}
		});
	});
	return myprm;
};
cloudshift.core.FutureImpl.prototype.sequence = null;
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
cloudshift.core.FutureImpl.prototype.deliverMe = function(f) {
	var me = this;
	if(this.isCanceled()) return this; else if(this.isDelivered()) f(this); else this._listeners.push(function(g) {
		f(me);
	});
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
cloudshift.Bitcoin = $hxClasses["cloudshift.Bitcoin"] =  function(host,port,user,pass) {
	if(port == null) port = 8332;
	this._url = "http://" + host + ":" + port + "/";
	haxe.Log.trace("url = " + this._url,{ fileName : "Bitcoin.hx", lineNumber : 93, className : "cloudshift.Bitcoin", methodName : "new"});
	this._user = user;
	this._pass = pass;
};
cloudshift.Bitcoin.__name__ = ["cloudshift","Bitcoin"];
cloudshift.Bitcoin.prototype._user = null;
cloudshift.Bitcoin.prototype._pass = null;
cloudshift.Bitcoin.prototype._url = null;
cloudshift.Bitcoin.prototype._lastID = null;
cloudshift.Bitcoin.prototype.jsonrpc = function(method,params,id) {
	var me = this;
	var mid = id == null?Std.string(cloudshift.Bitcoin.defaultId++):id, oc = new cloudshift.core.FutureImpl(), req = cloudshift.Core.stringify({ method : method, params : params, id : mid}), headers = { }, buff = new Buffer(this._user + ":" + this._pass).toString("base64"), auth = "Basic " + buff;
	headers["Content-Length"] = req.length;
	headers["Authorization"] = auth;
	cloudshift.OutcomeX.outcome(cloudshift.Http.post(this._url,req,false,headers),function(jsonResult) {
		var res = cloudshift.Core.parse(jsonResult);
		me._lastID = res.id;
		oc.resolve(res.error == null?cloudshift.Either.Right(res.result):cloudshift.Either.Left(res.error.message));
	},function(err) {
		oc.resolve(cloudshift.Either.Left(err));
	});
	return oc;
};
cloudshift.Bitcoin.prototype.getLastID = function() {
	return this._lastID;
};
cloudshift.Bitcoin.prototype.backupWallet = function(destination,id) {
	return this.jsonrpc("backupwallet",[destination],id);
};
cloudshift.Bitcoin.prototype.encryptWallet = function(passphrase,id) {
	return this.jsonrpc("encryptwallet",[passphrase],id);
};
cloudshift.Bitcoin.prototype.account = function(bitcoinaddress,id) {
	return this.jsonrpc("getaccount",[bitcoinaddress],id);
};
cloudshift.Bitcoin.prototype.accountAddress = function(account,id) {
	return this.jsonrpc("getaccountaddress",[account],id);
};
cloudshift.Bitcoin.prototype.addressesByAccount = function(account,id) {
	return this.jsonrpc("getaddressesbyaccount",[account],id);
};
cloudshift.Bitcoin.prototype.balance = function(account,minconf,id) {
	if(minconf == null) minconf = 1;
	var acc = account != null?[account,minconf]:[];
	return this.jsonrpc("getbalance",acc,id);
};
cloudshift.Bitcoin.prototype.transaction = function(txid,id) {
	return this.jsonrpc("gettransaction",[txid],id);
};
cloudshift.Bitcoin.prototype.blockCount = function(id) {
	return this.jsonrpc("getblockcount",[],id);
};
cloudshift.Bitcoin.prototype.connectionCount = function(id) {
	return this.jsonrpc("getconnectioncount",[],id);
};
cloudshift.Bitcoin.prototype.difficulty = function(id) {
	return this.jsonrpc("getdifficulty",[],id);
};
cloudshift.Bitcoin.prototype.generate = function(id) {
	return this.jsonrpc("getgenerate",[],id);
};
cloudshift.Bitcoin.prototype.hashesPerSec = function(id) {
	return this.jsonrpc("gethashespersec",[],id);
};
cloudshift.Bitcoin.prototype.accounts = function(minconf,id) {
	if(minconf == null) minconf = 10;
	var oc = new cloudshift.core.FutureImpl();
	cloudshift.OutcomeX.outcome(this.jsonrpc("listaccounts",[minconf],id),function(res) {
		var a = [];
		var _g = 0, _g1 = Reflect.fields(res.result);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			a.push({ account : f, balance : Reflect.field(res.result,f)});
		}
		oc.resolve(cloudshift.Either.Right(a));
	});
	return oc;
};
cloudshift.Bitcoin.prototype.transactions = function(account,count,from,id) {
	if(from == null) from = 0;
	if(count == null) count = 10;
	return this.jsonrpc("listtransactions",[account,count,from],id);
};
cloudshift.Bitcoin.prototype.info = function(id) {
	return this.jsonrpc("getinfo",[],id);
};
cloudshift.Bitcoin.prototype.memoryPool = function(data,id) {
	var p = data != null?[data]:[];
	return this.jsonrpc("getmemorypool",p,id);
};
cloudshift.Bitcoin.prototype.newAddress = function(account,id) {
	var p = account != null?[account]:[];
	return this.jsonrpc("getnewaddress",p,id);
};
cloudshift.Bitcoin.prototype.receivedByAccount = function(account,minConf,id) {
	if(minConf == null) minConf = 1;
	var p = account != null?[account,minConf]:[];
	return this.jsonrpc("getreceivedbyaccount",p,id);
};
cloudshift.Bitcoin.prototype.receivedByAddress = function(address,minConf,id) {
	if(minConf == null) minConf = 1;
	var p = address != null?[address,minConf]:[];
	return this.jsonrpc("getreceivedbyaddress",p,id);
};
cloudshift.Bitcoin.prototype.listReceivedByAccount = function(minConf,includeEmpty,id) {
	if(includeEmpty == null) includeEmpty = false;
	if(minConf == null) minConf = 1;
	return this.jsonrpc("listreceivedbyaccount",[minConf,includeEmpty],id);
};
cloudshift.Bitcoin.prototype.listReceivedByAddress = function(minConf,includeEmpty,id) {
	if(includeEmpty == null) includeEmpty = false;
	if(minConf == null) minConf = 1;
	return this.jsonrpc("listreceivedbyaddress",[minConf,includeEmpty],id);
};
cloudshift.Bitcoin.prototype.transactionsSinceBlock = function(blockId,targetConfirmations,id) {
	if(targetConfirmations == null) targetConfirmations = 1;
	var p = blockId != null?[blockId,targetConfirmations]:[];
	return this.jsonrpc("listsinceblock",p,id);
};
cloudshift.Bitcoin.prototype.move = function(from,to,amount,minConf,comment,id) {
	if(minConf == null) minConf = 1;
	return this.jsonrpc("move",[from,to,amount,minConf,comment],id);
};
cloudshift.Bitcoin.prototype.sendFrom = function(fromAccount,to,amount,minConf,comment,commentTo,id) {
	if(minConf == null) minConf = 1;
	return this.jsonrpc("sendfrom",[fromAccount,to,amount,minConf,comment,commentTo],id);
};
cloudshift.Bitcoin.prototype.sendMany = function(fromAccount,many,minConf,comment,id) {
	if(minConf == null) minConf = 1;
	return this.jsonrpc("sendmany",[fromAccount,many,minConf,comment],id);
};
cloudshift.Bitcoin.prototype.sendToAddress = function(address,amount,minConf,comment,commentTo,id) {
	if(minConf == null) minConf = 1;
	return this.jsonrpc("sendtoaddress",[address,amount,minConf,comment,commentTo],id);
};
cloudshift.Bitcoin.prototype.setAccount = function(bitcoinAddress,account,id) {
	return this.jsonrpc("setaccount",[bitcoinAddress,account],id);
};
cloudshift.Bitcoin.prototype.setGenerate = function(generate,genProcLimit,id) {
	if(genProcLimit == null) genProcLimit = -1;
	return this.jsonrpc("setgenerate",[generate,genProcLimit],id);
};
cloudshift.Bitcoin.prototype.signMessage = function(address,message,id) {
	return this.jsonrpc("signmessage",[address,message],id);
};
cloudshift.Bitcoin.prototype.setTxFee = function(amount,id) {
	return this.jsonrpc("settxfee",[amount],id);
};
cloudshift.Bitcoin.prototype.stop = function(id) {
	return this.jsonrpc("stop",[],id);
};
cloudshift.Bitcoin.prototype.validateAddress = function(address,id) {
	return this.jsonrpc("validateaddress",[address],id);
};
cloudshift.Bitcoin.prototype.verifyMessage = function(address,signature,message,id) {
	return this.jsonrpc("verifymessage",[address,signature,message],id);
};
cloudshift.Bitcoin.prototype.walletLock = function(id) {
	return this.jsonrpc("walletlock",[],id);
};
cloudshift.Bitcoin.prototype.walletPassPhrase = function(passphrase,timeout,id) {
	return this.jsonrpc("walletpassphrase",[passphrase,timeout],id);
};
cloudshift.Bitcoin.prototype.walletChangePassPhrase = function(oldpp,newpp,id) {
	return this.jsonrpc("walletchangepassphrase",[oldpp,newpp],id);
};
cloudshift.Bitcoin.prototype.__class__ = cloudshift.Bitcoin;
cloudshift.Observable = $hxClasses["cloudshift.Observable"] =  function() { };
cloudshift.Observable.__name__ = ["cloudshift","Observable"];
cloudshift.Observable.prototype.preNotify = null;
cloudshift.Observable.prototype.notify = null;
cloudshift.Observable.prototype.observe = null;
cloudshift.Observable.prototype.peers = null;
cloudshift.Observable.prototype.removePeers = null;
cloudshift.Observable.prototype.peek = null;
cloudshift.Observable.prototype.__class__ = cloudshift.Observable;
cloudshift.core.ObservableImpl = $hxClasses["cloudshift.core.ObservableImpl"] =  function() {
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
		h.handler = null;
		me._unsubscribes++;
		if(me._unsubscribes >= cloudshift.core.ObservableImpl.CLEANUP) {
			haxe.Log.trace("cleaning up",{ fileName : "ObservableImpl.hx", lineNumber : 55, className : "cloudshift.core.ObservableImpl", methodName : "observe"});
			me._unsubscribes = 0;
			me._observers = cloudshift.ArrayX.filter(me._observers,function(s) {
				return s.handler != null;
			});
		}
		if(me._event != null) me._event.notify(cloudshift.EOperation.Del(info));
	};
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
cloudshift.SysWriteStream = $hxClasses["cloudshift.SysWriteStream"] =  function() { };
cloudshift.SysWriteStream.__name__ = ["cloudshift","SysWriteStream"];
cloudshift.SysWriteStream.prototype.writeable = null;
cloudshift.SysWriteStream.prototype.write = null;
cloudshift.SysWriteStream.prototype.end = null;
cloudshift.SysWriteStream.prototype.getNodeWriteStream = null;
cloudshift.SysWriteStream.prototype.__class__ = cloudshift.SysWriteStream;
cloudshift.SysWriteStream.__interfaces__ = [cloudshift.Observable];
if(!cloudshift.sys) cloudshift.sys = {};
cloudshift.sys.WriteStreamImpl = $hxClasses["cloudshift.sys.WriteStreamImpl"] =  function(s) {
	var me = this;
	cloudshift.core.ObservableImpl.call(this);
	this._writeStream = s;
	this._writeStream.addListener("drain",function() {
		me.notify(cloudshift.SysWriteStreamEvents.Drain);
	});
	this._writeStream.addListener("error",function(ex) {
		me.notify(cloudshift.SysWriteStreamEvents.Error(new String(ex)));
	});
	this._writeStream.addListener("close",function() {
		me.notify(cloudshift.SysWriteStreamEvents.Close);
	});
	this._writeStream.addListener("pipe",function(src) {
		me.notify(cloudshift.SysWriteStreamEvents.Pipe(new cloudshift.sys.ReadStreamImpl(src)));
	});
};
cloudshift.sys.WriteStreamImpl.__name__ = ["cloudshift","sys","WriteStreamImpl"];
cloudshift.sys.WriteStreamImpl.__super__ = cloudshift.core.ObservableImpl;
for(var k in cloudshift.core.ObservableImpl.prototype ) cloudshift.sys.WriteStreamImpl.prototype[k] = cloudshift.core.ObservableImpl.prototype[k];
cloudshift.sys.WriteStreamImpl.createWriteStream = function(path,options) {
	return new cloudshift.sys.WriteStreamImpl(js.Node.fs.createWriteStream(path,options));
};
cloudshift.sys.WriteStreamImpl.prototype._writeStream = null;
cloudshift.sys.WriteStreamImpl.prototype.writeable = null;
cloudshift.sys.WriteStreamImpl.prototype.getWriteable = function() {
	return this._writeStream.writeable;
};
cloudshift.sys.WriteStreamImpl.prototype.write = function(d,enc,fd) {
	return this._writeStream.write(d,enc,fd);
};
cloudshift.sys.WriteStreamImpl.prototype.end = function(s,enc) {
	this._writeStream.end(s,enc);
};
cloudshift.sys.WriteStreamImpl.prototype.getNodeWriteStream = function() {
	return this._writeStream;
};
cloudshift.sys.WriteStreamImpl.prototype.__class__ = cloudshift.sys.WriteStreamImpl;
cloudshift.sys.WriteStreamImpl.__interfaces__ = [cloudshift.SysWriteStream];
cloudshift.SysEnc = $hxClasses["cloudshift.SysEnc"] = { __ename__ : ["cloudshift","SysEnc"], __constructs__ : ["ASCII","UTF8","BINARY","BASE64"] };
cloudshift.SysEnc.BASE64 = ["BASE64",3];
cloudshift.SysEnc.BASE64.toString = $estr;
cloudshift.SysEnc.BASE64.__enum__ = cloudshift.SysEnc;
cloudshift.SysEnc.ASCII = ["ASCII",0];
cloudshift.SysEnc.ASCII.toString = $estr;
cloudshift.SysEnc.ASCII.__enum__ = cloudshift.SysEnc;
cloudshift.SysEnc.UTF8 = ["UTF8",1];
cloudshift.SysEnc.UTF8.toString = $estr;
cloudshift.SysEnc.UTF8.__enum__ = cloudshift.SysEnc;
cloudshift.SysEnc.BINARY = ["BINARY",2];
cloudshift.SysEnc.BINARY.toString = $estr;
cloudshift.SysEnc.BINARY.__enum__ = cloudshift.SysEnc;
cloudshift.SysEvents = $hxClasses["cloudshift.SysEvents"] = { __ename__ : ["cloudshift","SysEvents"], __constructs__ : ["ProcessExit","ProcessUncaughtException","SigInt"] };
cloudshift.SysEvents.ProcessUncaughtException = function(ex) { var $x = ["ProcessUncaughtException",1,ex]; $x.__enum__ = cloudshift.SysEvents; $x.toString = $estr; return $x; };
cloudshift.SysEvents.SigInt = function(s) { var $x = ["SigInt",2,s]; $x.__enum__ = cloudshift.SysEvents; $x.toString = $estr; return $x; };
cloudshift.SysEvents.ProcessExit = ["ProcessExit",0];
cloudshift.SysEvents.ProcessExit.toString = $estr;
cloudshift.SysEvents.ProcessExit.__enum__ = cloudshift.SysEvents;
cloudshift.SysWriteStreamEvents = $hxClasses["cloudshift.SysWriteStreamEvents"] = { __ename__ : ["cloudshift","SysWriteStreamEvents"], __constructs__ : ["Drain","Error","Close","Pipe"] };
cloudshift.SysWriteStreamEvents.Drain = ["Drain",0];
cloudshift.SysWriteStreamEvents.Drain.toString = $estr;
cloudshift.SysWriteStreamEvents.Drain.__enum__ = cloudshift.SysWriteStreamEvents;
cloudshift.SysWriteStreamEvents.Pipe = function(src) { var $x = ["Pipe",3,src]; $x.__enum__ = cloudshift.SysWriteStreamEvents; $x.toString = $estr; return $x; };
cloudshift.SysWriteStreamEvents.Close = ["Close",2];
cloudshift.SysWriteStreamEvents.Close.toString = $estr;
cloudshift.SysWriteStreamEvents.Close.__enum__ = cloudshift.SysWriteStreamEvents;
cloudshift.SysWriteStreamEvents.Error = function(e) { var $x = ["Error",1,e]; $x.__enum__ = cloudshift.SysWriteStreamEvents; $x.toString = $estr; return $x; };
cloudshift.SysReadStreamEvents = $hxClasses["cloudshift.SysReadStreamEvents"] = { __ename__ : ["cloudshift","SysReadStreamEvents"], __constructs__ : ["Data","Error","End","Close","Fd"] };
cloudshift.SysReadStreamEvents.Fd = ["Fd",4];
cloudshift.SysReadStreamEvents.Fd.toString = $estr;
cloudshift.SysReadStreamEvents.Fd.__enum__ = cloudshift.SysReadStreamEvents;
cloudshift.SysReadStreamEvents.Close = ["Close",3];
cloudshift.SysReadStreamEvents.Close.toString = $estr;
cloudshift.SysReadStreamEvents.Close.__enum__ = cloudshift.SysReadStreamEvents;
cloudshift.SysReadStreamEvents.Data = function(d) { var $x = ["Data",0,d]; $x.__enum__ = cloudshift.SysReadStreamEvents; $x.toString = $estr; return $x; };
cloudshift.SysReadStreamEvents.End = ["End",2];
cloudshift.SysReadStreamEvents.End.toString = $estr;
cloudshift.SysReadStreamEvents.End.__enum__ = cloudshift.SysReadStreamEvents;
cloudshift.SysReadStreamEvents.Error = function(e) { var $x = ["Error",1,e]; $x.__enum__ = cloudshift.SysReadStreamEvents; $x.toString = $estr; return $x; };
cloudshift.SysChildProcessEvents = $hxClasses["cloudshift.SysChildProcessEvents"] = { __ename__ : ["cloudshift","SysChildProcessEvents"], __constructs__ : ["Exit"] };
cloudshift.SysChildProcessEvents.Exit = function(code,signal) { var $x = ["Exit",0,code,signal]; $x.__enum__ = cloudshift.SysChildProcessEvents; $x.toString = $estr; return $x; };
cloudshift.SysChildProcess = $hxClasses["cloudshift.SysChildProcess"] =  function() { };
cloudshift.SysChildProcess.__name__ = ["cloudshift","SysChildProcess"];
cloudshift.SysChildProcess.prototype.stdin = null;
cloudshift.SysChildProcess.prototype.stdout = null;
cloudshift.SysChildProcess.prototype.stderr = null;
cloudshift.SysChildProcess.prototype.pid = null;
cloudshift.SysChildProcess.prototype.kill = null;
cloudshift.SysChildProcess.prototype.__class__ = cloudshift.SysChildProcess;
cloudshift.SysChildProcess.__interfaces__ = [cloudshift.Observable];
cloudshift.SysReadStream = $hxClasses["cloudshift.SysReadStream"] =  function() { };
cloudshift.SysReadStream.__name__ = ["cloudshift","SysReadStream"];
cloudshift.SysReadStream.prototype.readable = null;
cloudshift.SysReadStream.prototype.pause = null;
cloudshift.SysReadStream.prototype.resume = null;
cloudshift.SysReadStream.prototype.destroy = null;
cloudshift.SysReadStream.prototype.destroySoon = null;
cloudshift.SysReadStream.prototype.setEncoding = null;
cloudshift.SysReadStream.prototype.pipe = null;
cloudshift.SysReadStream.prototype.getNodeReadStream = null;
cloudshift.SysReadStream.prototype.__class__ = cloudshift.SysReadStream;
cloudshift.SysReadStream.__interfaces__ = [cloudshift.Observable];
cloudshift.sys.Events = $hxClasses["cloudshift.sys.Events"] =  function() {
	var me = this;
	cloudshift.core.ObservableImpl.call(this);
	js.Node.process.addListener("exit",function() {
		me.notify(cloudshift.SysEvents.ProcessExit);
	});
	js.Node.process.addListener("uncaughtException",function(ex) {
		me.notify(cloudshift.SysEvents.ProcessUncaughtException(ex));
	});
};
cloudshift.sys.Events.__name__ = ["cloudshift","sys","Events"];
cloudshift.sys.Events.__super__ = cloudshift.core.ObservableImpl;
for(var k in cloudshift.core.ObservableImpl.prototype ) cloudshift.sys.Events.prototype[k] = cloudshift.core.ObservableImpl.prototype[k];
cloudshift.sys.Events.prototype.__class__ = cloudshift.sys.Events;
cloudshift.Sys = $hxClasses["cloudshift.Sys"] =  function() { };
cloudshift.Sys.__name__ = ["cloudshift","Sys"];
cloudshift.Sys.events = function() {
	return cloudshift.Sys._events;
};
cloudshift.Sys.argv = function() {
	return cloudshift.Sys._proc.argv;
};
cloudshift.Sys.stdout = function() {
	return new cloudshift.sys.WriteStreamImpl(cloudshift.Sys._proc.stdout);
};
cloudshift.Sys.stdin = function() {
	return new cloudshift.sys.ReadStreamImpl(cloudshift.Sys._proc.stdin);
};
cloudshift.Sys.stderr = function() {
	return new cloudshift.sys.WriteStreamImpl(cloudshift.Sys._proc.stderr);
};
cloudshift.Sys.createWriteStream = function(path,opt) {
	return cloudshift.sys.WriteStreamImpl.createWriteStream(path,opt);
};
cloudshift.Sys.env = function() {
	return cloudshift.Sys._proc.env;
};
cloudshift.Sys.pid = function() {
	return cloudshift.Sys._proc.pid;
};
cloudshift.Sys.title = function() {
	return cloudshift.Sys._proc.title;
};
cloudshift.Sys.arch = function() {
	return cloudshift.Sys._proc.arch;
};
cloudshift.Sys.platform = function() {
	return cloudshift.Sys._proc.platform;
};
cloudshift.Sys.installPrefix = function() {
	return cloudshift.Sys._proc.installPrefix;
};
cloudshift.Sys.execPath = function() {
	return cloudshift.Sys._proc.execPath;
};
cloudshift.Sys.version = function() {
	return cloudshift.Sys._proc.version;
};
cloudshift.Sys.versions = function() {
	return cloudshift.Sys._proc.versions;
};
cloudshift.Sys.memoryUsage = function() {
	return cloudshift.Sys._proc.memoryUsage();
};
cloudshift.Sys.nextTick = function(fn) {
	cloudshift.Sys._proc.nextTick(fn);
};
cloudshift.Sys.exit = function(code) {
	cloudshift.Sys._proc.exit(code);
};
cloudshift.Sys.cwd = function() {
	return cloudshift.Sys._proc.cwd();
};
cloudshift.Sys.getuid = function() {
	return cloudshift.Sys._proc.getuid();
};
cloudshift.Sys.getgid = function() {
	return cloudshift.Sys._proc.getgid();
};
cloudshift.Sys.setuid = function(u) {
	cloudshift.Sys._proc.setuid(u);
};
cloudshift.Sys.setgid = function(g) {
	cloudshift.Sys._proc.setgid(g);
};
cloudshift.Sys.umask = function(m) {
	return cloudshift.Sys._proc.umask(m);
};
cloudshift.Sys.chdir = function(d) {
	cloudshift.Sys._proc.chdir(d);
};
cloudshift.Sys.kill = function(pid,signal) {
	cloudshift.Sys._proc.kill(pid,signal);
};
cloudshift.Sys.uptime = function() {
	return cloudshift.Sys._proc.uptime();
};
cloudshift.Sys.hostname = function() {
	return cloudshift.Sys._os.hostname();
};
cloudshift.Sys.type = function() {
	return cloudshift.Sys._os.type();
};
cloudshift.Sys.release = function() {
	return cloudshift.Sys._os.release();
};
cloudshift.Sys.osUptime = function() {
	return cloudshift.Sys._os.uptime();
};
cloudshift.Sys.loadavg = function() {
	return cloudshift.Sys._os.loadavg();
};
cloudshift.Sys.totalmem = function() {
	return cloudshift.Sys._os.totalmem();
};
cloudshift.Sys.freemem = function() {
	return cloudshift.Sys._os.freemem();
};
cloudshift.Sys.cpus = function() {
	return cloudshift.Sys._os.cpus();
};
cloudshift.Sys.networkInterfaces = function() {
	return cloudshift.Sys._os.networkInterfaces();
};
cloudshift.Sys.spawn = function(command,args,options) {
	if(args == null) args = [];
	return cloudshift.sys.ChildProcessImpl.spawn(command,args,options);
};
cloudshift.Sys.exec = function(command,options,cb) {
	return cloudshift.sys.ChildProcessImpl.exec(command,options,cb);
};
cloudshift.Sys.execFile = function(command,options,cb) {
	return cloudshift.sys.ChildProcessImpl.execFile(command,options,cb);
};
cloudshift.Sys.getEnc = function(enc) {
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
cloudshift.Sys.exists = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.path.exists(path,function(exists) {
		prm.resolve(exists?cloudshift.Either.Right(path):cloudshift.Either.Left(path));
	});
	return prm;
};
cloudshift.Sys.rename = function(from,to) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.rename(from,to,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(to));
	});
	return prm;
};
cloudshift.Sys.stat = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.stat(path,function(err,stat) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right({ path : path, stat : stat}));
	});
	return prm;
};
cloudshift.Sys.lstat = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.lstat(path,function(err,stat) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(stat));
	});
	return prm;
};
cloudshift.Sys.fstat = function(fd) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.fstat(fd,function(err,stat) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(stat));
	});
	return prm;
};
cloudshift.Sys.link = function(srcPath,dstPath) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.link(srcPath,dstPath,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(dstPath));
	});
	return prm;
};
cloudshift.Sys.unlink = function(srcPath) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.unlink(srcPath,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(srcPath));
	});
	return prm;
};
cloudshift.Sys.symlink = function(linkData,path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.symlink(linkData,path,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(true));
	});
	return prm;
};
cloudshift.Sys.readlink = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.readlink(path,function(err,s) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(s));
	});
	return prm;
};
cloudshift.Sys.realpath = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.realpath(path,function(err,s) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(s));
	});
	return prm;
};
cloudshift.Sys.chmod = function(path,mode) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.chmod(path,mode,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(path));
	});
	return prm;
};
cloudshift.Sys.fchmod = function(fd,mode) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.fchmod(fd,mode,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fd));
	});
	return prm;
};
cloudshift.Sys.chown = function(path,uid,gid) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.chown(path,uid,gid,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(path));
	});
	return prm;
};
cloudshift.Sys.rmdir = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.rmdir(path,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(path));
	});
	return prm;
};
cloudshift.Sys.mkdir = function(path,mode) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.mkdir(path,mode,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(path));
	});
	return prm;
};
cloudshift.Sys.readdir = function(path) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.readdir(path,function(err,fileNames) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fileNames));
	});
	return prm;
};
cloudshift.Sys.close = function(fd) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.close(fd,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fd));
	});
	return prm;
};
cloudshift.Sys.open = function(path,flags,mode) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.open(path,flags,mode,function(err,i) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(i));
	});
	return prm;
};
cloudshift.Sys.write = function(fd,bufOrStr,offset,length,position) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.write(fd,bufOrStr,offset,length,position,function(err,i) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(i));
	});
	return prm;
};
cloudshift.Sys.read = function(fd,buffer,offset,length,position) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.read(fd,buffer,offset,length,position,function(err,i,nb) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(i));
	});
	return prm;
};
cloudshift.Sys.truncate = function(fd,len) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.truncate(fd,len,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(len));
	});
	return prm;
};
cloudshift.Sys.readFile = function(path,enc) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.readFile(path,cloudshift.Sys.getEnc(enc),function(err,s) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(new String(s)));
	});
	return prm;
};
cloudshift.Sys.writeFile = function(fileName,contents,enc) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.writeFile(fileName,contents,cloudshift.Sys.getEnc(enc),function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fileName));
	});
	return prm;
};
cloudshift.Sys.utimes = function(path,atime,mtime) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.utimes(path,atime,mtime,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(path));
	});
	return prm;
};
cloudshift.Sys.futimes = function(fd,atime,mtime) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.futimes(fd,atime,mtime,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fd));
	});
	return prm;
};
cloudshift.Sys.fsync = function(fd) {
	var prm = new cloudshift.core.FutureImpl();
	js.Node.fs.fsync(fd,function(err) {
		prm.resolve(err != null?cloudshift.Either.Left(err):cloudshift.Either.Right(fd));
	});
	return prm;
};
cloudshift.Sys.watchFile = function(fileName,options,listener) {
	js.Node.fs.watchFile(fileName,options,listener);
};
cloudshift.Sys.unwatchFile = function(fileName) {
	js.Node.fs.unwatchFile(fileName);
};
cloudshift.Sys.watch = function(fileName,options,listener) {
	var prm = new cloudshift.core.FutureImpl();
	try {
		var w = js.Node.fs.watch(fileName,options,listener);
		prm.resolve(w == null?cloudshift.Either.Left("can't create readStream"):cloudshift.Either.Right(w));
	} catch( ex ) {
		prm.resolve(cloudshift.Either.Left(ex));
	}
	return prm;
};
cloudshift.Sys.nodeReadStream = function(path,options) {
	var prm = new cloudshift.core.FutureImpl();
	try {
		var rs = js.Node.fs.createReadStream(path,options);
		prm.resolve(rs == null?cloudshift.Either.Left("can't create readStream"):cloudshift.Either.Right(rs));
	} catch( ex ) {
		prm.resolve(cloudshift.Either.Left(ex));
	}
	return prm;
};
cloudshift.Sys.nodeWriteStream = function(path,options) {
	var prm = new cloudshift.core.FutureImpl();
	try {
		var ws = js.Node.fs.createWriteStream(path,options);
		prm.resolve(ws == null?cloudshift.Either.Left("can't create writeStream"):cloudshift.Either.Right(ws));
	} catch( ex ) {
		prm.resolve(cloudshift.Either.Left(ex));
	}
	return prm;
};
cloudshift.Sys.prototype.__class__ = cloudshift.Sys;
if(!haxe.io) haxe.io = {};
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] =  function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var newB = new Buffer(length);
	newB.fill(0,0);
	return new haxe.io.Bytes(length,newB);
};
haxe.io.Bytes.ofString = function(s) {
	return new haxe.io.Bytes(s.length,new Buffer(s,"utf8"));
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
	src.b.copy(this.b,pos,srcpos,srcpos + len);
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
IntIter = $hxClasses["IntIter"] =  function(min,max) {
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
cloudshift.Option = $hxClasses["cloudshift.Option"] = { __ename__ : ["cloudshift","Option"], __constructs__ : ["None","Some"] };
cloudshift.Option.None = ["None",0];
cloudshift.Option.None.toString = $estr;
cloudshift.Option.None.__enum__ = cloudshift.Option;
cloudshift.Option.Some = function(v) { var $x = ["Some",1,v]; $x.__enum__ = cloudshift.Option; $x.toString = $estr; return $x; };
cloudshift.Either = $hxClasses["cloudshift.Either"] = { __ename__ : ["cloudshift","Either"], __constructs__ : ["Left","Right"] };
cloudshift.Either.Left = function(v) { var $x = ["Left",0,v]; $x.__enum__ = cloudshift.Either; $x.toString = $estr; return $x; };
cloudshift.Either.Right = function(v) { var $x = ["Right",1,v]; $x.__enum__ = cloudshift.Either; $x.toString = $estr; return $x; };
cloudshift.EOperation = $hxClasses["cloudshift.EOperation"] = { __ename__ : ["cloudshift","EOperation"], __constructs__ : ["Add","Del"] };
cloudshift.EOperation.Add = function(info) { var $x = ["Add",0,info]; $x.__enum__ = cloudshift.EOperation; $x.toString = $estr; return $x; };
cloudshift.EOperation.Del = function(info) { var $x = ["Del",1,info]; $x.__enum__ = cloudshift.EOperation; $x.toString = $estr; return $x; };
cloudshift.ELogLevel = $hxClasses["cloudshift.ELogLevel"] = { __ename__ : ["cloudshift","ELogLevel"], __constructs__ : ["I","W","E"] };
cloudshift.ELogLevel.I = function(s) { var $x = ["I",0,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.ELogLevel.E = function(s) { var $x = ["E",2,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.ELogLevel.W = function(s) { var $x = ["W",1,s]; $x.__enum__ = cloudshift.ELogLevel; $x.toString = $estr; return $x; };
cloudshift.EPartState = $hxClasses["cloudshift.EPartState"] = { __ename__ : ["cloudshift","EPartState"], __constructs__ : ["Started","Stopped","Event","Error","Except"] };
cloudshift.EPartState.Except = function(e) { var $x = ["Except",4,e]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Event = function(event) { var $x = ["Event",2,event]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Started = ["Started",0];
cloudshift.EPartState.Started.toString = $estr;
cloudshift.EPartState.Started.__enum__ = cloudshift.EPartState;
cloudshift.EPartState.Error = function(msg) { var $x = ["Error",3,msg]; $x.__enum__ = cloudshift.EPartState; $x.toString = $estr; return $x; };
cloudshift.EPartState.Stopped = ["Stopped",1];
cloudshift.EPartState.Stopped.toString = $estr;
cloudshift.EPartState.Stopped.__enum__ = cloudshift.EPartState;
cloudshift.Part = $hxClasses["cloudshift.Part"] =  function() { };
cloudshift.Part.__name__ = ["cloudshift","Part"];
cloudshift.Part.prototype.part_ = null;
cloudshift.Part.prototype.start_ = null;
cloudshift.Part.prototype.stop_ = null;
cloudshift.Part.prototype.__class__ = cloudshift.Part;
cloudshift.Core = $hxClasses["cloudshift.Core"] =  function() { };
cloudshift.Core.__name__ = ["cloudshift","Core"];
cloudshift.Core.future = function() {
	return new cloudshift.core.FutureImpl();
};
cloudshift.Core.outcome = function(cancel) {
	return new cloudshift.core.FutureImpl();
};
cloudshift.Core.waitFor = function(toJoin) {
	return cloudshift.core.FutureImpl.waitFor(toJoin);
};
cloudshift.Core.cancelledFuture = function() {
	return cloudshift.core.FutureImpl.dead();
};
cloudshift.Core.event = function() {
	return new cloudshift.core.ObservableImpl();
};
cloudshift.Core.part = function(parent) {
	return new cloudshift.core.PartBaseImpl(parent);
};
cloudshift.Core.toOption = function(t) {
	return t == null?cloudshift.Option.None:cloudshift.Option.Some(t);
};
cloudshift.Core.logTo = function(fileName) {
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
	return JSON.parse(str);
};
cloudshift.Core.stringify = function(obj) {
	return JSON.stringify(obj);
};
cloudshift.Core.prototype.__class__ = cloudshift.Core;
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
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
Btc = $hxClasses["Btc"] =  function() { };
Btc.__name__ = ["Btc"];
Btc.main = function() {
	var btc = new cloudshift.Bitcoin("localhost",8332,"ritchie","elena");
	cloudshift.OutcomeX.outcome(btc.balance(),function(b) {
		haxe.Log.trace("balance = " + b,{ fileName : "Btc.hx", lineNumber : 14, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.transaction("a2fca474dc815873806f800f8dd5b5fd0b5ee4396bc1537c7e1ae96377a2f7a9"),function(trans) {
		haxe.Log.trace(trans,{ fileName : "Btc.hx", lineNumber : 20, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.account("151ubHvkw8f9eLHWddMSv4ex8zk8hEYhtu"),function(account) {
		haxe.Log.trace("account=" + account,{ fileName : "Btc.hx", lineNumber : 24, className : "Btc", methodName : "main"});
		cloudshift.OutcomeX.outcome(btc.listReceivedByAccount(null,null,account),function(res) {
			haxe.Log.trace("------------------------",{ fileName : "Btc.hx", lineNumber : 26, className : "Btc", methodName : "main"});
			var _g = 0;
			while(_g < res.length) {
				var t = res[_g];
				++_g;
				haxe.Log.trace(t.account + ": " + t.amount,{ fileName : "Btc.hx", lineNumber : 28, className : "Btc", methodName : "main"});
			}
			haxe.Log.trace("------------------------",{ fileName : "Btc.hx", lineNumber : 30, className : "Btc", methodName : "main"});
		});
	});
	cloudshift.OutcomeX.outcome(btc.addressesByAccount("From tradehill"),function(res) {
		haxe.Log.trace(res,{ fileName : "Btc.hx", lineNumber : 42, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.blockCount(),function(res) {
		haxe.Log.trace("blockcount = " + res,{ fileName : "Btc.hx", lineNumber : 46, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.connectionCount(),function(res) {
		haxe.Log.trace("connection count = " + res,{ fileName : "Btc.hx", lineNumber : 50, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.difficulty(),function(res) {
		haxe.Log.trace("difficulty = " + res,{ fileName : "Btc.hx", lineNumber : 54, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.generate(),function(res) {
		haxe.Log.trace("generating = " + res,{ fileName : "Btc.hx", lineNumber : 58, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.hashesPerSec(),function(res) {
		haxe.Log.trace("hashes persec = " + res,{ fileName : "Btc.hx", lineNumber : 62, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.info(),function(res) {
		haxe.Log.trace("info=" + cloudshift.Core.stringify(res),{ fileName : "Btc.hx", lineNumber : 66, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.receivedByAccount("elena@ritchie.com"),function(res) {
		haxe.Log.trace("recieved by elena=" + res,{ fileName : "Btc.hx", lineNumber : 76, className : "Btc", methodName : "main"});
	});
	cloudshift.OutcomeX.outcome(btc.transactionsSinceBlock("169110"),function(listsince) {
		var _g = 0, _g1 = listsince.transactions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			haxe.Log.trace("--> " + t.amount + " " + t.account,{ fileName : "Btc.hx", lineNumber : 82, className : "Btc", methodName : "main"});
		}
	});
};
Btc.prototype.__class__ = Btc;
Std = $hxClasses["Std"] =  function() { };
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
};
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	if(x < 0) return Math.ceil(x);
	return Math.floor(x);
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
cloudshift.Mixin = $hxClasses["cloudshift.Mixin"] =  function() { };
cloudshift.Mixin.__name__ = ["cloudshift","Mixin"];
cloudshift.Mixin.error = function(msg) {
	throw msg;
	return null;
};
cloudshift.Mixin.prototype.__class__ = cloudshift.Mixin;
cloudshift.DynamicX = $hxClasses["cloudshift.DynamicX"] =  function() { };
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
cloudshift.BoolX = $hxClasses["cloudshift.BoolX"] =  function() { };
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
cloudshift.IntX = $hxClasses["cloudshift.IntX"] =  function() { };
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
cloudshift.FloatX = $hxClasses["cloudshift.FloatX"] =  function() { };
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
	return Std["int"](v);
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
	return Std["int"](v * 98317);
};
cloudshift.FloatX.prototype.__class__ = cloudshift.FloatX;
cloudshift.StringX = $hxClasses["cloudshift.StringX"] =  function() { };
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
cloudshift.DateX = $hxClasses["cloudshift.DateX"] =  function() { };
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
cloudshift.ArrayX = $hxClasses["cloudshift.ArrayX"] =  function() { };
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
cloudshift.HashX = $hxClasses["cloudshift.HashX"] =  function() { };
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
cloudshift.OptionX = $hxClasses["cloudshift.OptionX"] =  function() { };
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
	return (function($this) {
		var $r;
		var $e = (o);
		switch( $e[1] ) {
		case 0:
			$r = null;
			break;
		case 1:
			var v = $e[2];
			$r = f(v);
			break;
		}
		return $r;
	}(this));
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
cloudshift.EitherX = $hxClasses["cloudshift.EitherX"] =  function() { };
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
cloudshift.PartX = $hxClasses["cloudshift.PartX"] =  function() { };
cloudshift.PartX.__name__ = ["cloudshift","PartX"];
cloudshift.PartX.start = function(part,data,oc) {
	return part.part_.start(data,oc);
};
cloudshift.PartX.stop = function(part,data) {
	return part.part_.stop(data);
};
cloudshift.PartX.observe = function(part,cb) {
	part.part_.observe(cb);
};
cloudshift.PartX.notify = function(part,e) {
	part.part_.notify(e);
};
cloudshift.PartX.partID = function(part) {
	return part.part_.partID;
};
cloudshift.PartX.observeState = function(part,cb) {
	part.part_._events.observe(cb);
};
cloudshift.PartX.prototype.__class__ = cloudshift.PartX;
cloudshift.OutcomeX = $hxClasses["cloudshift.OutcomeX"] =  function() { };
cloudshift.OutcomeX.__name__ = ["cloudshift","OutcomeX"];
cloudshift.OutcomeX.outcome = function(oc,cb,err) {
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))); else if(err != null) err(cloudshift.OptionX.get(cloudshift.EitherX.left(either))); else cloudshift.core.LogImpl.error(Std.string(cloudshift.OptionX.get(cloudshift.EitherX.left(either))),"",{ fileName : "Mixin.hx", lineNumber : 656, className : "cloudshift.OutcomeX", methodName : "outcome"});
	});
};
cloudshift.OutcomeX.oflatMap = function(oc,cb,err) {
	var roc = new cloudshift.core.FutureImpl();
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) cloudshift.OutcomeX.outcome(cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))),function(val) {
			roc.resolve(cloudshift.Either.Right(val));
		},err); else {
			cloudshift.core.LogImpl.error(Std.string(cloudshift.OptionX.get(cloudshift.EitherX.left(either))),"",{ fileName : "Mixin.hx", lineNumber : 671, className : "cloudshift.OutcomeX", methodName : "oflatMap"});
			cloudshift.Sys.exit(1);
		}
	});
	return roc;
};
cloudshift.OutcomeX.omap = function(oc,cb,err) {
	var roc = new cloudshift.core.FutureImpl();
	oc.deliver(function(either) {
		if(cloudshift.EitherX.isRight(either)) roc.resolve(cloudshift.Either.Right(cb(cloudshift.OptionX.get(cloudshift.EitherX.right(either))))); else if(err != null) err(cloudshift.OptionX.get(cloudshift.EitherX.left(either)));
	});
	return roc;
};
cloudshift.OutcomeX.prototype.__class__ = cloudshift.OutcomeX;
cloudshift.HttpEvents = $hxClasses["cloudshift.HttpEvents"] = { __ename__ : ["cloudshift","HttpEvents"], __constructs__ : ["Connection","CheckContinue","Upgrade","ClientError","Close"] };
cloudshift.HttpEvents.CheckContinue = ["CheckContinue",1];
cloudshift.HttpEvents.CheckContinue.toString = $estr;
cloudshift.HttpEvents.CheckContinue.__enum__ = cloudshift.HttpEvents;
cloudshift.HttpEvents.Connection = ["Connection",0];
cloudshift.HttpEvents.Connection.toString = $estr;
cloudshift.HttpEvents.Connection.__enum__ = cloudshift.HttpEvents;
cloudshift.HttpEvents.Close = ["Close",4];
cloudshift.HttpEvents.Close.toString = $estr;
cloudshift.HttpEvents.Close.__enum__ = cloudshift.HttpEvents;
cloudshift.HttpEvents.Upgrade = ["Upgrade",2];
cloudshift.HttpEvents.Upgrade.toString = $estr;
cloudshift.HttpEvents.Upgrade.__enum__ = cloudshift.HttpEvents;
cloudshift.HttpEvents.ClientError = ["ClientError",3];
cloudshift.HttpEvents.ClientError.toString = $estr;
cloudshift.HttpEvents.ClientError.__enum__ = cloudshift.HttpEvents;
cloudshift.HttpServer = $hxClasses["cloudshift.HttpServer"] =  function() { };
cloudshift.HttpServer.__name__ = ["cloudshift","HttpServer"];
cloudshift.HttpServer.prototype.fields = null;
cloudshift.HttpServer.prototype.serve = null;
cloudshift.HttpServer.prototype.serveNoCache = null;
cloudshift.HttpServer.prototype.handler = null;
cloudshift.HttpServer.prototype.notFound = null;
cloudshift.HttpServer.prototype.index = null;
cloudshift.HttpServer.prototype.serverName = null;
cloudshift.HttpServer.prototype.root = null;
cloudshift.HttpServer.prototype.__class__ = cloudshift.HttpServer;
cloudshift.HttpServer.__interfaces__ = [cloudshift.Part];
cloudshift.Http = $hxClasses["cloudshift.Http"] =  function() { };
cloudshift.Http.__name__ = ["cloudshift","Http"];
cloudshift.Http.server = function() {
	return new cloudshift.http.HttpImpl();
};
cloudshift.Http.get = function(url,params,headers) {
	var oc = new cloudshift.core.FutureImpl(), pu = js.Node.url.parse(url), client = js.Node.http.createClient(Std.parseInt(pu.port == null?"80":pu.port),pu.hostname), myheaders = { host : pu.hostname}, request;
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
			resp.b[resp.b.length] = chunk == null?"null":chunk;
		});
		response.on("end",function() {
			oc.resolve(cloudshift.Either.Right(resp.b.join("")));
		});
	});
	if(params != null) request.end(js.Node.queryString.stringify(params)); else request.end();
	return oc;
};
cloudshift.Http.post = function(url,payload,urlEncoded,headers) {
	if(urlEncoded == null) urlEncoded = true;
	var oc = new cloudshift.core.FutureImpl(), pu = js.Node.url.parse(url), client = js.Node.http.createClient(Std.parseInt(pu.port == null?"80":pu.port),pu.hostname), myheaders = { host : pu.hostname}, request;
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
			resp.b[resp.b.length] = chunk == null?"null":chunk;
		});
		response.on("end",function() {
			oc.resolve(cloudshift.Either.Right(resp.b.join("")));
		});
	});
	if(urlEncoded) request.end(js.Node.queryString.stringify(payload)); else request.end(payload);
	return oc;
};
cloudshift.Http.prototype.__class__ = cloudshift.Http;
ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
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
Type = $hxClasses["Type"] =  function() { };
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
	if(args.length <= 3) return new cl(args[0],args[1],args[2]);
	if(args.length > 8) throw "Too many arguments";
	return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
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
js.Boot = $hxClasses["js.Boot"] =  function() { };
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	js.Node.console.log(msg);
};
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
};
js.Boot.__closure = function(o,f) {
	var m = o[f];
	if(m == null) return null;
	var f1 = function() {
		return m.apply(o,arguments);
	};
	f1.scope = o;
	f1.method = m;
	return f1;
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
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__") {
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
		if(x != x) return null;
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
	$closure = js.Boot.__closure;
};
js.Boot.prototype.__class__ = js.Boot;
EReg = $hxClasses["EReg"] =  function(r,opt) {
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
cloudshift.http.HttpImpl = $hxClasses["cloudshift.http.HttpImpl"] =  function() {
	this._routes = [];
	this._index = "index.html";
	this._root = null;
	this._serverName = "Cloudshift 0.2.3";
	this._getHandler = this.defaultGetHandler.$bind(this);
	this._cache = new Hash();
	this.part_ = cloudshift.Core.part(this);
};
cloudshift.http.HttpImpl.__name__ = ["cloudshift","http","HttpImpl"];
cloudshift.http.HttpImpl._formidable = null;
cloudshift.http.HttpImpl.parseFields = function(req,cb,uploadDir) {
	var form = new cloudshift.http.HttpImpl._formidable.IncomingForm(), fields = new Hash(), files = null;
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
cloudshift.http.HttpImpl.UTCString = function(d) {
	return d.toUTCString();
};
cloudshift.http.HttpImpl.parse = function(d) {
	return Date.parse(d);
};
cloudshift.http.HttpImpl.prototype.part_ = null;
cloudshift.http.HttpImpl.prototype._server = null;
cloudshift.http.HttpImpl.prototype._cache = null;
cloudshift.http.HttpImpl.prototype._getHandler = null;
cloudshift.http.HttpImpl.prototype._routes = null;
cloudshift.http.HttpImpl.prototype._notFound = null;
cloudshift.http.HttpImpl.prototype._index = null;
cloudshift.http.HttpImpl.prototype._root = null;
cloudshift.http.HttpImpl.prototype._serverName = null;
cloudshift.http.HttpImpl.prototype.start_ = function(d,oc) {
	var me = this;
	if(oc == null) oc = new cloudshift.core.FutureImpl();
	this._server = js.Node.http.createServer(function(req,resp) {
		var url = req.url, match = false;
		if(me._routes != null) {
			var _g = 0, _g1 = me._routes;
			while(_g < _g1.length) {
				var r = _g1[_g];
				++_g;
				if(r.re.match(url)) {
					match = true;
					try {
						r.handler(r.re,req,resp);
					} catch( ex ) {
						cloudshift.Core.log(cloudshift.ELogLevel.E("handler exp:" + ex),null,{ fileName : "HttpImpl.hx", lineNumber : 76, className : "cloudshift.http.HttpImpl", methodName : "start_"});
					}
					break;
				}
			}
		}
		if(!match && me._root != null) {
			if(req.method == "GET") {
				if(url == "/") url = me._index;
				me._getHandler(url,req,resp,200);
			}
		}
	});
	cloudshift.Core.log(cloudshift.ELogLevel.I("Starting " + this._serverName + " on " + d.host + ":" + d.port),null,{ fileName : "HttpImpl.hx", lineNumber : 92, className : "cloudshift.http.HttpImpl", methodName : "start_"});
	this._server.listen(d.port,d.host,function() {
		oc.resolve(cloudshift.Either.Right((function($this) {
			var $r;
			var $t = me;
			if(Std["is"]($t,cloudshift.HttpServer)) $t; else throw "Class cast error";
			$r = $t;
			return $r;
		}(this))));
	});
	return oc;
};
cloudshift.http.HttpImpl.prototype.stop_ = function(d) {
	var p = new cloudshift.core.FutureImpl();
	this._server.close();
	p.resolve(cloudshift.Either.Right(this));
	return p;
};
cloudshift.http.HttpImpl.prototype.handler = function(r,handler) {
	this._routes.push({ re : r, handler : handler});
	return this;
};
cloudshift.http.HttpImpl.prototype.notFound = function(nf) {
	this._notFound = nf;
	return this;
};
cloudshift.http.HttpImpl.prototype.index = function(indexFile) {
	this._index = indexFile;
	return this;
};
cloudshift.http.HttpImpl.prototype.serverName = function(serverName) {
	this._serverName = serverName;
	return this;
};
cloudshift.http.HttpImpl.prototype.root = function(rootDir) {
	this._root = !cloudshift.StringX.endsWith(rootDir,"/")?rootDir + "/":null;
	this._getHandler = this.serve.$bind(this);
	return this;
};
cloudshift.http.HttpImpl.prototype.defaultGetHandler = function(path,req,resp,statusCode) {
	this.do404(req,resp);
};
cloudshift.http.HttpImpl.prototype.fields = function(req,cb,uploadDir) {
	if(uploadDir == null) uploadDir = "/tmp";
	cloudshift.http.HttpImpl.parseFields(req,cb,uploadDir);
};
cloudshift.http.HttpImpl.prototype.serve = function(path,req,resp,statusCode) {
	if(statusCode == null) statusCode = 200;
	var me = this;
	var fileToServe = this._root != null?this._root + path:path;
	js.Node.fs.stat(fileToServe,function(e,stat) {
		if(e != null) {
			me.do404(req,resp);
			return;
		}
		var mtime = Date.fromString(new String(stat.mtime)), fmtime = mtime.getTime(), size = stat.size, eTag = js.Node.stringify([stat.ino,size,mtime].join("-")), modified = false;
		if(Reflect.field(req.headers,"if-none-match") == eTag) {
			resp.statusCode = 304;
			me.headers(resp,size,path,eTag,mtime);
			resp.end();
			return;
		}
		if(stat.isFile()) {
			resp.statusCode = statusCode;
			me.headers(resp,size,path,eTag,mtime);
			me.serveFromCache(resp,fileToServe,stat,fmtime);
		} else if(stat.isDirectory()) me.do404(req,resp); else me.do404(req,resp);
	});
};
cloudshift.http.HttpImpl.prototype.serveNoCache = function(path,req,resp,statusCode) {
	if(statusCode == null) statusCode = 200;
	var me = this;
	var fileToServe = this._root != null?this._root + path:path;
	js.Node.fs.stat(fileToServe,function(e,stat) {
		if(e != null) {
			me.do404(req,resp);
			return;
		}
		var mtime = Date.fromString(new String(stat.mtime)), size = stat.size;
		if(stat.isFile()) {
			resp.statusCode = statusCode;
			me.headers(resp,size,path,null,mtime);
			resp.setHeader("cache-control","no-cache");
			js.Node.fs.createReadStream(path,cloudshift.http.HttpImpl.readStreamOpt).pipe(resp);
		} else if(stat.isDirectory()) me.do404(req,resp); else me.do404(req,resp);
	});
};
cloudshift.http.HttpImpl.prototype.do404 = function(req,resp) {
	if(this._notFound != null) this._notFound(req,resp);
};
cloudshift.http.HttpImpl.prototype.headers = function(resp,size,path,etag,mtime) {
	resp.setHeader("Content-Length",size);
	resp.setHeader("Content-Type",Reflect.field(cloudshift.http.Mime.types,js.Node.path.extname(path).substr(1)));
	resp.setHeader("Date",cloudshift.http.HttpImpl.UTCString(Date.now()));
	if(etag != null) resp.setHeader("ETag",etag);
	resp.setHeader("Last-Modified",cloudshift.http.HttpImpl.UTCString(mtime));
	resp.setHeader("Server",this._serverName);
};
cloudshift.http.HttpImpl.prototype.serveFromCache = function(resp,path,stat,mtime) {
	var cached = this._cache.get(path);
	if(cached == null) this.pipeFile(resp,path,stat,mtime); else if(cached.mtime < mtime) this.pipeFile(resp,path,stat,mtime); else resp.end(cached.buf);
};
cloudshift.http.HttpImpl.prototype.pipeFile = function(resp,path,stat,mtime) {
	var buf = new Buffer(stat.size), offset = 0;
	this._cache.set(path,{ mtime : mtime, buf : buf});
	js.Node.fs.createReadStream(path,cloudshift.http.HttpImpl.readStreamOpt).on("error",function(err) {
		js.Node.console.error(err);
	}).on("data",function(chunk) {
		chunk.copy(buf,offset);
		offset += chunk.length;
	}).on("close",function() {
	}).pipe(resp);
};
cloudshift.http.HttpImpl.prototype.__class__ = cloudshift.http.HttpImpl;
cloudshift.http.HttpImpl.__interfaces__ = [cloudshift.Part,cloudshift.HttpServer];
cloudshift.core.LogImpl = $hxClasses["cloudshift.core.LogImpl"] =  function() { };
cloudshift.core.LogImpl.__name__ = ["cloudshift","core","LogImpl"];
cloudshift.core.LogImpl.format = function(type,msg,cat,inf) {
	var pos = "";
	if(inf != null) {
		if(inf.fileName != "Log.hx") pos = inf.fileName + ":" + inf.lineNumber;
	}
	var d = Date.now();
	var category = cat != ""?"|" + cat:cat;
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	return "[" + type + "|" + time + "|" + pos + category + "] " + Std.string(msg);
};
cloudshift.core.LogImpl.myTrace = function(v,inf) {
	cloudshift.core.LogImpl.debug(v,"",inf);
};
cloudshift.core.LogImpl.init = function(fileName) {
	if(fileName != null) cloudshift.core.LogImpl.logFileFD = js.Node.fs.openSync(fileName,"a+",438); else cloudshift.core.LogImpl.logFileFD = -1;
};
cloudshift.core.LogImpl.write = function(msg,type) {
	if(msg != null) {
		if(cloudshift.core.LogImpl.logFileFD != -1) {
			var b = new Buffer(msg + "\n","utf8");
			js.Node.fs.write(cloudshift.core.LogImpl.logFileFD,b,0,b.length,null);
		} else {
			console.log(msg);
		}
	}
};
cloudshift.core.LogImpl.doTrace = function(type,category,msg,inf) {
	if(type == "error") msg = msg + "\n" + haxe.Stack.toString(haxe.Stack.exceptionStack());
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
cloudshift.sys.ChildProcessImpl = $hxClasses["cloudshift.sys.ChildProcessImpl"] =  function(cp) {
	var me = this;
	cloudshift.core.ObservableImpl.call(this);
	this._childProc = cp;
	this._stdin = new cloudshift.sys.WriteStreamImpl(cp.stdin);
	this._stdout = new cloudshift.sys.ReadStreamImpl(cp.stdout);
	this._stderr = new cloudshift.sys.ReadStreamImpl(cp.stderr);
	this._childProc.addListener("exit",function(code,sig) {
		me.notify(cloudshift.SysChildProcessEvents.Exit(code,sig));
	});
};
cloudshift.sys.ChildProcessImpl.__name__ = ["cloudshift","sys","ChildProcessImpl"];
cloudshift.sys.ChildProcessImpl.__super__ = cloudshift.core.ObservableImpl;
for(var k in cloudshift.core.ObservableImpl.prototype ) cloudshift.sys.ChildProcessImpl.prototype[k] = cloudshift.core.ObservableImpl.prototype[k];
cloudshift.sys.ChildProcessImpl.spawn = function(command,args,options) {
	var oc = new cloudshift.core.FutureImpl();
	var forTyper = new cloudshift.sys.ChildProcessImpl(js.Node.childProcess.spawn(command,args,options));
	oc.resolve(cloudshift.Either.Right(forTyper));
	return oc;
};
cloudshift.sys.ChildProcessImpl.exec = function(command,options,cb) {
	var oc = new cloudshift.core.FutureImpl(), child = js.Node.childProcess.exec(command,options,function(err,so,se) {
		if(err != null) oc.resolve(cloudshift.Either.Left({ code : err.code, stderr : new String(se)})); else oc.resolve(cloudshift.Either.Right(new String(so)));
	});
	if(cb != null) cb(new cloudshift.sys.ChildProcessImpl(child));
	return oc;
};
cloudshift.sys.ChildProcessImpl.execFile = function(command,options,cb) {
	var oc = new cloudshift.core.FutureImpl(), child = js.Node.childProcess.execFile(command,options,function(err,so,se) {
		if(err != null) oc.resolve(cloudshift.Either.Left({ code : err.code, stderr : new String(se)})); else oc.resolve(cloudshift.Either.Right(new String(so)));
	});
	if(cb != null) cb(new cloudshift.sys.ChildProcessImpl(child));
	return oc;
};
cloudshift.sys.ChildProcessImpl.prototype.stdin = null;
cloudshift.sys.ChildProcessImpl.prototype.stdout = null;
cloudshift.sys.ChildProcessImpl.prototype.stderr = null;
cloudshift.sys.ChildProcessImpl.prototype.pid = null;
cloudshift.sys.ChildProcessImpl.prototype._childProc = null;
cloudshift.sys.ChildProcessImpl.prototype._stdin = null;
cloudshift.sys.ChildProcessImpl.prototype._stdout = null;
cloudshift.sys.ChildProcessImpl.prototype._stderr = null;
cloudshift.sys.ChildProcessImpl.prototype.getStdIn = function() {
	return this._stdin;
};
cloudshift.sys.ChildProcessImpl.prototype.getStdOut = function() {
	return this._stdout;
};
cloudshift.sys.ChildProcessImpl.prototype.getStdErr = function() {
	return this._stderr;
};
cloudshift.sys.ChildProcessImpl.prototype.getPid = function() {
	return this._childProc.pid;
};
cloudshift.sys.ChildProcessImpl.prototype.kill = function(signal) {
};
cloudshift.sys.ChildProcessImpl.prototype.__class__ = cloudshift.sys.ChildProcessImpl;
cloudshift.sys.ChildProcessImpl.__interfaces__ = [cloudshift.SysChildProcess];
cloudshift.sys.ReadStreamImpl = $hxClasses["cloudshift.sys.ReadStreamImpl"] =  function(rs) {
	var me = this;
	cloudshift.core.ObservableImpl.call(this);
	this._readStream = rs;
	this._readStream.addListener("data",function(d) {
		me.notify(cloudshift.SysReadStreamEvents.Data(new String(d)));
	});
	this._readStream.addListener("end",function() {
		me.notify(cloudshift.SysReadStreamEvents.End);
	});
	this._readStream.addListener("error",function(exception) {
		me.notify(cloudshift.SysReadStreamEvents.Error(new String(exception)));
	});
	this._readStream.addListener("close",function() {
		me.notify(cloudshift.SysReadStreamEvents.Close);
	});
};
cloudshift.sys.ReadStreamImpl.__name__ = ["cloudshift","sys","ReadStreamImpl"];
cloudshift.sys.ReadStreamImpl.__super__ = cloudshift.core.ObservableImpl;
for(var k in cloudshift.core.ObservableImpl.prototype ) cloudshift.sys.ReadStreamImpl.prototype[k] = cloudshift.core.ObservableImpl.prototype[k];
cloudshift.sys.ReadStreamImpl.prototype._readStream = null;
cloudshift.sys.ReadStreamImpl.prototype.readable = null;
cloudshift.sys.ReadStreamImpl.prototype.getReadable = function() {
	return this._readStream.readable;
};
cloudshift.sys.ReadStreamImpl.prototype.pause = function() {
	this._readStream.pause();
};
cloudshift.sys.ReadStreamImpl.prototype.resume = function() {
	this._readStream.resume();
};
cloudshift.sys.ReadStreamImpl.prototype.destroy = function() {
	this._readStream.destroy();
};
cloudshift.sys.ReadStreamImpl.prototype.destroySoon = function() {
	this._readStream.destroySoon();
};
cloudshift.sys.ReadStreamImpl.prototype.setEncoding = function(enc) {
	this._readStream.setEncoding(enc);
};
cloudshift.sys.ReadStreamImpl.prototype.pipe = function(dest,opts) {
	this._readStream.pipe(dest.getNodeWriteStream(),opts);
};
cloudshift.sys.ReadStreamImpl.prototype.getNodeReadStream = function() {
	return this._readStream;
};
cloudshift.sys.ReadStreamImpl.prototype.__class__ = cloudshift.sys.ReadStreamImpl;
cloudshift.sys.ReadStreamImpl.__interfaces__ = [cloudshift.SysReadStream];
Hash = $hxClasses["Hash"] =  function() {
	this.h = {}
	if(this.h.__proto__ != null) {
		this.h.__proto__ = null;
		delete(this.h.__proto__);
	}
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
	try {
		key = "$" + key;
		return this.hasOwnProperty.call(this.h,key);
	} catch( e ) {
		for(var i in this.h) if( i == key ) return true;
		return false;
	}
};
Hash.prototype.remove = function(key) {
	if(!this.exists(key)) return false;
	delete(this.h["$" + key]);
	return true;
};
Hash.prototype.keys = function() {
	var a = new Array();
	for(var i in this.h) a.push(i.substr(1));
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
$_ = {};
js.Boot.__res = {};
js.Boot.__init();
(function($this) {
	var $r;
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
	$r = js.Node.cluster = js.Node.require("cluster");
	return $r;
}(this));
(function($this) {
	var $r;
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
	$r = d.__name__ = ["Date"];
	return $r;
}(this));
(function($this) {
	var $r;
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	Bool = $hxClasses["Bool"] = { __ename__ : ["Bool"]};
	Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	Enum = { };
	$r = Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
	return $r;
}(this));
(function($this) {
	var $r;
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	$r = Math.isNaN = function(i) {
		return isNaN(i);
	};
	return $r;
}(this));
cloudshift.http.HttpImpl._formidable = js.Node.require("formidable");
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
cloudshift.http.Mime.types = { aiff : "audio/x-aiff", arj : "application/x-arj-compressed", asf : "video/x-ms-asf", asx : "video/x-ms-asx", au : "audio/ulaw", avi : "video/x-msvideo", bcpio : "application/x-bcpio", ccad : "application/clariscad", cod : "application/vnd.rim.cod", com : "application/x-msdos-program", cpio : "application/x-cpio", cpt : "application/mac-compactpro", csh : "application/x-csh", css : "text/css", deb : "application/x-debian-package", dl : "video/dl", doc : "application/msword", drw : "application/drafting", dvi : "application/x-dvi", dwg : "application/acad", dxf : "application/dxf", dxr : "application/x-director", etx : "text/x-setext", ez : "application/andrew-inset", fli : "video/x-fli", flv : "video/x-flv", gif : "image/gif", gl : "video/gl", gtar : "application/x-gtar", gz : "application/x-gzip", hdf : "application/x-hdf", hqx : "application/mac-binhex40", html : "text/html", ice : "x-conference/x-cooltalk", ico : "image/x-icon", ief : "image/ief", igs : "model/iges", ips : "application/x-ipscript", ipx : "application/x-ipix", jad : "text/vnd.sun.j2me.app-descriptor", jar : "application/java-archive", jpeg : "image/jpeg", jpg : "image/jpeg", js : "text/javascript", json : "application/json", latex : "application/x-latex", less : "text/css", lsp : "application/x-lisp", lzh : "application/octet-stream", m : "text/plain", m3u : "audio/x-mpegurl", man : "application/x-troff-man", manifest : "text/cache-manifest", me : "application/x-troff-me", midi : "audio/midi", mif : "application/x-mif", mime : "www/mime", movie : "video/x-sgi-movie", mp4 : "video/mp4", mpg : "video/mpeg", mpga : "audio/mpeg", ms : "application/x-troff-ms", nc : "application/x-netcdf", oda : "application/oda", ogm : "application/ogg", pbm : "image/x-portable-bitmap", pdf : "application/pdf", pgm : "image/x-portable-graymap", pgn : "application/x-chess-pgn", pgp : "application/pgp", pm : "application/x-perl", png : "image/png", pnm : "image/x-portable-anymap", ppm : "image/x-portable-pixmap", ppz : "application/vnd.ms-powerpoint", pre : "application/x-freelance", prt : "application/pro_eng", ps : "application/postscript", qt : "video/quicktime", ra : "audio/x-realaudio", rar : "application/x-rar-compressed", ras : "image/x-cmu-raster", rgb : "image/x-rgb", rm : "audio/x-pn-realaudio", rpm : "audio/x-pn-realaudio-plugin", rtf : "text/rtf", rtx : "text/richtext", scm : "application/x-lotusscreencam", set : "application/set", sgml : "text/sgml", sh : "application/x-sh", shar : "application/x-shar", silo : "model/mesh", sit : "application/x-stuffit", skt : "application/x-koan", smil : "application/smil", snd : "audio/basic", sol : "application/solids", spl : "application/x-futuresplash", src : "application/x-wais-source", stl : "application/SLA", stp : "application/STEP", sv4cpio : "application/x-sv4cpio", sv4crc : "application/x-sv4crc", svg : "image/svg+xml", swf : "application/x-shockwave-flash", tar : "application/x-tar", tcl : "application/x-tcl", tex : "application/x-tex", texinfo : "application/x-texinfo", tgz : "application/x-tar-gz", tiff : "image/tiff", tr : "application/x-troff", tsi : "audio/TSP-audio", tsp : "application/dsptype", tsv : "text/tab-separated-values", txt : "text/plain", unv : "application/i-deas", ustar : "application/x-ustar", vcd : "application/x-cdlink", vda : "application/vda", vivo : "video/vnd.vivo", vrm : "x-world/x-vrml", wav : "audio/x-wav", wax : "audio/x-ms-wax", wma : "audio/x-ms-wma", wmv : "video/x-ms-wmv", wmx : "video/x-ms-wmx", wrl : "model/vrml", wvx : "video/x-ms-wvx", xbm : "image/x-xbitmap", xlw : "application/vnd.ms-excel", xml : "text/xml", xpm : "image/x-xpixmap", xwd : "image/x-xwindowdump", xyz : "chemical/x-pdb", zip : "application/zip"};
;
cloudshift.Bitcoin.defaultId = 0;
;
cloudshift.core.ObservableImpl.CLEANUP = 1;
;
cloudshift.Sys._events = new cloudshift.sys.Events();
;
cloudshift.Sys._proc = js.Node.process;
;
cloudshift.Sys._os = js.Node.os;
;
cloudshift.Sys._child = js.Node.childProcess;
;
cloudshift.Core.CSROOT = "/__cs/";
;
cloudshift.http.HttpImpl.readStreamOpt = { flags : "r", mode : 666};
;
cloudshift.core.LogImpl.logFileFD = -1;
;
Btc.main();
