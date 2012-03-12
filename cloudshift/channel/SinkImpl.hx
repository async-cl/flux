
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.channel.Flow;
import cloudshift.core.ObservableImpl;
using cloudshift.Mixin;

using cloudshift.channel.Flow;

class SinkImpl implements Sink {
  public var part_:Part_<Conduit,String,Sink,SinkEvent>;
  
  var _chans:Hash<Chan<Dynamic>>;
  var _conduit:Array<Conduit>;
  var _myfill:Dynamic->String->Dynamic->Void;
  
  public function new() {
    part_ = Core.part(this);
  }

  public function start_(c:Conduit,?oc:Outcome<String,Sink>) {
    if (oc == null)
      oc = Core.outcome();
    _conduit = [];
    _chans = new Hash();
    addConduit(c);
    oc.resolve(Right(cast(this,Sink)));
    return oc;
  }

  public function stop_(?d):Outcome<String,Dynamic> {
    return _conduit[0].stop();
  }

  public function addConduit(c:Conduit) {
    _conduit.push(c);
    c.observe(function(f) {
        switch(f) {
        case Drain(pkt,sessID,cb):
          var
            pID = pkt.chanID(),
            pip = _chans.get(pID),
            op = pkt.operation();
    
          if (pip == null)
            pip = chan(pID);
    
          switch(op) {
          case "s": // subscribe
            reqSub(sessID,pip,cb);
          case "u": // unsubscribe
            reqUnsub(sessID,pip,cb);
          case "m": // send a message
            reqMsg(pip,pkt);
            cb(Right(""));
          }
        case ConduitNoConnection(sessID),ConduitSessionExpire(sessID):
          notify(ConnectionClose(sessID));
        }
        
      });
  }

  public function
  chan<T>(pID):Chan<T> {
    var ch = _chans.get(pID) ;
    if (ch == null) {
      ch = new PipeImpl<T>(pID);
      _chans.set(pID,ch);
      if (_myfill != null) {
        ch._fill = _myfill;
      }
    }
    return cast ch;
  }

  public function
  removeChan<T>(p:Chan<T>) {
    _chans.remove(p.pid());
  }
  
  public function
  chanFromId(pID:String):Option<Chan<Dynamic>> {
    return _chans.getOption(pID);
  }

  function reqSub(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqSub, should be overridden";
  }

  function reqUnsub(sessID,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqUnsub, should be overridden";
  }

  function removeAllSubs(sessID:String) {
    throw "SinkImp:removeAllSubs, should be overridden";
  }

  function reqMsg(pipe:Chan<Dynamic>,pkt:Pkt<Dynamic>) {
    pipe._defaultFill(pkt,"",null);
  }

  public function direct<T>(sessID:String):Chan<T> {
    return chan("/__cs/"+sessID);
  }
  
  public function
  authorize<T>(pipe:Chan<T>):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    trace("auth :"+pipe.pid());
    _conduit[0].authorize(pipe.pid())
      .deliver(function(conduitAuthorized) {
          switch(conduitAuthorized) {
          case Right(_):
            trace("got a pipe back");
            oc.resolve(Right(pipe));
          case Left(msg):
            trace("got a message back");
            oc.resolve(Left(msg));
          }
        });
    return oc;
  }

}
  