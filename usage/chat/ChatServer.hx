/**
   hxc: -D nodejs
*/

import cloudshift.Core;
import cloudshift.Http;
import cloudshift.Session;
using cloudshift.Mixin;
import cloudshift.Channel;

import ChatTypes;

class ChatServer {

  static var nicks = new Hash<String>();
  
  public static function main() {
    new ChatServer();
  }
  
  public function new() {
    Core.init();
    Http.server()
      .root("www")
      .start({host:"localhost",port:8082})
      .outcome(function(http) {
          Channel.server()
            .addHttpServer(http)
            .addChannelAuth(channelAuth)
            .addSessionAuth(sessAuth)
            .start({}).outcome(startRooms);
        });    
  }

  function channelAuth(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    if (chan.pid() != "/secret") {
      cb(Right("")); // setup up new connection so it can get next msg too
      //room.fill(System(Arrives(sess.stash(sessID,"nick").get(),nicks.keyArray())));
    } else {
      cb(Left("no way"));
    }
  }

  function sessAuth(event:ESessionOp) {
    trace("authing");
    switch(event) {
    case Login(pkt,reply):
      trace("logging in with "+pkt);
      var lp:LoginPkt = pkt;
      if (nicks.exists(lp.nick)) {
        trace("user exists");
        reply(UserExists);
      } else {
        var sessID = genID();
        nicks.set(lp.nick,sessID);
        trace("userOK");
        reply(UserOk(sessID));  
      }

    case Signup(pkt,reply):
      reply(UserOk(genID()));

    case Logout(sessID,reply):
      trace("got Logout for "+sessID);
      for(n in nicks.keys()) {
        if (nicks.get(n) == sessID) {
          nicks.remove(n);
          //room.fill(System(Leaves(n)));
        }
      }

      reply(UserRemoved);
    }
  }

  public function
  startRooms(cs:ChannelServer) {
    Core.listParts();
    cs.channel("/chat/room").outcome(function(room) {
        trace("added rooms");
        room.filter(function(o) {
            switch(o) {
            case Chat(nick,msg):
              return Chat(nick.toUpperCase(),msg);
            default:
            }
            return o;
          });
    
        room.peek(function(pe) {
            switch(pe) {
            case Add(i):
              room.fill(Chat("bot","someone entered"));
            case Del(i):
              room.fill(Chat("bot","someone left"));
            }
          });
      });
  }

  public static inline function
  genID():String {
    return Std.string(Math.floor(Math.random() * 1e10));
  }


}


