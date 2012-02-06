
package cloudshift.core;

import cloudshift.Core;
using cloudshift.Mixin;

class OutcomeImpl<A,B> implements Outcome<A,B> {

  var fut:Future<Either<A,B>>;
  var userCancel:A->Void;
  var err:A;

  public function new(?cancel:A->Void) {
    fut = Core.future();
    err = null;
    if (cancel != null)
      userCancel = cancel;
  }

  function onCancel(e:A) {
      err = e;
      if (userCancel != null)
        userCancel(e);
      else
        Core.error(Std.string(e));
  }

  public function future():Future<Either<A,B>> {
    return fut;
  }
  
  public function onError(cb:A->Void) {
    userCancel = cb;
    return cast this;
  }

  public function error():A {
    return err;
  }
  
  public function deliver(cb:B->Void) {
    fut.deliver(function(e) {
        switch(e) {
        case Right(v):
          cb(v);
        case Left(msg):
          onCancel(msg);
        }
      });
    return cast this;
  }
  
  public function resolve(e:Either<A,B>) {
    fut.resolve(e);
  }

  public function map<S>(f: B -> S): Outcome<A,S> {
    var nf = Core.outcome(userCancel);
    fut.deliver(function(e) {
        switch(e) {
        case Right(t):
          nf.resolve(Right(f(t)));
        case Left(msg):
          onCancel(msg);
          nf.cancel();
        }
      });      
    return nf;
  }
  
  public function flatMap<S>(cb:B->Outcome<A,S>):Outcome<A,S> {
    var nf = Core.outcome(userCancel);
    fut.deliver(function(either) {
        switch(either) {
        case Right(result):
          cb(result).deliver(function(r) {
              nf.resolve(Right(r));
            });
        case Left(msg):
          onCancel(msg);
          nf.cancel();
        }
      });
    return nf;
  }

  public function cancel() {
    fut.cancel();
  }

  public static function
  waitFor(toJoin:Array<Outcome<Dynamic,Dynamic>>):Outcome<String,Array<Dynamic>> {
    var
      oc = Core.outcome(),
      results = [];
    
    Core.waitFor(toJoin.map(function(outcome) return outcome.future())).deliver(function(aoc) {
        aoc.foreach(function(el:Either<Dynamic,Dynamic>) {
            if (el.isLeft()) {
              oc.resolve(Left(el.left().get()));
              return;
            }
            results.push(el.right().get());
          });
        oc.resolve(Right(results));
      });
    return oc;
  }

}
