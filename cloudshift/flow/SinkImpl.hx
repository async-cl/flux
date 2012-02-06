
package cloudshift.flow;

import cloudshift.Core;
import cloudshift.Flow;
import cloudshift.flow.InternalApi;
import cloudshift.core.ObservableImpl;
using cloudshift.Mixin;

using cloudshift.Flow;

class SinkImpl implements Sink {
  public var part_:Part_<Conduit,Sink,SinkEvent>;
  
  var _pipes:Hash<Pipe<Dynamic>>;
  var _conduit:Array<Conduit>;
  var _myfill:Dynamic->String->Dynamic->Void;
  
  public function new() {
    part_ = Core.part(this);
  }

  public function start_(c:Conduit) {
    var prm = Core.outcome();
    _conduit = [];
    _pipes = new Hash();
    addConduit(c);
    prm.resolve(Right(cast(this,Sink)));
    return prm;
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
            pID = pkt.pipeID(),
            pip = _pipes.get(pID),
            op = pkt.operation();
    
          if (pip == null)
            pip = pipe(pID);
    
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
  pipe<T>(pID):Pipe<T> {
    var ch = _pipes.get(pID) ;
    if (ch == null) {
      ch = new PipeImpl<T>(pID);
      _pipes.set(pID,ch);
      if (_myfill != null) {
        ch._fill = _myfill;
      }
    }
    return cast ch;
  }

  public function
  removePipe<T>(p:Pipe<T>) {
    _pipes.remove(p.pid());
  }
  
  public function
  pipeFromId(pID:String):Option<Pipe<Dynamic>> {
    return _pipes.getOption(pID);
  }

  function reqSub(sessID:String,chan:Pipe<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqSub, should be overridden";
  }

  function reqUnsub(sessID,chan:Pipe<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqUnsub, should be overridden";
  }

  function removeAllSubs(sessID:String) {
    throw "SinkImp:removeAllSubs, should be overridden";
  }

  function reqMsg(pipe:Pipe<Dynamic>,pkt:Pkt<Dynamic>) {
    pipe._defaultFill(pkt,"",null);
  }

  public function
  authorize<T>(pipe:Pipe<T>):Future<Either<String,Pipe<T>>> {
    var prm = Core.future();
    _conduit[0].authorize(pipe.pid())
      .deliver(function(conduitAuthorized) {
          switch(conduitAuthorized) {
          case Right(_):
            prm.resolve(Right(pipe));
          case Left(msg):
            prm.resolve(Left(msg));
          }
        });
    return prm;
  }

}
  