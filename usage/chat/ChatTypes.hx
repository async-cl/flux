


typedef LoginPkt = {
    var nick:String;
}

enum SysMsg {
  Welcome;
  Arrives(nick:String,nicks:Array<String>);
  Leaves(nick:String);
}

enum MsgTypes {
  Chat(nick:String,msg:String);
  System(msg:SysMsg);
}
