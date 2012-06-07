package outflux.core;

import  outflux.Core;
using outflux.Mixin;

class PartBaseImpl<S,B,G,E> implements Part_<S,B,G,E> {
  public static var runningParts:Array<AnyPart> = [];
  static var _nextID = 0;
  
  public var partID(default,null):String;
  public var _events:Observable<EPartState<E>>;
  public var state:EPartState<E>;
  public var _info:PartInfo;
  public var sstopper:Dynamic->Outcome<String,Dynamic>;

  var _observers:Array<Void->Void>;
  var _ID:Int;
  var _parent:Dynamic;

  public function new(parent:Dynamic,?info:PartInfo) {
    _parent = parent;
    _info = info;
    _ID = _nextID++;
    _observers = [];
    partID = Type.getClassName(Type.getClass(_parent))+Std.string(_ID);
    _events = Core.event();

#if debug
    partInfo("created");
#end

    sstopper = function(d) {
        throw "Default stop function called for :"+partID + ". Add a stop function with stop_(stopFunction)";
        return null;
    }
  }

  public function peer():Dynamic {
    return _parent;
  }

  public function notify(e:E) {
    _events.notify(Event(e));
  }

  public function notifyState(s:EPartState<E>) {
    _events.notify(s);
  }
  
  public function observe(cb:E->Void,?info:Dynamic) {
    var unsub = _events.observe(function(s) {
        switch(s) {
        case Event(s):
          cb(s);
        default:
        }
      },partID);
    _observers.push(unsub);
    return unsub;
   }

  public function observeState(cb:EPartState<E>->Void) {
    _events.observe(cb);
  }
                                
  public function start(d:S,?oc:Outcome<B,G>):Outcome<B,G> {

    var p:Outcome<B,G> = _parent.start_(d,oc);

    checkErr("start",p);
    
    p.outcome(function(outcome) {
        partInfo("started");
        state = Started;

        //        runningParts.push(_parent);
        
        _events.notify(Started);
      },function(msg) {
        return _events.notify(Error(Std.string(msg)));
      });
    
    return p;
  }
  
  public function stop(d:Dynamic) {
    var p = sstopper(d);
    
    checkErr("stop",p);
    
    p.outcome(function(outcome) {
        state = Stopped;
        partInfo("stopped");
        _events.notify(Stopped);
        _observers.foreach(function(observerRemove) {
            observerRemove();
          });
      },function(msg) {
        _events.notify(Error(msg));
      });    

    return p;
  }

  public function setStop(cb:Dynamic->Outcome<String,Dynamic>) {
    partInfo("with user stop_()");
    sstopper = cb;
  }

  function partInfo(info:String) {
#if debug
    Core.info(partID+" -> "+info,"PART");
#end
  }
  
  function checkErr(type,outcome:Outcome<Dynamic,Dynamic>) {
    if (outcome == null)
      throw partID +" should not return null for "+type +" function";
    return outcome;
  }

}