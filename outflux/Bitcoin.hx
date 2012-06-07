
package outflux;

import outflux.Core;
import outflux.Http;
using outflux.Mixin;
import js.Node;

typedef RpcErr = {
    var code:Int;
    var message:String;
};

typedef RpcResult = {
    var result:Dynamic;
    var error:RpcErr;
    var id:String;
}

typedef BtcAccount = String;
typedef BtcAddress = String;
typedef BtcTxnID = String;
typedef BtcAccounts = Array<{account:BtcAccount,balance:Float}>;    
typedef BtcOutcome<T> = Outcome<String,T>;

typedef BtcDetails = {
    var account:String;
    var address:String;
    var category:String;
    var amount:Float;
}

typedef BtcTxn = {
    var amount:Float;
    var account:String;
    var confirmations:Int;
    var txid:String;
    var time:String;
    var details:Array<BtcDetails>;
}

typedef BtcListSinceTxn = {
    var transactions:Array<BtcTxn>;
    var lastBlock:String;
};

typedef BtcInfo = {
    var version:String;
    var balance:Float;
    var blocks:Int;
    var connections:Int;
    var proxy:String;
    var generate:Bool;
    var genproclimit:Int;
    var difficulty:Float;
    var hashespersec:Int;
    var testnet:Bool;
    var keypoololdest:Int;
    var keypoolsize:Int;
    var paytxfee:Int;
    var errors:String;
}

typedef BtcMemPool = {
    var version:String;
    var previousblockhash:String;
    var transactions:Dynamic;
    var coinbasevalue:Int;
    var time:Int;
    var bits:String;
}

typedef BtcReceivedAccount = {
    var account:BtcAccount;
    var amount:Float;
    var confirmations:Int;
}

typedef BtcReceivedAddress = { > BtcReceivedAccount,
    var address:BtcAddress;
}

class Bitcoin {

  static var defaultId = 0;
  var _user:String;
  var _pass:String;
  var _url:String;
  var _lastID:String;
  
  public function new(host:String,port=8332,user:String,pass:String) {
    _url = Std.format("http://$host:$port/");
    trace("url = "+_url);
    _user = user;
    _pass = pass;
  }
  
  function
  jsonrpc(method:String,params:Array<Dynamic>,?id:String):BtcOutcome<Dynamic> {
    var
      mid = (id == null) ? Std.string(defaultId++) : id,
      oc = Core.outcome(),
      req = Core.stringify({method:method,params:params,id:mid}),
      headers = {},
      buff = new NodeBuffer(_user + ":" + _pass).toString('base64'),
      auth = 'Basic ' + buff;

    Reflect.setField(headers,"Content-Length",req.length);
    Reflect.setField(headers,'Authorization',auth);

    Http.post(_url,req,false,headers)
      .outcome(function(jsonResult) {
            var res:RpcResult = Core.parse(jsonResult);
            _lastID = res.id;
            oc.resolve((res.error == null) ? Right(res.result) : Left(res.error.message));
        },function(err) {
          oc.resolve(Left(err));
        });
    return oc;
  }

  /* the last jsonrpc packet id returned */
  public function getLastID() {
    return _lastID;
  }
  
  public function
  backupWallet(destination:String,?id:String):BtcOutcome<Dynamic> {
    return jsonrpc("backupwallet",[destination],id);
  }

  public function
  encryptWallet(passphrase:String,?id:String):BtcOutcome<Dynamic> {
    return jsonrpc("encryptwallet",[passphrase],id);
  }

  public function
  account(bitcoinaddress:String,?id:String):BtcOutcome<BtcAccount> {
    return cast jsonrpc("getaccount",[bitcoinaddress],id);
  }

  /**
     returns the same address until coins are received on that address; once
     coins have been received, it will generate and return a new address.
  */
  public  function
  accountAddress(account:BtcAccount,?id:String):BtcOutcome<BtcAddress> {
    return cast jsonrpc("getaccountaddress",[account],id);
  }

  public  function
  addressesByAccount(account:String,?id:String):BtcOutcome<Array<BtcAddress>> {
    return cast jsonrpc("getaddressesbyaccount",[account],id);
  }

  public function
  balance(?account:String,minconf=1,?id:String):BtcOutcome<Float> {
    var acc = (account != null) ? [account,minconf] : [];
    return cast jsonrpc("getbalance",acc,id);
  }

  public function
  transaction(txid:String,?id:String):BtcOutcome<BtcTxn> {
    return cast jsonrpc("gettransaction",[txid],id);
  }

  public function
  blockCount(?id:String):BtcOutcome<Int> {
    return cast jsonrpc("getblockcount",[],id);
  }

  public  function
  connectionCount(?id:String):BtcOutcome<Int> {
    return cast jsonrpc("getconnectioncount",[],id);
  }

  public  function
  difficulty(?id:String):BtcOutcome<Int> {
    return cast jsonrpc("getdifficulty",[],id);
  }

  public function
  generate(?id:String):BtcOutcome<Bool> {
    return cast jsonrpc("getgenerate",[],id);
  }

  public function
  hashesPerSec(?id:String):BtcOutcome<Int> {
    return cast jsonrpc("gethashespersec",[],id);
  }
  
  public function
  accounts(minconf=10,?id:String):Outcome<String,BtcAccounts> {
    var oc = Core.outcome();
    jsonrpc("listaccounts",[minconf],id).outcome(function(res) {
        var a:BtcAccounts = [];
        for (f in Reflect.fields(res.result))
          a.push({account:f,balance:Reflect.field(res.result,f)});
        oc.resolve(Right(a));
      });
    return oc;
  }
  
  public function
  transactions(account:BtcAccount,count=10,from=0,?id:String):BtcOutcome<Dynamic> {
    return cast jsonrpc("listtransactions",[account,count,from],id);
  }

  public function
  info(?id:String):BtcOutcome<BtcInfo> {
    return cast jsonrpc("getinfo",[],id);
  }

  public function
  memoryPool(?data:Dynamic,?id:String):BtcOutcome<BtcMemPool> {
    var p = (data != null) ? [data] : [];
    return cast jsonrpc("getmemorypool",p,id);
  }

  /**
     Returns a new bitcoin address for receiving payments. If [account] is
     specified (recommended), it is added to the address book so payments received
     with the address will be credited to [account].  public
  */
  public function
  newAddress(?account:BtcAccount,?id:String):BtcOutcome<BtcAddress> {
    var p = (account !=null) ? [account] : [];
    return cast jsonrpc("getnewaddress",p,id);
  }

  /**
     Returns the total amount received by addresses with [account] in transactions
     with at least [minconf] confirmations. If [account] not provided return will
     include all transactions to all accounts. (version 0.3.24-beta)
  */
  public function
  receivedByAccount(?account:BtcAccount,minConf=1,?id:String):BtcOutcome<Float> {
    var p = (account != null) ? [account,minConf] : [];
    return cast jsonrpc("getreceivedbyaccount",p,id);
  }

  /**
     Returns the total amount received by <bitcoinaddress> in transactions with at
     least [minconf] confirmations. While some might consider this obvious, value
     reported by this only considers *receiving* transactions. It does not check
     payments that have been made *from* this address. In other words, this is not
     "getaddressbalance". Works only for addresses in the local wallet, external
     addresses will always show 0.
  */
  public function
  receivedByAddress(?address:BtcAddress,minConf=1,?id:String):BtcOutcome<Float> {
    var p = (address != null) ? [address,minConf] : [];
    return cast jsonrpc("getreceivedbyaddress",p,id);
  }

  public function
  listReceivedByAccount(minConf=1,includeEmpty=false,?id:String):BtcOutcome<Array<BtcReceivedAccount>> {
    return cast jsonrpc("listreceivedbyaccount",[minConf,includeEmpty],id);
  }

  public function
  listReceivedByAddress(minConf=1,includeEmpty=false,?id:String):BtcOutcome<Array<BtcReceivedAddress>> {
    return cast jsonrpc("listreceivedbyaddress",[minConf,includeEmpty],id);
  }

  public function
  transactionsSinceBlock(?blockId:String,targetConfirmations=1,?id:String):BtcOutcome<BtcListSinceTxn> {
    var p = (blockId != null) ? [blockId,targetConfirmations] : [];
    return cast jsonrpc("listsinceblock",p,id);
  }

  public function
  move(from:BtcAccount,to:BtcAccount,amount:Float,minConf=1,?comment:String,?id:String):BtcOutcome<Dynamic> {
    return cast jsonrpc("move",[from,to,amount,minConf,comment],id);
  }

  public function
  sendFrom(fromAccount:BtcAccount,to:BtcAddress,amount:Float,minConf=1,?comment:String,?commentTo:String,?id:String):BtcOutcome<BtcTxnID> {
    return cast jsonrpc("sendfrom",[fromAccount,to,amount,minConf,comment,commentTo],id);
  }

  public function
  sendMany(fromAccount:BtcAccount,many:Dynamic,minConf=1,?comment:String,?id:String):BtcOutcome<BtcTxnID> {
    return cast jsonrpc("sendmany",[fromAccount,many,minConf,comment],id);
  }

  public function
  sendToAddress(address:BtcAddress,amount:Float,minConf=1,?comment:String,?commentTo:String,?id:String):BtcOutcome<BtcTxnID> {
    return cast jsonrpc("sendtoaddress",[address,amount,minConf,comment,commentTo],id);
  }

  /**
     Sets the account associated with the given address. Assigning address that
     is already assigned to the same account will create a new address
     associated with that account.
   */
  public function
  setAccount(bitcoinAddress:BtcAddress,account:BtcAccount,?id:String) {
    return jsonrpc("setaccount",[bitcoinAddress,account],id);
  }

  public function
  setGenerate(generate:Bool,genProcLimit=-1,?id:String) {
    return jsonrpc("setgenerate",[generate,genProcLimit],id);
  }

  public function
  signMessage(address:BtcAddress,message:String,?id:String) {
    return jsonrpc("signmessage",[address,message],id);
  }

  public function
  setTxFee(amount:Float,?id:String) {
    return jsonrpc("settxfee",[amount],id);
  }

  public function
  stop(?id:String) {
    return jsonrpc("stop",[],id);
  }

  public function
  validateAddress(address:BtcAddress,?id:String) {
    return jsonrpc("validateaddress",[address],id);
  }

  public function
  verifyMessage(address:BtcAddress,signature:Dynamic,message:Dynamic,?id:String) {
    return jsonrpc("verifymessage",[address,signature,message],id);
  }

  /**
     Removes the wallet encryption key from memory, locking the wallet. After
     calling this method, you will need to call walletpassphrase again before being
     able to call any methods which require the wallet to be unlocked.  public
     function
  */
  public function walletLock(?id:String) {
    return jsonrpc("walletlock",[],id);
  }

  /**
     Stores the wallet decryption key in memory for <timeout> seconds.
   */
  public function
  walletPassPhrase(passphrase:String,timeout:Int,?id:String) {
    return jsonrpc("walletpassphrase",[passphrase,timeout],id);
  }

  public function
  walletChangePassPhrase(oldpp:String,newpp:String,?id:String) {
    return jsonrpc("walletchangepassphrase",[oldpp,newpp],id);
  }
  
}