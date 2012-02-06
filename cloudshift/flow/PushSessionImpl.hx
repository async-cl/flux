
package cloudshift.flow;

import cloudshift.Http;
import cloudshift.Flow;
import cloudshift.flow.InternalApi;
import cloudshift.flow.MessageQImpl;

using cloudshift.Mixin;

class PushSessionImpl implements ConduitSession {
  public var lastConnection(default,default):Float;
  public var sessID(default,default):String;
  
  var mq:MessageQ;
  var subs:Hash<Void->Void>;
  
  public function new(sessID:String) {
    this.sessID = sessID;
    mq = new MessageQImpl(sessID);
    subs = new Hash();
  }

  public function
  subscriptions():Hash<Void->Void> {
    return subs;
  }

  public inline function
  append(pkt:Dynamic) {
    mq.append(pkt);
  }

  public function
  flusher(flush:SessionQueue->Bool) {
    mq.setFlusher(flush);
    mq.startFlushing(sessID);
  }

  public function
  shutDown() {
    mq.stopFlushing();
    mq = null;
    trace("removed all subs for "+sessID);
    subs.values().foreach(function(f) f());
    subs = null;
  }

}