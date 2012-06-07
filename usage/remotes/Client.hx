
package ;

import outflux.Core;
using outflux.Mixin;


class ClientProxy extends haxe.remoting.AsyncProxy<Server>{}

class Client {


  static function main() {
    new Client();
  }
  
  public function new() {
    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect("http://localhost:8082/remotes");
    cnx.setErrorHandler( function(err) trace("Error : "+Std.string(err)) );
    var p = new ClientProxy(cnx.Test);

    p.echo("woot",function(s) {
        trace("client return:"+s);
      });


    
  }

  

}