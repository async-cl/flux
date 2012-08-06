
package flux.channel;

using flux.Core;
import flux.Channel;
import flux.channel.Flow;
using flux.Channel;

class SinkImpl
implements Sink {

  var _ob:Observable<SinkEvent>;
  var _chans:Hash<Chan<Dynamic>>;  
  var _conduit:Conduit;
  var _myfill:Dynamic->String->Dynamic->Void;
  
  public function new() {
    _ob = Core.observable();
  }

  public function start_(c:Conduit,oc:Outcome<String,Sink>) {
    _chans = new Hash();
    _conduit = c;
    _conduit.addSink(this);
    oc.resolve(Right(this));
    return oc;
  }

  public function stop_(p:Dynamic,oc:Outcome<Dynamic,Dynamic>) {
    _conduit.stop({}).outcome(function(c) {
        _conduit = null;
        _chans = null;
        oc.resolve(Right(""));
      });
    
    return oc;
  }

  public function observable_() {
    return _ob;
  }
  
  public function info_() {
    return {id:"Sink"};
  }
  
  public function
  chan<T>(pID):Chan<T> {
    var ch = _chans.get(pID) ;
    if (ch == null) {
      trace("Creating new channel:"+pID);
      ch = new ChanImpl<T>(pID);
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

  public function message(chan:Chan<Dynamic>,pkt:Pkt<Dynamic>) {
    chan._defaultFill(pkt,"",null);
  }

  public function direct<T>(sessID:String):Chan<T> {
    return chan(Core.CSROOT+"direct/"+sessID);
  }

  public function subscribe(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqSub, should be overridden";
  }

  public function unsubscribe(sessID,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqUnsub, should be overridden";
  }

  function removeAllSubs(sessID:String) {
    throw "SinkImp:removeAllSubs, should be overridden";
  }
  
  public function
  authorize<T>(chan:Chan<T>):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    _conduit.authorize(chan.pid())
      .deliver(function(conduitAuthorized) {
          switch(conduitAuthorized) {
          case Right(_):
            oc.resolve(Right(chan));
          case Left(msg):
            oc.resolve(Left(msg));
          }
        });
    return oc;
  }

}
  