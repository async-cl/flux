
package cloudshift.flow;

import cloudshift.Core;
import cloudshift.Http;
import cloudshift.Session;
import cloudshift.Flow;

using cloudshift.Mixin;

class QuickFlowImpl implements Part<HttpServer,QuickFlow,Dynamic>  {

  public var part_:Part_<HttpServer,QuickFlow,Dynamic>;

  #if nodejs
  public var http:HttpServer;
  #end
  public var session:SessionMgr;
  public var conduit:Conduit;
  public var sink:Sink;
  
  public function new() {
    part_ = Core.part(this);
  }

  public function
  start_(http:HttpServer) {
    trace("starting quickflow imple");
 #if nodejs
    var sess = Session.manager(http);
    #else
    var sess = Session.client();
    #end

    var oc = Core.outcome();
    sess.start(http)    
      .onError(function(reason) {
          oc.resolve(Left(reason));
        })
      .flatMap(function(sess) {
          session = sess;
          return Flow.pushConduit(sess).start({});
        })
      .flatMap(function(push) {
          conduit = push;
          return Flow.sink(push.session()).start(push);
        })
      .deliver(function(s) {
          sink = s;
          var forTyper:QuickFlow = this;
          oc.resolve(Right(forTyper));
        });
    
    return oc;
  }

  public function
  stop_(?s) {
    var f:Outcome<String,Dynamic> = Core.outcome();
    return f;
  }

}