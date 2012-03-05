package cloudshift.core;

import  cloudshift.Core;
using cloudshift.Mixin;

class PartBaseImpl<S,B,G,E> implements Part_<S,B,G,E> {
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
                                
  public function start(d:S,?oc:Outcome<B,G>):Outcome<B,G> {
    var p:Outcome<B,G> = null;

    p = parent.start_(d,oc);

    checkErr("start",p);
    
    p.outcome(function(outcome) {
#if debug
        Core.info("Part started:"+Type.getClassName(Type.getClass(parent)));
#end
        _events.notify(Started);
      },function(msg) {
        return _events.notify(Error(Std.string(msg)));
      });
    
    return p;
  }
  
  public function stop(d:Dynamic) {
    var p:Outcome<String,Dynamic> = null;
    p = parent.stop_(d);
    
    checkErr("stop",p);
    
    p.outcome(function(outcome) {
        _events.notify(Stopped);
      },function(msg) {
        _events.notify(Error(msg));
      });
    
    return p;
  }
  
  function checkErr(type,outcome:Outcome<Dynamic,Dynamic>) {
    if (outcome == null)
      throw Type.getClassName(Type.getClass(parent)) +" should not return null for "+type +" function";
    return outcome;
  }

}