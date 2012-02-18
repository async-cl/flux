
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

interface Outcome<A,B>  {
  function onError(cb:A->Void):Outcome<A,B>;
  function resolve(d:Either<A,B>):Void;
  function flatMap<T>(cb:B->Outcome<A,T>):Outcome<A,T>;
  function map<T>(cb:B->T):Outcome<A,T>;
  function deliver(cb:B->Void):Outcome<A,B>;
  function future():Future<Either<A,B>>;
  function cancel():Void;  
}

enum EOperation {
  Add(info:Option<Dynamic>);
  Del(info:Option<Dynamic>);
}

enum ELogLevel {
  I(s:String);
  W(s:String);
  E(s:String);
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
  var sequence:Int;
  function resolve(t: T): Future<T>;
  function deliver(f: T -> Void): Future<T>;
  function deliverMe(f:Future<T>-> Void): Future<T>;
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

enum EPartState<E> {
  Started;
  Stopped;
  Event(event:E);
  Error(msg:String);
  Except(e:Dynamic);
}

interface Part_<S,R,E> {
  var _events:Observable<EPartState<E>>;
  var partID(default,null):String;
  function start(d:S):Outcome<String,R>;
  function stop(d:Dynamic):Outcome<String,Dynamic>;
  function observe(cb:E->Void,?info:Dynamic):Void->Void;
  function notify(e:E):Void;
  function observeState(cb:EPartState<E>->Void):Void;
  function notifyState(s:EPartState<E>):Void;
  function peer():Dynamic;
}

interface Part<S,R,E> {
  var part_:Part_<S,R,E>;
  function start_(p:S):Outcome<String,R>;
  function stop_(?d:Dynamic):Outcome<String,Dynamic>;
}

typedef AnyPart = Part<Dynamic,Dynamic,Dynamic>;

class Core {

  public static var CSROOT = "/__cs/";
  
  public static function
  future<T>():Future<T> {
    return new cloudshift.core.FutureImpl();
  }

  public static function
  outcome<A,B>(?cancel:A->Void):Outcome<A,B> {
    return new cloudshift.core.OutcomeImpl(cancel);
  }

  public static function
  waitFor(toJoin:Array<Future<Dynamic>>):Future<Array<Dynamic>> {
    return cloudshift.core.FutureImpl.waitFor(toJoin);
  }

  public static function
  waitOutcomes(toJoin:Array<Outcome<Dynamic,Dynamic>>):Outcome<String,Array<Dynamic>> {
    return cloudshift.core.OutcomeImpl.waitFor(toJoin);
  }
  
  public static function cancelledFuture() {
    return cloudshift.core.FutureImpl.dead();
  }
  
  public static function
  event<T>():Observable<T> {
    return new cloudshift.core.ObservableImpl();
  }

  public static function
  part<S,R,E>(parent:Dynamic):Part_<S,R,E> {
    return new cloudshift.core.PartBaseImpl(parent);
  }
  
  public static function
  toOption<T>(t:T):Option<T> {
    return if (t == null) None; else Some(t);
  }

  inline static public function
  logTo(?fileName:String) {
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
  
}

