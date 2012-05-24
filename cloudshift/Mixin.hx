
// snarfed from Stax, mostly

package cloudshift;

import cloudshift.Core;
import cloudshift.core.LogImpl;
using cloudshift.Mixin;

class Mixin {
  public static function error<T>(msg: String): T { throw msg; return null; }
}

/** An option represents an optional value -- the value may or may not be
 * present. Option is a much safer alternative to null that often enables
 * reduction in code size and increase in code clarity.
 */

class DynamicX {   

  
  public static function into<A, B>(a: A, f: A -> B): B {
    return f(a);
  }
  public static inline function isInstanceOf(o: Dynamic, c: Dynamic): Bool {
    return Std.is(o, c);
  }
  public static function toThunk<T>(t: T): Thunk<T> {
    return function() {
      return t;
    }
  }  

  public static function
  stringify(o:Dynamic):String {
    return untyped __js__("JSON.stringify(o)");
  }

}

class BoolX {
  public static function toInt(v: Bool): Float { return if (v) 1 else 0; }
  
  public static function ifTrue<T>(v: Bool, f: Thunk<T>): Option<T> {
    return if (v) Some(f()) else None;
  }
  
  public static function ifFalse<T>(v: Bool, f: Thunk<T>): Option<T> {
    return if (!v) Some(f()) else None;
  }
  
  public static function ifElse<T>(v: Bool, f1: Thunk<T>, f2: Thunk<T>): T {
    return if (v) f1() else f2();
  }  

  public static function compare(v1 : Bool, v2 : Bool) : Int {
    return if (!v1 && v2) -1 else if (v1 && !v2) 1 else 0;   
  }

  public static function equals(v1 : Bool, v2 : Bool) : Bool {
    return v1 == v2;   
  }
  
  public static function hashCode(v : Bool) : Int {
    return if (v) 786433 else 393241;  
  }

  public static function toString(v : Bool) : String {
    return if (v) "true" else "false";  
  }

}

class IntX {
  public static function max(v1: Int, v2: Int): Int { return if (v2 > v1) v2; else v1; }
  public static function min(v1: Int, v2: Int): Int { return if (v2 < v1) v2; else v1; }
  public static function toBool(v: Int): Bool { return if (v == 0) false else true; }
  public static function toFloat(v: Int): Float { return v; }
  
  public static function to(start: Int, end: Int): Iterable<Int> {
    return {
      iterator: function() {
        var cur = start;
    
        return {
          hasNext: function(): Bool { return cur <= end; },      
          next:    function(): Int  { var next = cur; ++cur; return next; }
        }
      }
    }

  }
  
  public static function until(start: Int, end: Int): Iterable<Int> {
    return to(start, end - 1);
  }  
  public static function compare(v1: Int, v2: Int) : Int {
    return v1 - v2;
  }
  public static function equals(v1: Int, v2: Int) : Bool {
    return v1 == v2;
  }
  public static function toString(v: Int) : String {
    return "" + v;
  }
  public static function hashCode(v: Int) : Int {
    return v * 196613;
  }

}
class FloatX {
  public static function round(v: Float): Int { return Math.round(v); }
  public static function ceil(v: Float): Int { return Math.ceil(v); }
  public static function floor(v: Float): Int { return Math.floor(v); }
  public static function max(v1: Float, v2: Float): Float { return if (v2 > v1) v2; else v1; }
  public static function min(v1: Float, v2: Float): Float { return if (v2 < v1) v2; else v1; }
  public static function toInt(v: Float): Int { return Std.int(v); } 
  public static function compare(v1: Float, v2: Float) {   
    return if (v1 < v2) -1 else if (v1 > v2) 1 else 0;
  }
  public static function equals(v1: Float, v2: Float) {
    return v1 == v2;
  }
  public static function toString(v: Float): String {
    return "" + v;
  }
  public static function hashCode(v: Float) {
    return Std.int(v * 98317); 
  }
}

class StringX {
  public static function toBool(v: String, ?d: Bool): Bool {
    if (v == null) return d;
    
    var vLower = v.toLowerCase();
    
    return (if (vLower == 'false' || v == '0') Some(false) else if (vLower == 'true' || v == '1') Some(true) else None).getOrElseC(d);
  }
  public static function toInt(v: String, ?d: Null<Int>): Int {
    if (v == null) return d;
    
    return Std.parseInt(v).toOption().filter(function(i) return !Math.isNaN(i)).getOrElseC(d);
  }
  public static function toFloat(v: String, ?d: Null<Float>): Float { 
    if (v == null) return d;
    
    return Std.parseFloat(v).toOption().filter(function(i) return !Math.isNaN(i)).getOrElseC(d);
  }
  public static function startsWith(v: String, frag: String): Bool {
    return if (v.length >= frag.length && frag == v.substr(0, frag.length)) true else false;
  }
  public static function endsWith(v: String, frag: String): Bool {
    return if (v.length >= frag.length && frag == v.substr(v.length - frag.length)) true else false;
  }
  public static function urlEncode(v: String): String {
    return StringTools.urlEncode(v);
  }
  public static function urlDecode(v: String): String {
    return StringTools.urlDecode(v);
  }  
  public static function htmlEscape(v: String): String {
    return StringTools.htmlEscape(v);
  }
  public static function htmlUnescape(v: String): String {
    return StringTools.htmlUnescape(v);
  }
  public static function trim(v: String): String {
    return StringTools.trim(v);
  }
  public static function contains(v: String, s: String): Bool {
    return v.indexOf(s) != -1;
  }
  public static function replace( s : String, sub : String, by : String ) : String {
    return StringTools.replace(s, sub, by);
  }    
  public static function compare(v1: String, v2: String) { 
  return (v1 == v2) ? 0 : (v1 > v2 ? 1 : -1);
  }
  public static function equals(v1: String, v2: String) {
    return v1 == v2;
  }
  public static function toString(v: String): String {
    return v;
  }

  public static function
  parse(str:String):Dynamic {
    return untyped __js__("JSON.parse(str)");
  }
  
  public static inline function
  clone(o:Dynamic):Dynamic {
    return untyped __js__("JSON.parse(JSON.stringify(o))");
  }

  inline static public function
  info(msg:String,?inf:haxe.PosInfos) {
    LogImpl.info(msg,inf);
  }

  inline static public function
  warn(msg:String,?inf:haxe.PosInfos) {
    LogImpl.warn(msg,inf);
  }

  inline static public function
  error(msg:String,?inf:haxe.PosInfos) {
    LogImpl.error(msg,inf);
  }

  
}
class DateX {
  public static function compare(v1: Date, v2: Date) {  
    var diff = v1.getTime() - v2.getTime();
      
    return if (diff < 0) -1; else if (diff > 0) 1; else 0;
  }
  public static function equals(v1: Date, v2: Date) {
    return v1.getTime() == v2.getTime();
  }
  public static function toString(v: Date): String {
    return v.toString();
  }

  public static function UTCString(d:Date) : String {
    return untyped __js__("d.toUTCString()");
	}
}

class ArrayX {

  public static function
  stringify<T>(a:Array<T>):String {
    return untyped __js__("JSON.stringify(o)");
  }

  
  public static function filter<T>(a: Array<T>, f: T -> Bool): Array<T> {
    var n: Array<T> = [];
    
    for (e in a)
      if (f(e)) n.push(e);
    
    return n;
  }
  
  public static function size<T>(a: Array<T>): Int {
    return a.length;
  }
  
  public static function indexOf<T>(a: Array<T>, t: T): Int {
    var index = 0;
    
    for (e in a) { 
      if (e == t) return index;
      
      ++index;
    }
    
    return -1;
  }
  
  public static function map<T, S>(a: Array<T>, f: T -> S): Array<S> {
    var n: Array<S> = [];
    
    for (e in a) n.push(f(e));
    
    return n;
  }


  public static function mapi<T, S>(a: Array<T>, f: T->Int -> S): Array<S> {
    var n: Array<S> = [];

    for(i in 0...a.length) n.push(f(a[i],i));
    
    return n;
  }

  
  public static function next<T, S>(a1: Array<T>, a2: Array<S>): Array<S> {
    return a2;
  }
  
  public static function flatMap<T, S>(a: Array<T>, f: T -> Iterable<S>): Array<S> {
    var n: Array<S> = [];
    
    for (e1 in a) {
      for (e2 in f(e1)) n.push(e2);
    }
    
    return n;
  }
  
  public static function foldl<T, Z>(a: Array<T>, z: Z, f: Z -> T -> Z): Z {
    var r = z;
    
    for (e in a) { r = f(r, e); }
    
    return r;
  }
  
  public static function foldr<T, Z>(a: Array<T>, z: Z, f: T -> Z -> Z): Z {
    var r = z;
    
    for (i in 0...a.length) { 
      var e = a[a.length - 1 - i];
      
      r = f(e, r);
    }
    
    return r;
  }
  
  public static function append<T>(a: Array<T>, t: T): Array<T> {
    var copy = snapshot(a);
    
    copy.push(t);
    
    return copy;
  }
  
  public static function snapshot<T>(a: Array<T>): Array<T> {
    return [].concat(a);
  }
  
  public static function first<T>(a: Array<T>): T {
    return a[0];
  }
  
  public static function firstOption<T>(a: Array<T>): Option<T> {
    return if (a.length == 0) None; else Some(a[0]);
  }
  
  public static function last<T>(a: Array<T>): T {
    return a[a.length - 1];
  }
  
  public static function lastOption<T>(a: Array<T>): Option<T> {
    return if (a.length == 0) None; else Some(a[a.length - 1]);
  }
  
  public static function contains<T>(a: Array<T>, t: T): Bool {
    for (e in a) if (t == e) return true;
    
    return false;
  }
  
  public static function foreach<T>(a: Array<T>, f: T -> Void): Array<T> {
    for (e in a) f(e);
    
    return a;
  }  
  public static function take<T>(a: Array<T>, n: Int): Array<T> {
    return a.slice(0, n.min(a.length));
  }
  public static function takeWhile<T>(a: Array<T>, p: T -> Bool): Array<T> {
    var r = [];
    
    for (e in a) {
      if (p(e)) r.push(e); else break;
    }
    
    return r;
  }
  public static function drop<T>(a: Array<T>, n: Int): Array<T> {
    return if (n >= a.length) [] else a.slice(n);
  }
  public static function dropWhile<T>(a: Array<T>, p: T -> Bool): Array<T> {
    var r = [].concat(a);
    
    for (e in a) {
      if (p(e)) r.shift(); else break;
    }
    
    return r;
  }
  
}

class HashX {
  public static function getOption<T>(h:Hash<T>,key:String) {
    var v = h.get(key);
    return (v == null) ? None : Some(v);
  }

  public static function
  values<T>(h:Hash<T>):Array<T> {
    var a = [];
    for (v in h)
      a.push(v);
    return a;
  }

  public static function
  keyArray<T>(h:Hash<T>):Array<String> {
    var a = [];
    for (v in h.keys())
      a.push(v);
    return a;
  }
}

class OptionX {
  public static function toOption<T>(t: T): Option<T> {
    return if (t == null) None; else Some(t);
  }
  
  public static function toArray<T>(o: Option<T>): Array<T> {
    return switch (o) {
      case None:    [];
      case Some(v): [v];
    }
  }
  
  public static function map<T, S>(o: Option<T>, f: T -> S): Option<S> {
    return switch (o) {
      case None: None;
      case Some(v): Some(f(v));
    }
  }
  public static function next<T, S>(o1: Option<T>, o2: Option<S>): Option<S> {
    return o2;
  }
  public static function foreach<T>(o: Option<T>, f: T -> Void): Void {
    switch (o) {
      case None: 
      case Some(v): f(v);
    }
  }
  
  public static function filter<T>(o: Option<T>, f: T -> Bool): Option<T> {
    return switch (o) {
      case None: None;
      case Some(v): if (f(v)) Some(v) else None;
    }
  }
  
  public static function flatMap<T, S>(o: Option<T>, f: T -> Option<S>): Option<S> {
    return flatten(map(o, f));
  }
  
  public static function flatten<T>(o1: Option<Option<T>>): Option<T> {
    return switch (o1) {
      case None: None;
      case Some(o2): o2;
    }
  }
    
  public static function get<T>(o: Option<T>): T {
    return switch (o) {
      case None: Mixin.error("Error: Option is empty");
      case Some(v): v;
    }
  }
  
  public static function orElse<T>(o1: Option<T>, thunk: Thunk<Option<T>>): Option<T> {
    return switch (o1) {
      case None: thunk();
      case Some(v): o1;
    }
  }

    public static function getOrElse<T>(o: Option<T>, thunk: Thunk<T>): T {
    return switch(o) {
      case None: thunk();
      case Some(v): v;
    }
  }

  public static function orElseC<T>(o1: Option<T>, o2: Option<T>): Option<T> {
    return OptionX.orElse(o1, o2.toThunk());
  }


  public static function getOrElseC<T>(o: Option<T>, c: T): T {
    return OptionX.getOrElse(o, c.toThunk());
  }

  public static function orEither<T, S>(o1: Option<T>, thunk: Thunk<S>): Either<S, T> {
    return switch (o1) {
      case None: EitherX.toLeft(thunk());
      case Some(v): EitherX.toRight(v);
    }
  }
  
  public static function orEitherC<T, S>(o1: Option<T>, c: S): Either<S, T> {
    return OptionX.orEither(o1, c.toThunk());
  }

  public static function isEmpty<T>(o: Option<T>): Bool {
    return switch(o) {
      case None:    true;
      case Some(v): false;
    }
  }
}

class EitherX {
  
  public static function toLeft<A, B>(v: A): Either<A, B> {
    return Left(v);
  }
  
  public static function toRight<A, B>(v: B): Either<A, B> {
    return Right(v);
  }
  
  public static function flip<A, B>(e: Either<A, B>): Either<B, A> {
    return switch(e) {
      case Left(v): Right(v);
      case Right(v): Left(v);
    }
  }
  
  public static function left<A, B>(e: Either<A, B>): Option<A> {
    return switch (e) {
      case Left(v): Some(v);
      
      default: None;
    }
  }
  
  public static function isLeft<A, B>(e: Either<A, B>): Bool {
    return switch (e) {
      case Left(_):  true;
      case Right(_): false;

    }
  }
  
  public static function isRight<A, B>(e: Either<A, B>): Bool {
    return switch (e) {
      case Left(_):  false;
      case Right(_): true;
    }
  }
  
  public static function right<A, B>(e: Either<A, B>): Option<B> {
    return switch (e) {
      case Right(v): Some(v);
      
      default: None;
    }
  }
  
  public static function get<A>(e: Either<A, A>): A {
    return switch (e) {
      case Left(v): v;
      case Right(v): v;
    }
  }
  
  public static function mapLeft<A, B, C>(e: Either<A, B>, f: A -> C): Either<C, B> {
    return switch (e) {
      case Left(v): Left(f(v));
      case Right(v): Right(v);
    }
  }
  
  public static function map<A, B, C, D>(e: Either<A, B>, f1: A -> C, f2: B -> D): Either<C, D> {
    return switch (e) {
      case Left(v): Left(f1(v));
      case Right(v): Right(f2(v));
    }
  }
  
  public static function mapRight<A, B, D>(e: Either<A, B>, f: B -> D): Either<A, D> {
    return switch (e) {
      case Left(v): Left(v);
      case Right(v): Right(f(v));
    }
  }
  
  public static function flatMap<A, B, C, D>(e: Either<A, B>, f1: A -> Either<C, D>, f2: B -> Either<C, D>): Either<C, D> {
    return switch (e) {
      case Left(v): f1(v);
      case Right(v): f2(v);
    }
  }
  
  /** Composes two Eithers together. In case of conflicts, "failure" (left) 
   * always wins.
   */
  public static function composeLeft<A, B>(e1: Either<A, B>, e2: Either<A, B>, ac: A -> A -> A, bc: B -> B -> B): Either<A, B> {
    return switch (e1) {
      case Left(v1): switch (e2) {
        case Left(v2): Left(ac(v1, v2));
        case Right(v2): Left(v1);
      }
      case Right(v1): switch (e2) {
        case Left(v2): Left(v2);
        case Right(v2): Right(bc(v1, v2));
      }
    }
  }
  
  /** Composes two Eithers together. In case of conflicts, "success" (right) 
   * always wins.
   */
  public static function composeRight<A, B>(e1: Either<A, B>, e2: Either<A, B>, ac: A -> A -> A, bc: B -> B -> B): Either<A, B> {
    return switch (e1) {
      case Left(v1): switch (e2) {
        case Left(v2): Left(ac(v1, v2));
        case Right(v2): Right(v2);
      }
      case Right(v1): switch (e2) {
        case Left(v2): Right(v1);
        case Right(v2): Right(bc(v1, v2));
      }
    }
  }
}

class PartX {

  public static function start<S,B,G,E>(part:Part<S,B,G,E>,data:S,?oc:Outcome<B,G>):Outcome<B,G> {
    return part.part_.start(data,oc);
  }

  public static function stop<S,B,G,E>(part:Part<S,B,G,E>,?data:Dynamic):Outcome<String,Dynamic> {
    return part.part_.stop(data);
  }

  public static function stop_<S,B,G,E>(part:Part<S,B,G,E>,cb:Dynamic->Outcome<String,Dynamic>) {
    part.part_.setStop(cb);
  }
  
  public static function observe<S,B,G,E>(part:Part<S,B,G,E>,cb:E->Void):Void->Void {
    return part.part_.observe(cb);
  }

  public static function notify<S,B,G,E>(part:Part<S,B,G,E>,e:E) {
    part.part_.notify(e);
  }

  public static function partID<S,B,G,E>(part:Part<S,B,G,E>):String {
    return part.part_.partID;
  }
  
  public static function observeState<S,B,G,E>(part:Part<S,B,G,E>,cb:EPartState<E>->Void):Void->Void {
    return part.part_._events.observe(cb);
  }

  public static function
  state<S,B,G,E>(part:Part<S,B,G,E>):EPartState<E> {
    return part.part_.state;
  }

  public static function
  info<S,B,G,E>(part:Part<S,B,G,E>) {
    return part.part_._info;
  }
  
  
}

class OutcomeX {

  public static function
  outcome<A,B>(oc:Outcome<A,B>,cb:B->Void,?err:A->Void) {
    oc.deliver(function(either:Either<A,B>) {
        if (either.isRight())
          cb(either.right().get());
        else {
          if (err != null)
            err(either.left().get());
          else {
            Core.error(Std.string(either.left().get()));
#if (debug && nodejs)
            Sys.exit(1);
#end
          }
        }
    });
  }

  public static function
  oflatMap<A,B,P,Q>(oc:Outcome<A,B>,cb:B->Outcome<P,Q>,?err:P->Void):Outcome<P,Q> {
    var roc:Outcome<P,Q> = Core.outcome();
    oc.deliver(function(either:Either<A,B>) {
        if (either.isRight()) {
          cb(either.right().get())
            .outcome(function(val) {
                roc.resolve(Right(val));
              },err);
        } else {
            Core.error(Std.string(either.left().get()));
#if (debug && nodejs)
            Sys.exit(1);
#end
        }
      });
    return roc;
  }

  public static function
  omap<A,B,P,Q>(oc:Outcome<A,B>,cb:B->Q,?err:A->Void):Outcome<P,Q> {
    var roc:Outcome<P,Q> = Core.outcome();
    oc.deliver(function(either:Either<A,B>) {
        if (either.isRight()) {
          roc.resolve(Right(cb(either.right().get())));
        } else {
          if (err != null)
            err(either.left().get());
          else {
            Core.error(Std.string(either.left().get()));
#if (debug && nodejs)
            Sys.exit(1);
#end
          }
        }
      });
    return roc;
  }
  
}