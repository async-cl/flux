
package flux.channel;

using flux.Core;
import flux.channel.Flow;
using flux.Channel;

/*
  A sink provides a collection of channels, and allows each channel in that collection to have
  it's outgoing message stream to be plugged by a subclass, e.g. a server or client sink.

  A Sink is abstract it requires to be extended.
*/

class SinkImpl
implements Sink {

  var _ob:Observable<SinkEvent>;
  var _chans:Hash<Chan<Dynamic>>;  
  var _conduit:Conduit;
  var _outgoing:Dynamic->String->Dynamic->Void;
  
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
  
  public function
  chan<T>(pID):Chan<T> {
    var ch = _chans.get(pID) ;
    if (ch == null) {
      trace("Creating new channel:"+pID);
      ch = new ChanImpl<T>(pID);
      _chans.set(pID,ch);
      if (_outgoing != null) {
        ch._outgoing = _outgoing;
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

  public function incoming(chan:Chan<Dynamic>,pkt:Pkt<Dynamic>) {
    chan._defaultOutgoing(pkt,"",null);
  }

  public function direct<T>(sessID:String):Chan<T> {
    return chan(Core.CSROOT+"direct/"+sessID);
  }

  #if nodejs
  public function subscribe(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqSub, should be overridden";
  }

  public function unsubscribe(sessID,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    throw "SinkImp:reqUnsub, should be overridden";
  }
  #end

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
  