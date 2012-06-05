
/*
  hxc: -D nodejs
*/

package ;

#if nodejs
import cloudshift.Core;
import cloudshift.Http;
import cloudshift.Remote;
using cloudshift.Mixin;
#end

class Server {

  static function main() {
    new Server();
  }
  
  public function new() {
    #if nodejs
    Http.server()
      .root("www")
      .start({host:"localhost",port:8082})
      .outcome(function(http) {
          trace("Creating remote");
          var remotes = Remote.provider("Test",this);
          http.handler(new EReg("/remotes",""),remotes.httpHandler);
        });
    #end
  }

  public function echo(s:String,cb:String->Void) {
    cb(s);
  }

}