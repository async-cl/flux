/**
   hxc: -D nodejs
*/

import cloudshift.Core;
import cloudshift.Http;
import cloudshift.Session;
import cloudshift.Flow;
using cloudshift.Mixin;

import ChatTypes;

class ChatServer {

  static var conduit:Conduit;
  
  public static function main() {
    new ChatServer();
  }
  
  public function new() {
    Http.server()
      .root("www")
      .start({host:"localhost",port:8082})
      .deliver(function(http) {         
          Flow.quickFlow()
            .start(http)
            .deliver(rooms);
        });
  }
  
  public static function
  rooms(chat:QuickFlow) {
    var
      sess = chat.session,
      nicks = new Hash<Bool>(),
      room:Pipe<MsgTypes> = chat.sink.pipe("/chat/room");

    sessionObserve(sess,room,nicks);
    
    chat.sink.observe(function(dd:SinkEvent) {
        switch(dd) {
        case Authorize(sessID,pipe,cb):
          if (pipe.pid() != "/secret") {
            cb(Right("")); // setup up new connection so it can get next msg too
            room.fill(System(Arrives(sess.stash(sessID,"nick").get(),nicks.keyArray())));
          } else {
            cb(Left("no way"));
          }
        case ConnectionClose(sessID):
          switch(sess.stash(sessID,"nick")) {
          case Some(n):
            room.fill(System(Leaves(n)));
            nicks.remove(n);
          case None:
          }
        }
      });
    
    room.drain(function(p) {
      });

    room.drainPkt(function(pkt) {
      });
    
    room.filter(function(o) {
        switch(o) {
        case Chat(nick,msg):
          return Chat(nick.toUpperCase(),msg);
        default:
        }
        return o;
      });
    
    room.filterPkt(function(pkt) {
        return pkt;
      });

    room.peek(function(pe) {
        switch(pe) {
        case Add(i):
          room.fill(Chat("bot","someone entered"));
        case Del(i):
          room.fill(Chat("bot","someone left"));
        }
      });    
  } 

 public static function
 sessionObserve(sess:SessionMgr,room:Pipe<MsgTypes>,nicks:Hash<Bool>) {
    sess.observe(function(ss:ESessionOp) {
        switch(ss) {
        case Login(pkt,cb):
          var lp:LoginPkt = pkt;
          if (nicks.exists(lp.nick)) {
            cb(UserExists);
          } else {
            nicks.set(lp.nick,true);
            var sessID = genID();
            sess.stash(sessID,"nick",lp.nick);
            cb(UserOk(sessID));  
          }
        case Signup(pkt,cb):
          cb(UserOk(genID()));
        case Logout(sessID,cb):
          var n = sess.stash(sessID,"nick").get();
          room.fill(System(Leaves(n)));
          nicks.remove(n);
          
          //conduit.close(sessID);
          
          cb(UserRemoved);
        }
      });    
  }

  
  public static inline function
  genID():String {
    return Std.string(Math.floor(Math.random() * 1e10));
  }


}


