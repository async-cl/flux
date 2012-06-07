
import outflux.Core;
import outflux.Session;
import outflux.Channel;
using outflux.Mixin;

import ChatUi;
import ChatTypes;

class ChatClient {

  var _room:Chan<Dynamic>;
  var _session:SessionClient;
  var _chanClient:ChannelClient;
  
  public static function main() {
    new ChatClient();
  }
  
  public function new() {
    ChatUi.init(login,logout);
  }

  function login(nick:String) {
    Session.client()
      .start({endPoint:"https://"+js.Lib.window.location.host})
      .outcome(function(sess) {
          _session = sess;
          sess.login({nick:nick}).outcome(function(sessID) {
              Channel.client()
                .start(_session)
                .outcome(function(client) {
                    _chanClient = client;
                    startRoom(nick,client);
                  },function(reason) {
                    trace(reason);
                  });
            },function(err) {
              trace("Can't login:"+err);
            });
        });
  }
 
  public function
  startRoom(nick:String,client:ChannelClient) {
    client.channel("/chat/room")
      .outcome(function(room) {
          _room = room;
          ChatUi.status("authorized in room");
          ChatUi.setChat(function(msg) {
              trace("should be sending "+msg);
              room.pub(Chat(nick,msg));
            });
        
          room.sub(function(mt:MsgTypes) {
              switch(mt) {
              case Chat(nick,msg):
                ChatUi.msg(nick,msg);
              case System(smt):
                ChatUi.systemMsg(smt);
              }
            });
        },function(reason) {
          ChatUi.status("you're not authorised" +reason);
        });
  }


  function logout() {
    _chanClient.stop().outcome(function(el) {
      trace("stopped channelclient");
      _session.logout().outcome(function(el) {
        trace("invalidate session on server");
        });
      });
    
    ChatUi.reset();
  }
}
