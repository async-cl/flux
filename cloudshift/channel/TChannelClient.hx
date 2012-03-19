
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
                     implements Part<String,ChannelClientError,ChannelClient,ESession> {
  
  public var part_:Part_<String,ChannelClientError,ChannelClient,ESession>;
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  
  public function
  new() {
    part_ = Core.part(this);
  }

  public function
  start_(sessID:String,?oc:Outcome<ChannelClientError,ChannelClient>) {
    if (oc == null)
      oc = Core.outcome();

    trace("init conduit with sessID:"+sessID);
    Flow.pushConduit().start({host:"localhost",port:8082,sessID:sessID})
      .oflatMap(function(conduit) {
          trace("--> setting sink with "+sessID+" new conduit ="+conduit);
          return Flow.sink().start(conduit);
        })
      .outcome(function(sink) {
          _sink = sink;
          trace("SET NEW SINK");
          stop_(function(d) {
              var soc = Core.outcome();
              _sink.stop().outcome(function(el) {
                  _sink = null;
                  trace("STOPPING SINK");
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