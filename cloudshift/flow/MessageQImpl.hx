
package cloudshift.flow;
import cloudshift.Flow;
import cloudshift.flow.InternalApi;

using cloudshift.Mixin;

class MessageQImpl implements MessageQ {

  static var timer:Int = -1;
  static var waitingQs:Array<SessionQueue> = [];
  static var flusher:SessionQueue->Bool;
  
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
        while (waitingQs.length > 0) flusher(waitingQs.shift());
        },200,null);
    }
  }

  public function
  append(pkt:Dynamic) {
    _mq.push(pkt);
   
    if (!_inQ) {
      _inQ = true;
      waitingQs.push({sID:_sessID,queue:function() {
            var p = _mq;
            _inQ = false;
            _mq = [];
            return p;
          }
        });
    }
  }

  public function
  setFlusher(flush:SessionQueue->Bool) {
    flusher = flush;
  }

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
