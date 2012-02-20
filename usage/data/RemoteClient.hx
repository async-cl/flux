
import cloudshift.Core;
import cloudshift.Data;
import cloudshift.Http;

using cloudshift.Mixin;

class RemoteClient {

  public static function main(){
     Data.store(REMOTESQLITE("http://localhost:8082/data/woot")).deliver(function(store) {
        store.bucket("woot").deliver(function(woot) {
           
            woot.where('name="lore"').deliver(function(recs) {
                trace(recs.stringify());
              });
            
            woot.insert({email:"lorena@ritchie.com",name:"lore",passwd:"and why not"})
              .deliver(function(u) {
                  trace("lore's id = "+Data.oid(u));
              });
          });
      });

  }

}