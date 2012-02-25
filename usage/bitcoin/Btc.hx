
import cloudshift.Core;
import cloudshift.Bitcoin;

using cloudshift.Mixin;

class Btc {

  public static function
  main() {

    var bitcoin = new Bitcoin("localhost",8332,"ritchie","elena");
    bitcoin.balance().deliver(function(pkt) {
        var b:Float = pkt.result; 
        trace("balance = "+b);
      });

    
    bitcoin.transaction("a2fca474dc815873806f800f8dd5b5fd0b5ee4396bc1537c7e1ae96377a2f7a9")
      .deliver(function(trans) {
          trace(trans);
          });

    bitcoin.account("16EjYirZNFR8QLokR4CSCfNa3ARxnTNhSj").deliver(function(res) {
        trace("account="+res.result);
        bitcoin.accountAddress(res.result).deliver(function(res) {
          trace("address= "+res.result);
        });
      });

    bitcoin.addressesByAccount("From tradehill").deliver(function(res) {
        trace(res);
      });

    bitcoin.blockCount().deliver(function(res) {
        trace("blockcount = "+res.result);
      });

    bitcoin.connectionCount().deliver(function(res) {
        trace("connection count = "+res.result);
      });

    bitcoin.difficulty().deliver(function(res) {
        trace("difficulty = "+res.result);
      });

    bitcoin.generate().deliver(function(res) {
        trace("generating = "+res.result);
      });

    bitcoin.hashesPerSec().deliver(function(res) {
        trace("hashes persec = "+res.result);
      });

    bitcoin.info().deliver(function(res) {
        trace("info="+Core.stringify(res.result));
      });

    /*
    bitcoin.memoryPool().deliver(function(res) {
        trace("mempool="+Core.stringify(res));
      });
    */
    
    bitcoin.receivedByAccount("from tradehill").deliver(function(res) {
        trace("recieved from tradehill="+res.result);
      });
    
    /*
    bitcoin.accounts().deliver(function(accs) {
        accs.foreach(function(acc) {
            bitcoin.transactions(acc.account).deliver(function(trans) {
                trace(trans);
              });
          });
      });
    */
  }


}