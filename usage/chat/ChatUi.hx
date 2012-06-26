
using flux.Core;
import ChatTypes;
import js.JQuery;

class ChatUi {

  static var chatBox:JQuery;
  static var memBox:JQuery;
  static var say:JQuery;
  static var members = [];
  
  public static function
  init(doLogin:String->Void,doLogout:Void->Void) {
    new JQuery("#btnLogin").click(function(e) {
        new JQuery("#divLogin").hide();
        new JQuery("#divLogout").show();
        doLogin(new JQuery("#nick").val());
      });
    
    new JQuery("#btnLogout").click(function(e) {
        doLogout();
      });
  }

  public static function
  reset() {
    chatBox.empty();
    memBox.empty();
    say.val("");
    new JQuery("#divLogin").show();
    new JQuery("#divLogout").hide();
  }

  public static function
  setChat(chat:String->Void) {
    chatBox = new JQuery("#chat");
    memBox = new JQuery("#members");
    say = new JQuery("#chatsay");

    say.unbind("keyup");
    say.keyup(function(e) {
        if (e.keyCode == 13) {
          var v = say.val();
          if (v != "") {
            chat(v);
            say.val("");
            e.preventDefault();
         }
        }
      });    

  }
      
  public static function
  status(msg) {
    new JQuery("#status").html(msg);
  }

  public static function
  msg(nick,msg) {
    chatBox.append('<div><b>' + nick + ':</b>&nbsp;' + msg + '</div>');
  }

  public static function
  renderSystem(msg) {
    chatBox.append('<div><b>***&nbsp;' + msg + '***</b></div>');
  }

  public static function
  renderMembers() {
    trace("rendering members:"+members.stringify());
    memBox.empty().html(members.map(function(el) return '<div>' + el + '</div>').join(""));
  }

  public static function
  systemMsg(smt) {
    switch(smt) {
    case Welcome:
    case Arrives(n,nicks):
      renderSystem(n+" arrives");
      members = nicks;
      renderMembers();
    case Leaves(n):
      renderSystem(n+" leaves");
      var p = members.indexOf(n);
      if (p != -1) {
        members.splice(p,1);
        renderMembers();
      }
    }
  }

}