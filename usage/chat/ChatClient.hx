
import cloudshift.Core;

import cloudshift.Session;
import cloudshift.Flow;

using cloudshift.Mixin;

import ChatUi;
import ChatTypes;

class ChatClient {

  public static function main() {
    new ChatClient();
  }
  
  public function new() {
    Session.client()
      .start({host:"localhost",port:8082})
      .deliver(function(sess) {
          ChatUi.init(function(nick) {
              sess.observe(function(e:ESession) {
                  switch(e) {
                  case UserOk(sessID):
                    trace("Got login, starting flow");
                    start(nick,sess);
                  case UserExists:
                    ChatUi.status("sorry that nick is taken");
                  case UserRemoved:
                    ChatUi.status("login to chat");
                  case UserNoUser:
                  }
                });
              sess.login({nick:nick});
            },callback(logout,sess));
        });
  }

  function logout(sess) {
    //sink.leave(room);
    ChatUi.reset();
    //sess.logout();
  }
  
  function start(nick:String,sess:SessionClient) {
    Flow.pushConduit()
      .start({host:"localhost",port:8082,sessID:sess.sessID()})
      .deliver(function(conduit) {
          startSink(nick,sess,conduit);
        });
  }

  public function
  startSink(nick:String,sess:SessionClient,conduit:Conduit) {
    Flow.sink(sess)
      .start(conduit)
      .deliver(function(sink) {
          startRoom(nick,sink);
        });
  }

  public function
  startRoom(nick:String,sink:Sink) {
    sink
      .authorize(sink.pipe("/chat/room"))
      .deliver(function(authorized) {
          switch(authorized) {
          case Right(room):
            ChatUi.status("authorized in room");
            ChatUi.setChat(function(msg) {
                room.fill(Chat(nick,msg));
              });
           
            room.drain(function(mt:MsgTypes) {
                trace("got msg:"+mt.stringify());
                switch(mt) {
                case Chat(nick,msg):
                  ChatUi.msg(nick,msg);
                case System(smt):
                  ChatUi.systemMsg(smt);
                }
              });
          case Left(reason):
            trace("sorry cann't authorize:"+reason);
          }
        });
  }
}