
package cloudshift.channel;
import cloudshift.channel.Flow;

using cloudshift.Mixin;

class MessageQImpl implements MessageQ {

  static var timer:Int = -1;
  static var waitingQs:Array<MessageQ> = [];
  static var deferredQs:Array<MessageQ> = [];
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
            while (waitingQs.length > 0) {
                var mq:MessageQ = waitingQs.shift();
                if (!flusher(mq) ) {
                  deferredQs.push(mq);
                }
            }
        },200,null);


      var deferredTimer = js.Node.setInterval(function() {
            if (deferredQs.length > 1)
              waitingQs.push(deferredQs.shift());
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

}
