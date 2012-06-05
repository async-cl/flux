
/**
   hxc: -D CS_BROWSER

*/
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.Session;
import cloudshift.channel.Flow;

using cloudshift.Mixin;

class TChannelClient implements ChannelClient,
                     implements Part<SessionClient,ChannelClientError,ChannelClient,ESession> {
  
  public var part_:Part_<SessionClient,ChannelClientError,ChannelClient,ESession>;
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  
  public function
  new() {
    part_ = Core.part(this);
  }

  public function
  start_(session:SessionClient,?oc:Outcome<ChannelClientError,ChannelClient>) {
    if (oc == null)
      oc = Core.outcome();

    var sessID = session.sessID();
    Flow.pushConduit().start({endPoint:session.endPoint(),sessID:sessID})
      .oflatMap(function(conduit) {
          return Flow.sink().start(conduit);
        })
      .outcome(function(sink) {
          _sink = sink;
          stop_(function(d) {
              var soc = Core.outcome();
              _sink.stop().outcome(function(el) {
                  _sink = null;
                  soc.resolve(Right(""));
                });
              return soc;
            });
          
          oc.resolve(Right(cast this));
        });
    
    return oc;
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