
package flux.channel;

using flux.Core;
import flux.Session;
import flux.Channel;
import flux.channel.Flow;


class ClientSinkImpl extends SinkImpl {

  public function new() {
    super();
    _myfill = myfill;
  }

  function
  myfill(pkt:Pkt<Dynamic>,chan:String,?meta:Dynamic) {
    // dummy is a placeholder for the sessID which is known within the conduit client implementation
    _conduit.pump("dummy",pkt,chan,meta);
  }

  override function
  removeChan<T>(pipe:Chan<T>) {
    super.removeChan(pipe);
    unsubscribe("dummy",pipe,function(cb) {
        Core.info("ok unsubbed:"+pipe.pid());
      });
  }

  override function
  unsubscribe(sessId,pipe:Chan<Dynamic>,cb:Either<String,String>->Void) {
    _conduit.leave(pipe.pid()).deliver(cb);
  }
}