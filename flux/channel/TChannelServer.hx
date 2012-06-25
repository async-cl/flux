
package flux.channel;

import flux.Core;
import flux.Channel;
import flux.Http;
import flux.Session;
using flux.Mixin;
import flux.channel.Flow;

class TChannelServer implements ChannelServer,implements Part<SessionMgr,String,ChannelServer,ChannelEvent> {
  public var part_:Part_<SessionMgr,String,ChannelServer,ChannelEvent>;
  var _conduit:Conduit;
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  var _channelAuth:String->Chan<Dynamic>->(Either<String,String>->Void)->Void;
  
  public function
  new() {
    part_ = Core.part(this,{
        name:"Channel Server",
        ver:"0.1",
        auth:"Cloudshift"
    });
  }

  public function
  start_(sessMgr:SessionMgr,?oc:Outcome<String,ChannelServer>) {
    if (oc == null)
      oc = Core.outcome();
    
    Flow.pushConduit(sessMgr).start({})
      .oflatMap(function(push) {
          _conduit = push;
          return Flow.sink().start(push);
        })
      .outcome(function(sink) {
          _sink = sink;
          if (_channelAuth != null) {
            _sink.observe(function(dd:SinkEvent) {
                switch(dd) {
                case Authorize(sessID,chan,reply):
                  if (_channelAuth == null)
                    reply(Right(""));
                  else
                    _channelAuth(sessID,chan,reply);
                case ConnectionClose(sessID):
                case Outgoing(_,_,_,_):
                }
              });
          }
          oc.resolve(Right(cast this));
        });
    return oc;
  }

  public function
  channel<T>(chanID:String):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    // on server getting a pipe is sync
    oc.resolve(Right(_sink.chan(chanID)));
    return oc;
  }

  public function direct<T>(sessID:String):Outcome<String,Chan<T>> {
    var oc = Core.outcome();
    oc.resolve(Right(_sink.direct(sessID)));
    return oc;
  }
  
  public function
  addChannelAuth(cb:String->Chan<Dynamic>->(Either<String,String>->Void)->Void):ChannelServer {
    _channelAuth = cb;
    return this;
  }
  
}