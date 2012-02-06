package cloudshift.core;

import  cloudshift.Core;
using cloudshift.Mixin;

class PartBaseImpl<S,R,E> implements Part_<S,R,E> {
  public var partID(default,null):String;
  public var _events:Observable<EPartState<E>>;
  
  var parent:Dynamic;
  public function new(parent:Dynamic) {
    this.parent = parent;
    partID = Type.getClassName(Type.getClass(parent));
    _events = Core.event();
#if debug
    Core.info("Part created:"+Type.getClassName(Type.getClass(parent)));
#end
  }

  public function peer():Dynamic {
    return parent;
  }

  public function notify(e:E) {
    _events.notify(Event(e));
  }

  public function notifyState(s:EPartState<E>) {
    _events.notify(s);
  }
  
  public function observe(cb:E->Void,?info:Dynamic) {
    return _events.observe(function(s) {
        switch(s) {
        case Event(s):
          cb(s);
        default:
        }
      },info);
   }

  public function observeState(cb:EPartState<E>->Void) {
    _events.observe(cb);
  }
                                
  public function start(d:S):Outcome<String,R> {
    var p:Outcome<String,R> = null;

    p = parent.start_(d);

    checkErr("start",p);
    
    p.onError(function(msg) {
        _events.notify(Error(msg));
      });
    
    p.deliver(function(outcome) {
#if debug
        Core.info("Part started:"+Type.getClassName(Type.getClass(parent)));
#end
        _events.notify(Started);
      });
    return p;
  }
  
  public function stop(d:Dynamic) {
    var p:Outcome<String,Dynamic> = null;
    p = parent.stop_(d);
    
    checkErr("stop",p);
    
    p.onError(function(msg) {
        _events.notify(Error(msg));
      });
    
    p.deliver(function(outcome) {
        _events.notify(Stopped);
      });
    
    return p;
  }
  
  function checkErr(type,outcome:Outcome<String,Dynamic>) {
    if (outcome == null)
      throw Type.getClassName(Type.getClass(parent)) +" should not return null for "+type +" function";
    return outcome;
  }

}