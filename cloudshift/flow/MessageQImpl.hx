
package cloudshift.flow;
import cloudshift.Flow;
import cloudshift.flow.InternalApi;

using cloudshift.Mixin;

class MessageQImpl implements MessageQ {

  static var timer:Int = -1;
  static var waitingQs:Array<MessageQ> = [];
  static var flusher:MessageQ->Bool;
  
  var _mq:Array<Dynamic>;
  var _sessID:String;
  var _inQ:Bool;

  public function new(sID:String){
    _mq = [];
    _inQ = false;
    _sessID = sID;
    initFlush();
  }

  static function initFlush() {
    if (timer == -1) {
      timer = js.Node.setInterval(function() {
            try {
                while (waitingQs.length > 0) {
                    var mq:MessageQ = waitingQs.shift();
                    if (!flusher(mq) ) {
                      waitingQs.push(mq);
                      break;
                    }
                }
            } catch(exc:Dynamic) {
                Core.info("Got exc:"+exc);
            }
        },200,null);
    }
  }

  public function
  deQueue() {
    var q = _mq ;
    _mq = [];
    _inQ = false;
    return q;
  }
  
  public function
  append(pkt:Dynamic) {
    _mq.push(pkt);

    if (!_inQ) {
      _inQ = true;
      waitingQs.push(this);
    }
  }

  public function
  setFlusher(flush:MessageQ->Bool) {
    flusher = flush;
  }
  
  public inline function sessID() { return _sessID; }

  public function
  startFlushing(sessID:String) {
    /*
    if (flusher != null) {
      timer = js.Node.setInterval(function() {
        },250,null);
    }
    */
  }

  public function
  stopFlushing() {
    //js.Node.clearInterval(timer);
  }  
}
