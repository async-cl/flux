
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Channel;
import cloudshift.Http;
import cloudshift.Session;
import cloudshift.Flow;
using cloudshift.Mixin;

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
    part_ = Core.part(this);
  }

  public function
  start_(d:Dynamic,?oc:Outcome<String,ChannelServer>) {
    if (oc == null)
      oc = Core.outcome();

    if (_session == null)
      _session = Session.manager();

    /* provide an http if the user does not */
    if (_http == null) {
      _http = Http.server();
      if (_host == null)
        _host = "localhost";
      if (_port == null)
        _port = 3844;
      
      _http.start({host:_host,port:_port}).outcome(function(http) {
          gotHttp(oc);
        });
    } else {
      /* use the users, assuming it's started */
      gotHttp(oc);
    }
    
    return oc;
  }

  public function
  gotHttp(oc:Outcome<String,ChannelServer>) {
    trace("starting session");
    _session.start(_http)
      .oflatMap(function(sess) {
          _session = sess;
          var myoc:Outcome<String,Conduit> = Core.outcome();
          trace("got session");
          /*
          if (_sessionAuth == null) {
            myoc.cancel();
            oc.resolve(Left("need session auth"));
          } else {
            _session.observe(_sessionAuth);
          
           
          }
          */
         Flow.pushConduit(sess).start({},myoc);
          return myoc;
        })
      .oflatMap(function(push) {
          var myoc:Outcome<String,Sink> = Core.outcome();
          _conduit = push;
          trace("got conduit");
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
          trace("got sink");
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
    oc.resolve(Right(_sink.pipe(chanID)));
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