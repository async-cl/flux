
package cloudshift.channel;

import cloudshift.Core;
import cloudshift.Session;
import cloudshift.Channel;
import cloudshift.channel.Flow;

using cloudshift.Mixin;

class ClientSinkImpl extends SinkImpl {

  public function new() {
    super();
    _myfill = myfill;
  }

  function
  myfill(pkt:Pkt<Dynamic>,chan:String,?meta:Dynamic) {
    _conduit.pump("dummy",pkt,chan,meta);
    //notify(Outgoing("dummy",pkt,chan,meta));
  }

  override function
  removeChan<T>(pipe:Chan<T>) {
    super.removeChan(pipe);
    reqUnsub("dummy",pipe,function(cb) {
        Core.info("ok unsubbed:"+pipe.pid());
      });
  }

  override function
  reqUnsub(sessId,pipe:Chan<Dynamic>,cb:Either<String,String>->Void) {
    _conduit.leave(pipe.pid()).deliver(cb);
  }
}