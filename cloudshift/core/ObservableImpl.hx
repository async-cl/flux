
package cloudshift.core ;

import cloudshift.Core;
using cloudshift.Mixin;

class ObservableImpl<T> implements Observable<T> {

  static var CLEANUP = 1;
  public var preNotify:T->Dynamic;
  
  var _unsubscribes:Int;
  var _observers:Array<{handler:T->Void,info:Option<Dynamic>}>;
  var _event:Observable<EOperation>;
  
  public function new() {
    _observers = [];
    _unsubscribes = 0;
  }
  
  public function
  notify(v:T) {

    #if debug
    if (v == null) {
      throw "huh? can't notify null object";
    }
    #end

    if (preNotify != null) {
      v = preNotify(v);
      if (v == null)
        return;
    }
    
    for (ob in _observers)
      if (ob.handler != null) {
        ob.handler(v);
      }
  }
    
  public function
  observe(cb:T->Void,?info:Dynamic):Void->Void {
    var
      h = {handler:cb,info:Core.toOption(info)};
    
    _observers.push(h);

    if (_event != null)
      _event.notify(Add(info));
    
    return function() {
      if (h.handler != null) { // check we don't call this twice
        h.handler = null;
        _unsubscribes++;
        if (_unsubscribes >= CLEANUP) {
          cleanup();
        }
        if (_event != null)
          _event.notify(Del(info));
      }
    }
  }

  function cleanup() {
    trace("cleaning up");
    _unsubscribes = 0;
    _observers = _observers.filter(function(s) {
          if (s.handler == null)
            trace("filtering "+s.info);
          return s.handler != null;
      });
  }
  
  public function
  peers():Array<Dynamic> {
    return _observers
      .filter(function(el) return el.handler != null)
      .map(function(el) return el.info);
  }

  public function
  peek(cb:EOperation->Void) {
    if (_event == null)
      _event = new ObservableImpl();
    
    _event.observe(cb);
  }

  public function
  removePeers() {
    _observers.foreach(function(s) {
        s.handler = null;
        s.info = null;
      });
    _observers = [];
  }
  

}