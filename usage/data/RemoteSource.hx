
import cloudshift.Http;
import cloudshift.Core;
import cloudshift.Data;

using cloudshift.Mixin;

class RemoteSource {

  public static function main(){ 
    Http.server().root("www").start({host:"localhost",port:8082}).outcome(function(http) {
        Data.store(SQLITE("test.db")).outcome(function(store) {
                store.bucket("woot").outcome(function(woot) {
                    woot.indexer("name",function(o:Dynamic) {
                        return o.name;
                      }).outcome(function(el) {
                          Data.serveBucket(http,woot,"/data/woot");
                        });
                  });
                store.hash("peeps").outcome(function(peeps) {
                    Data.serveHash(http,peeps,"/data/peeps");
                  });
            });
      });
  }

}