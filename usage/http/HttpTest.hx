


/*
openssl genrsa -out privatekey.pem 1024 
openssl req -new -key privatekey.pem -out certrequest.csr 
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
*/


import cloudshift.Core;
import cloudshift.Http;
using cloudshift.Mixin;

class HttpTest {

  public static function
  main() {
    Core.init();

    /*
    Http.get("http://bingocoin.net").deliver(function(html) {
        trace(html);
      });
    */

    Http.server()
      .root("www")
      .credentials("privatekey.pem","certificate.pem")
      .start({host:"localhost",port:8000}).outcome(function(http) {

        });
  }

}
