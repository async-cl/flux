
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
  var _conduit:Conduit;
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

    Flow.pushConduit().start({host:"localhost",port:8082,sessID:sessID})
      .oflatMap(function(conduit) {
          _conduit = conduit;
          return Flow.sink(sessID).start(_conduit);
        })
      .outcome(function(sink) {
          _sink = sink;
          trace("got sink");
          
          oc.resolve(Right(cast this));
        });
    
    return oc;
  }

  public function
  stop_(?d:Dynamic) {
    var oc = Core.outcome();
    oc.resolve(Right(d));
    return oc;
  }

  public function
  channel<T>(id:String):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    _sink.authorize(_sink.chan(id)).outcome(function(val) {
        oc.resolve(Right(val));
      });
    return oc;
  }

  public function direct<T>(sessID:String):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    _sink.authorize(_sink.chan(sessID)).deliver(cast oc.resolve);
    return oc;
  }

  public function unsub(chan:Chan<Dynamic>) {
    _sink.removeChan(chan);
  }
}