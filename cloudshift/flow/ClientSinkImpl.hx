
package cloudshift.flow;

import cloudshift.Core;
import cloudshift.Session;
import cloudshift.Flow;
import cloudshift.flow.InternalApi;


class ClientSinkImpl extends SinkImpl {

  var _sessID:String;
  
  public function new(sess:SessionClient) {
    super();
    _sessID = sess.sessID();
    _myfill = myfill;
  }

  function
  myfill(pkt:Pkt<Dynamic>,chan:String,?meta:Dynamic) {
    _conduit[0].pump(_sessID,pkt,chan,meta);
  }

  override function
  removePipe<T>(pipe:Pipe<T>) {
    super.removePipe(pipe);
    reqUnsub(_sessID,pipe,function(cb) {
        Core.info("ok unsubbed:"+pipe.pid());
      });
  }

  override function
  reqUnsub(sessId,pipe:Pipe<Dynamic>,cb:Either<String,String>->Void) {
    _conduit[0].leave(pipe.pid()).deliver(cb);
  }
}