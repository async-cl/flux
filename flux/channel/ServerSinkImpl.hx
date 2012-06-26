
package flux.channel;

using flux.Core;
import flux.Session;
import flux.Channel;
import flux.channel.Flow;
import flux.Http;


class ServerSinkImpl extends SinkImpl {

  public function new() {
    super();
    _myfill = myfill;
  }
    
  override function
  reqSub(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    var pID = chan.pid();
    notify(Authorize(sessID,chan,function(e:Either<String,String>) {
          switch(e) {
          case Right(_):
            var unsub = chan.sub(function(payload:Dynamic) {
                  _conduit.pump(sessID,payload,pID,null);
                  //notify(Outgoing(sessID,payload,pID,null));
              });

            trace("added sub "+pID+" for "+sessID);
            _conduit.subscriptions(sessID).set(pID,unsub);
          cb(e);
          case Left(_):
            cb(e);
          }
        }));
  }

  override function
  reqUnsub(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    switch(_conduit.subscriptions(sessID).getOption(chan.pid())) {
      case Some(f):
        trace("remove function for "+chan.pid());
        f();
        cb(Right(""));
      case None:
        cb(Left("Didn't find reference to unsub"));
      }
  }

  override function
  removeAllSubs(sessID) {
    var subs = _conduit.subscriptions(sessID) ;
    if (subs != null) 
      subs.values().foreach(function(f) f());
  }
  
  /* in the case of the server doing a fill on a channel then that's a
     broadcast, however, the payload needs to be converted into a packet and
     then by using defaultFill is passed to all the other subscribers from off
     world */

  function myfill(payload,chanID,meta) {
    _chans.get(chanID)._defaultFill(Channel.createPkt(payload,"server",chanID,meta),chanID,null);
  }

}
  