import outflux.Worker;


class OtherProcess extends Worker {

  public function new() {
    super();
  }
  
  public function foo(x:Int,y:Int,cb:Int->Void):Void {
    cb(x+y);
  }
}
