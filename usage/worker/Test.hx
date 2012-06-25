
import flux.Worker;

import OtherProcess;

private class OtherProxy extends haxe.remoting.AsyncProxy<OtherProcess> { }

class Test {

  public static function main() {
    Worker.run(Test);
  }
  
  public function new() {
    var
      worker = Worker.create(OtherProcess);

    var _proxy = new OtherProxy(worker.OtherProcess);
    
    worker.OtherProcess.foo.call([1,4],function(result) {
          trace("woot:"+result);
        });

    _proxy.foo(2,5,function(res) {
        trace("proxy res:"+res);
      });

  }
}


