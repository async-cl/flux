
package flux.channel;

using flux.Core;
import flux.Session;
import flux.Channel;
import flux.channel.Flow;


class ClientSinkImpl extends SinkImpl {

  public function new() {
    super();
    _outgoing = outgoing;
  }

  function
  outgoing(pkt:Pkt<Dynamic>,chan:String,?meta:Dynamic) {
    // dummy is a placeholder for the sessID which is known within the conduit client implementation
    _conduit.outgoing("dummy",pkt,chan,meta);
  }

  override function
  removeChan<T>(pipe:Chan<T>) {
    super.removeChan(pipe);
    _conduit.leave(pipe.pid()).deliver(function(cb) {
        Core.info("ok unsubbed:"+pipe.pid());
      });
    
  }

}