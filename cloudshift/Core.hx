
package cloudshift;

import cloudshift.core.LogImpl;
using cloudshift.Mixin;

typedef Thunk<T> = Void -> T;
typedef HostPort = {host:String,port:Int};

enum Option<T> {
  None;
  Some(v: T);
}

enum Either<A, B> {
  Left(v: A);
  Right(v: B);
}

enum ELogLevel {
  I(s:String);
  W(s:String);
  E(s:String);
}

enum EOperation {
  Add(info:Option<Dynamic>);
  Del(info:Option<Dynamic>);
}

interface Observable<T> {
  var  preNotify:T->Dynamic;
  function notify(o:T):Void;
  function observe(cb:T->Void,?info:Dynamic):Void->Void;
  function peers():Array<Dynamic>;
  function removePeers():Void;
  function peek(cb:EOperation->Void):Void;
}

interface Future<T> {
  function resolve(t: T): Future<T>;
  function deliver(f: T -> Void): Future<T>;
  function isCanceled(): Bool;
  function ifCanceled(f: Void -> Void): Future<T>;
  function allowCancelOnlyIf(f: Void -> Bool): Future<T>;
  function cancel(): Bool;
  function isDone(): Bool;
  function isDelivered(): Bool;
  function map<S>(f: T -> S): Future<S>;
  function flatMap<S>(f: T -> Future<S>): Future<S>;
  function filter(f: T -> Bool): Future<T>;
  function value(): Option<T>;
  function toOption(): Option<T>;
  function toArray(): Array<T>;
}

typedef Outcome<A,B> = Future<Either<A,B>>;

enum EPartState<E> {
  Started;
  Stopped;
  Event(event:E);
  Error(msg:String);
  Except(e:Dynamic);
}

typedef PartInfo = {
    var name:String;
    var ver:String;
    var auth:String;
}

// (S) start param object, (B) bad return type, (G) good return type, (E) event enum
interface Part_<S,B,G,E> {
  var _events:Observable<EPartState<E>>;
  var partID(default,null):String;
  var state:EPartState<E>;
  var info:PartInfo;
  var sstopper:Dynamic->Outcome<String,Dynamic>;
  
  function start(d:S,?oc:Outcome<B,G>):Outcome<B,G>;
  function stop(d:Dynamic):Outcome<String,Dynamic>;
  function observe(cb:E->Void,?info:Dynamic):Void->Void;
  function notify(e:E):Void;
  function observeState(cb:EPartState<E>->Void):Void;
  function notifyState(s:EPartState<E>):Void;
  function peer():Dynamic;
  function setStop(cb:Dynamic->Outcome<String,Dynamic>):Void;
}

interface Part<S,B,G,E> {
  var part_:Part_<S,B,G,E>;
  function start_(p:S,?oc:Outcome<B,G>):Outcome<B,G>;
}

typedef AnyPart = Part<Dynamic,Dynamic,Dynamic,Dynamic>;

class Core {

  public static var CSROOT = "/__cs/";

  public static function
  init() {
    logInit();
    #if nodejs
    Sys.events().observe(function(e) {
        switch(e) {
        case ProcessUncaughtException(exc):
          Core.error("Uncaught exception: "+exc);
          //          Sys.exit(1);
        case ProcessExit:
        case SigInt(sig):
        }
      });
    #end
  }
  
  public static inline function
  future<T>():Future<T> {
    return new cloudshift.core.FutureImpl();
  }

  public static inline function
  outcome<A,B>(?cancel:A->Void):Outcome<A,B> {
    return cast Core.future();
  }

  public static function
  part<S,B,G,E>(parent:Dynamic,?info:PartInfo):Part_<S,B,G,E> {
    return new cloudshift.core.PartBaseImpl(parent,info);
  }

  public static function cancelledFuture() {
    return cloudshift.core.FutureImpl.dead();
  }
  
  public static inline function
  event<T>():Observable<T> {
    return new cloudshift.core.ObservableImpl();
  }
  
  public static function
  toOption<T>(t:T):Option<T> {
    return if (t == null) None; else Some(t);
  }

  inline static public function
  logInit(?fileName:String) {
    LogImpl.init(fileName);
  }

  static public function
  log(l:ELogLevel,category="",?inf:haxe.PosInfos) {
    switch(l) {
    case I(m):
      LogImpl.info(m,category,inf);
    case W(m):
      LogImpl.warn(m,category,inf);
    case E(m):
      LogImpl.error(m,category,inf);
    }
  }

  inline static public function
  info(msg:String,category="",?inf:haxe.PosInfos) {
    LogImpl.info(msg,category,inf);
  }
  
  inline static public function
  warn(msg:String,category="",?inf:haxe.PosInfos) {
    LogImpl.warn(msg,category,inf);
  }
 
  inline static public function
  error(msg:String,category="",?inf:haxe.PosInfos) {
    LogImpl.error(msg,category,inf);
  }

  inline static public function
  debug(msg:String,category="",?inf:haxe.PosInfos) {
    LogImpl.debug(msg,category,inf);
  }

  public static function
  parse(str:String):Dynamic {
    return untyped __js__("JSON.parse(str)");
  }

  public static function
  stringify(obj:Dynamic):String {
    return untyped __js__("JSON.stringify(obj)");
  }

  public static
  function waitOut(toJoin:Array<Outcome<Dynamic,Dynamic>>):Outcome<String,Array<Either<Dynamic,Dynamic>>> {
    var
      count = toJoin.length,
      oc = Core.outcome();
    
    toJoin.foreach(function(xprm:Outcome<Dynamic,Dynamic>) {
        xprm.deliver(function(r:Either<Dynamic,Dynamic>) {
            count--;
            if (count == 0) {
              oc.resolve(Right(toJoin.map(function(el) {
                      var z:Dynamic = untyped el._result;
                      return z;
                    })));
            }
          });
      });
    return oc;
  } 

  public static
  function waitFut(toJoin:Array<Future<Dynamic>>):Future<Array<Dynamic>> {
    var
      count = toJoin.length,
      fut = Core.future();
    
    toJoin.foreach(function(xprm:Future<Dynamic>) {
        if(!Std.is(xprm,Future)) {
          throw "not a future:"+xprm;
        }

        xprm.deliver(function(r:Dynamic) {
            count--;
            if (count == 0) {
              fut.resolve(toJoin.map(function(el) {
                    return el.value().get();
                  }));
            }
          });
      });
    return fut;
  } 

  public static function
  listParts() {
    cloudshift.core.PartBaseImpl.runningParts.foreach(function(p) {
        if (p.info() != null) {
          trace(p.info());
        }
      });    
  }

  public static function
  assert( cond : Bool, ?pos : haxe.PosInfos ) {
    if( !cond ) {
      Core.error("Assert failed in "+pos.className+"::"+pos.methodName,pos);
      #if nodejs
      Sys.exit(1);
      #end
    }
  }
  
}

