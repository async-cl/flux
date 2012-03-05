
import cloudshift.Core;
import cloudshift.Data;
import cloudshift.Http;

using cloudshift.Mixin;

class RemoteClient {

  public static function main(){
     Data.store(REMOTESQLITE("http://localhost:8082/data")).good(function(store) {
        store.bucket("woot").outcome(function(woot) {
           
            woot.where('name="lore"').outcome(function(recs) {
                trace(recs.stringify());
              });
            
            woot.insert({email:"lorena@ritchie.com",name:"lore",passwd:"and why not"})
              .outcome(function(u) {
                  trace("lore's id = "+Data.oid(u));
              });
          });

        store.hash("peeps").good(function(peeps) {
            peeps.set("me",{email:"lorena@ritchie.com",name:"lore",passwd:"and why not"})
              .outcome(function(p) {
                  peeps.get("me").outcome(function(me) {
                      if (me.name == "lore")
                        trace("yep got it");
                    });
                });
          });
       });
  }
}