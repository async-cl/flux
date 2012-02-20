
import cloudshift.Http;
import cloudshift.Core;
import cloudshift.Data;

using cloudshift.Mixin;

class RemoteSource {

  public static function main(){ 
    Http.server().root("www").start({host:"localhost",port:8082}).deliver(function(server) {
        Data.store(SQLITE("test.db")).deliver(function(store) {
                store.bucket("woot").deliver(function(woot) {
                    woot.indexer("name",function(o:Dynamic) {
                        return o.name;
                      }).deliver(function(el) {
                          Data.serve(server,woot,"/data/woot");
                    });
                  });
            });
      });
  }

}