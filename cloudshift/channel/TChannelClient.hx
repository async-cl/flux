
/**
   hxc: -D CS_BROWSER

*/
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.Session;
import cloudshift.Flow;

using cloudshift.Mixin;

class TChannelClient implements ChannelClient,
                     implements Part<Dynamic,ChannelClientError,ChannelClient,ESession> {
  
  public var part_:Part_<Dynamic,ChannelClientError,ChannelClient,ESession>;
  var _session:SessionClient;
  var _conduit:Conduit;
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  
  public function
  new() {
    part_ = Core.part(this);
  }

  public function
  start_(d:Dynamic,?oc:Outcome<ChannelClientError,ChannelClient>) {
    if (oc == null)
      oc = Core.outcome();

    trace("starting client");
    Session.client()
      .start({host:"localhost",port:3844})
      .oflatMap(function(sess) {
          trace("got sess");
          _session = sess;
          var pcOutcome = Core.outcome();
          _session.login(d).deliver(function(esess) {
              switch(esess) {
              case UserOk(sessID):
                trace("user ok="+sessID);
                Flow.pushConduit().start({host:"localhost",port:8082,sessID:sessID},pcOutcome);
              default:
                pcOutcome.cancel();
                oc.resolve(Left(UserLoggedIn));
              }
            });
          return pcOutcome;
        },function(reason) {
          oc.resolve(Left(CantStartSessionClient));
        })
      .oflatMap(function(conduit) {
          _conduit = conduit;
          trace("got conduit");
          return Flow.sink(_session).start(_conduit);
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
    _sink.authorize(_sink.pipe(id)).deliver(cast oc.resolve);
    return oc;
  }

  public function logout() {
    _session.logout();
  }

  public function unsub(chan:Chan<Dynamic>) {
    _sink.removePipe(chan);
  }
}