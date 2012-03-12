
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Session;
import cloudshift.Channel;
import cloudshift.channel.Flow;
import cloudshift.channel.InternalApi;


class ClientSinkImpl extends SinkImpl {

  var _sessID:String;
  
  public function new(sess:String) {
    super();
    _sessID = sess;
    _myfill = myfill;
  }

  function
  myfill(pkt:Pkt<Dynamic>,chan:String,?meta:Dynamic) {
    _conduit[0].pump(_sessID,pkt,chan,meta);
  }

  override function
  removeChan<T>(pipe:Chan<T>) {
    super.removeChan(pipe);
    reqUnsub(_sessID,pipe,function(cb) {
        Core.info("ok unsubbed:"+pipe.pid());
      });
  }

  override function
  reqUnsub(sessId,pipe:Chan<Dynamic>,cb:Either<String,String>->Void) {
    _conduit[0].leave(pipe.pid()).deliver(cb);
  }
}