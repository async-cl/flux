

import cloudshift.Core;
import cloudshift.Sys;

using cloudshift.Sys;
using cloudshift.Mixin;

import cloudshift.Sys;

class TestFs {

  public static function
  main() {

    Sys.writeFile("woot","hi there")
      .oflatMap(function(file) {
            return file.stat();
        })
      .omap(function(stat) {
          return stat.path;
        })
      .oflatMap(function(path) {
          return path.rename("niceone");
        })
      .outcome(function(newFileName) {
          trace("cool "+newFileName);
              
          var p = Sys.events();
        
          p.observe(function(o) {
              switch(o) {
              case ProcessUncaughtException(ex):
                trace("uuncauthg exp:"+ex);
              default:
              }
            });

          trace(Sys.argv());
          trace(Sys.title());
          trace("osuptime:"+Sys.osUptime()+", uptime:"+Sys.uptime());
          
          
          Sys.stdout().write("nice one laddie");
          
          Sys.spawn("ls").outcome(function(child) {
              child.stdout.observe(function(e) {
                  switch(e) {
                  case Data(s):
                    trace(s);
                  default:
                  }
                });
            });

          Sys.execFile("ls").outcome(function(output) {
                trace(output);              
            });
        });
  }

}