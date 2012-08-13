using flux.Core;
import flux.Http;
import flux.Session;
import flux.Channel;

import ChatTypes;

class ChatServer {

  static var _nicks = new Hash<String>();
  static var _room:Chan<MsgTypes>;
  
  static function main() {
    Core.init();    
    Http.server()
      .root("www")
      .credentials("privatekey.pem","certificate.pem")
      .start({host:"localhost",port:8082})
      .outcome(function(http) {
          Session.manager().start(http)
            .outcome(function(sess:SessionMgr) {
                sess.authorizer(sessAuth);
                Channel.server()
                  .addChannelAuth(channelAuth)
                  .start(sess).outcome(startRooms);
              });
        });
  }
  
  static function sessAuth(event:ESessionOp) {
    switch(event) {
    case Login(pkt,reply):
      trace("logging in with "+pkt);
      var lp:LoginPkt = pkt;
      if (_nicks.exists(lp.nick)) {
        reply(UserExists);
      } else {
        var sessID = genID();
        _nicks.set(lp.nick,sessID);

        js.Node.setTimeout(function(a:Dynamic) {
            _room.pub(System(Arrives(a[0],untyped a[1])));
          },1000,[lp.nick,_nicks.keyArray()]);

        reply(UserOk(sessID));
      }

    case Signup(pkt,reply):
      reply(UserOk(genID()));

    case Logout(sessID,reply):
      for(n in _nicks.keys()) {
        if (_nicks.get(n) == sessID) {
          _nicks.remove(n);        
        }
      }
      reply(UserRemoved);
    }
  }

  static function startRooms(cs:ChannelServer) {
    cs.channel("/chat/room").outcome(function(room) {
        _room = room;
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
              room.pub(Chat("bot","someone entered"));
            case Del(i):
              room.pub(Chat("bot","someone left"));
            }
          });
      });
  }

  static function channelAuth(sessID:String,chan:Chan<Dynamic>,cb:Either<String,String>->Void) {
    if (chan.pid() != "/secret") {
      cb(Right("")); // setup up new connection so it can get next msg too

      trace("doing channel auth");
      
    } else {
      cb(Left("no way"));
    }
  }

  public static inline function
  genID():String {
    return Std.string(Math.floor(Math.random() * 1e10));
  }


}


