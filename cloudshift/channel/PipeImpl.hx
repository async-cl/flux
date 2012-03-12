
package cloudshift.channel;

import cloudshift.Core;
using cloudshift.Mixin;
import cloudshift.Channel;
import cloudshift.channel.Flow;
import cloudshift.channel.InternalApi;

using cloudshift.channel.Flow;

class PipeImpl<T> implements Chan<T> {

  var event_:cloudshift.core.ObservableImpl<Pkt<T>>;
  
  static var CLEANUP =1;

  var _pID:String;
  var _filters:Array<{filt:Dynamic->Dynamic}>;
  var _unfilters:Int;
  
  public var _fill:Dynamic->String->Dynamic->Void;
  
  public function
  new(pid:String,?opts:Dynamic) {
    event_ = new cloudshift.core.ObservableImpl();
    _unfilters = 0;
    _pID = pid;
    _fill = _defaultFill;
  }

  function preNotify(o:Pkt<T>) {
    for (f in _filters) {
      if (f.filt != null) {
        var newPkt:Dynamic = f.filt(o);
        if (newPkt == null)
          return null;
        else
          o = newPkt;
      }
    }
    return o;
  }

  public function
  sub(cb:T->Void,?info:Dynamic):Void->Void {
    return event_.observe(function(pkt:Pkt<T>) {
        cb(pkt.p);
      },info);
  }

  public function
  subPkt(cb:Pkt<T>->Void,?info:Dynamic):Void->Void {
    return event_.observe(cb,info);
  }

  public function
  peek(cb:EOperation->Void) {
    event_.peek(cb);
  }
  
  public function
  removeAllSubs() {
    event_.removePeers();
  }
  
  public function
  _defaultFill<T>(o:Dynamic,chanID:String,meta:Dynamic) {
    event_.notify(o);
  }
  
  public function
  pub(msg:T,?meta:Dynamic):Void {
    _fill(msg,_pID,meta);
  }
 
  function
  constructFilter(f:Dynamic->Dynamic) {
    var filter = {filt:f };
    
     if (_filters == null) {
      _filters = [];
      event_.preNotify = preNotify;
    }

    _filters.push(filter);
    
    return function() {
      filter.filt = null;
      _unfilters++;
      if (_unfilters >= CLEANUP) {
        _unfilters = 0;
        _filters = _filters
          .filter(function(el) { return el.filt != null; }) ;
      }
    }
  }
  
  public function
  filter(f:T->T):Void->Void {    
    return constructFilter(function(pkt:Pkt<T>) {
        var newpayload = f(pkt.payload());
        pkt.p = newpayload;
        return pkt;
      });
  }

  public function
  filterPkt(f:Pkt<T>->Pkt<T>):Void->Void {
    return constructFilter(f);
  }
  
  public function
  subs():Array<Dynamic> {
    return event_.peers();
  }
  
  public function pid() {return _pID;}
  
  public function
  route<P>(chan:Chan<P>,?map:T->P):Void->Void {
    if (map != null) {
      return sub(function(o) {
          chan.pub(map(o));
        });
    } else {
      return sub(function(o) {
          chan.pub(cast o);
        });
    }
  } 
}
