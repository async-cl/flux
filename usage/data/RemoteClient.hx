
import flux.Core;
import flux.Data;
import flux.Http;

using flux.Mixin;

class RemoteClient {

  public static function main(){
     Data.store(REMOTESQLITE("http://localhost:8082/data")).outcome(function(store) {
        store.bucket("woot").outcome(function(woot) {
           
            woot.where('name="lore"').outcome(function(recs) {
                trace(recs.stringify());
              });
            
            woot.insert({email:"lorena@ritchie.com",name:"lore",passwd:"and why not"})
              .outcome(function(u) {
                  trace("lore's id = "+Data.oid(u));
              });
          });

        store.hash("peeps").outcome(function(peeps) {
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