const { pos } = require('../../config');
const { getPOSClient, from } = require('../../utils');

const execute = async () => {
  const client = await getPOSClient();
  const erc20Token = client.erc20(pos.parent.erc20, true);

  const result = await erc20Token.withdrawExit('0x548a88d6af6633537def2b3b5deb311198ece649f6aa4ade9ec574ff0fda7698');
  // const result = await erc20Token.withdrawExit('0xa3b4813553b2d07f383fd67ef8ff5b12dc4c14805f7f5ea716e1224d50cab98b');

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
  const receipt = await result.getReceipt();
  console.log("receipt", receipt);

}
execute().then(() => {
}).catch(err => {
  console.error("err", err);
}).finally(_ => {
  process.exit(0);
})