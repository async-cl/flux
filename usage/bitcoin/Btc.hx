
import cloudshift.Core;
import cloudshift.Bitcoin;

using cloudshift.Mixin;

class Btc {

  public static function
  main() {

    var btc = new Bitcoin("localhost",8332,"ritchie","elena");
    btc.balance().outcome(function(b) {
        trace("balance = "+b);
      });

    
    btc.transaction("a2fca474dc815873806f800f8dd5b5fd0b5ee4396bc1537c7e1ae96377a2f7a9")
      .outcome(function(trans) {
          trace(trans);
          });

    btc.account("151ubHvkw8f9eLHWddMSv4ex8zk8hEYhtu").outcome(function(account) {
        trace("account="+account);
        btc.listReceivedByAccount(account).outcome(function(res) {
            trace("------------------------");
            for (t in res) {
              trace(t.account + ": "+t.amount);
            }
            trace("------------------------");
          });

        /*
        btc.accountAddress(account).outcome(function(address) {
          trace("address= "+address);
          
        });
        */
      });

    btc.addressesByAccount("From tradehill").outcome(function(res) {
        trace(res);
      });

    btc.blockCount().outcome(function(res) {
        trace("blockcount = "+res);
      });

    btc.connectionCount().outcome(function(res) {
        trace("connection count = "+res);
      });

    btc.difficulty().outcome(function(res) {
        trace("difficulty = "+res);
      });

    btc.generate().outcome(function(res) {
        trace("generating = "+res);
      });

    btc.hashesPerSec().outcome(function(res) {
        trace("hashes persec = "+res);
      });

    btc.info().outcome(function(res) {
        trace("info="+Core.stringify(res));
      });

    /*
    btc.memoryPool().outcome(function(res) {
        trace("mempool="+Core.stringify(res));
      });
    */
    
    btc.receivedByAccount("elena@ritchie.com").outcome(function(res) {
        trace("recieved by elena="+res);
      });


    btc.transactionsSinceBlock("169110").outcome(function(listsince) {
        for (t in listsince.transactions) {
          trace(Std.format("--> ${t.amount} ${t.account}"));
        }
      });

    
    /*
    btc.accounts().outcome(function(accs) {
        accs.foreach(function(acc) {
            btc.transactions(acc.account).outcome(function(trans) {
                trace(trans);
              });
          });
      });
    */
  }


}