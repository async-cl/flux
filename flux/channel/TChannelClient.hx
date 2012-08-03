
package flux.channel;

using flux.Core;
import flux.Channel;
import flux.Session;
import flux.channel.Flow;

class TChannelClient
extends flux.core.ObservableImpl<ESession>,
implements ChannelClient {
  
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  
  public function
  new() {
    super();
  }

  public function
  start_(session:SessionClient,?oc:Outcome<ChannelClientError,ChannelClient>) {
    if (oc == null)
      oc = Core.outcome();

    var sessID = session.sessID();
    Flow.clientConduit().start({endPoint:session.endPoint(),sessID:sessID})
      .oflatMap(function(conduit) {
          return Flow.clientSink().start(conduit);
        })
      .outcome(function(sink) {
          _sink = sink;
          oc.resolve(Right(cast this));
        });
    
    return oc;
  }

  public function stop_(p:Dynamic,?oc:Outcome<Dynamic,Dynamic>) {
    var soc = Core.outcome();
    _sink.stop({}).outcome(function(el) {
        _sink = null;
        soc.resolve(Right(""));
      });
    return soc;
  }
  
  public function
  channel<T>(id:String):Outcome<String,Chan<T>> {
    return _sink.authorize(_sink.chan(id));
  }

  public function direct<T>(sessID:String):Outcome<String,Chan<T>> {
    return _sink.authorize(_sink.chan(sessID));
  }

  public function removeChannel(chan:Chan<Dynamic>) {
    _sink.removeChan(chan);
  }
}