
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.Http;
import cloudshift.Session;
using cloudshift.Mixin;
import cloudshift.channel.Flow;

class TChannelServer implements ChannelServer,implements Part<Dynamic,String,ChannelServer,ChannelEvent> {
  public var part_:Part_<Dynamic,String,ChannelServer,ChannelEvent>;
  var _http:HttpServer;
  var _session:SessionMgr;
  var _conduit:Conduit;
  var _sink:Sink;
  var _host:String;
  var _port:Int;
  var _channelAuth:String->Chan<Dynamic>->(Either<String,String>->Void)->Void;
  var _sessionAuth:ESessionOp->Void;
  
  public function
  new() {
    part_ = Core.part(this,{
        name:"Channel Server",
        ver:"0.1",
        auth:"Cloudshift"
    });
  }

  public function
  start_(d:Dynamic,?oc:Outcome<String,ChannelServer>) {
    if (oc == null)
      oc = Core.outcome();

    if (_session == null) {
      _session = Session.manager();
    }
    /* provide an http if the user does not */
    if (_http == null) {
      _http = Http.server();
      if (_host == null)
        _host = "localhost";
      if (_port == null)
        _port = 8082;

      _http.start({host:_host,port:_port}).outcome(function(http) {
          gotHttp(oc);
        });
    } else {
      /* use the users, assuming it's started */
      if (_http.state() == Started) {
        gotHttp(oc);
      } else {
        Core.error("you need to start the http server");
      }
    }
    return oc;
  }

  public function
  gotHttp(oc:Outcome<String,ChannelServer>) {
    _session.start(_http)
      .oflatMap(function(sess) {
          _session = sess;
          var myoc:Outcome<String,Conduit> = Core.outcome();
          if (_sessionAuth != null) {
            _session.observe(_sessionAuth);
          } else {
            Core.warn("you may need to add a session authorizer");
          }
          
          Flow.pushConduit(sess).start({},myoc);
          return myoc;
        })
      .oflatMap(function(push) {
          var myoc:Outcome<String,Sink> = Core.outcome();
          _conduit = push;
          Flow.sink(push.session()).start(push,myoc);
          return myoc;
        })
      .outcome(function(sink) {
          _sink = sink;
          if (_channelAuth != null) {
            _sink.observe(function(dd:SinkEvent) {
                switch(dd) {
                case Authorize(sessID,chan,reply):
                  _channelAuth(sessID,chan,reply);
                case ConnectionClose(sessID):
                }
              });
          }
          oc.resolve(Right(cast this));
        });
  }

  public function
  stop_(?d:Dynamic) {
    var oc = Core.outcome();
    oc.resolve(Right(d));
    return oc;
  }

  public function
  addHttpServer(http):ChannelServer {
    _http = http;
    return this;
  }

  public function
  addHostPort(host:String,port:Int):ChannelServer {
    _host = host;
    _port = port;
    return this;
  }

  public function
  addSessionMgr(sessMgr:SessionMgr):ChannelServer {
    _session = sessMgr;
    return this;
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
  
  public function
  addSessionAuth(cb:ESessionOp->Void):ChannelServer {
    _sessionAuth = cb;
    return this;
  }

  public function session() {
    return _session;
  }
  
}