const { pos } = require('../../config');
const { getPOSClient, from } = require('../../utils');
const { ABIManager } = require('../../../dist/matic.node.js');
const { abi } = require('../../abis/rootTunnel.json');

const abiManager = new ABIManager('testnet', 'mumbai');
console.log(abi);
const setabi = async () => {
  await abiManager.init();
  await abiManager.setABI('RootChainManager', 'pos', abi);
};
const execute = async () => {
  setabi()
    .then(async () => {
      console.log(abi, await abiManager.getABI('RootChainManager', 'pos'));
      const client = await getPOSClient();
      const erc20Token = client.erc20(pos.parent.erc20, true);

      const result = await erc20Token.withdrawExit(
        '0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8',
        {
          gasLimit: 800000,
        }
      );
      // const result = await erc20Token.withdrawExit('0xa3b4813553b2d07f383fd67ef8ff5b12dc4c14805f7f5ea716e1224d50cab98b');

      const txHash = await result.getTransactionHash();
      console.log('txHash', txHash);
      const receipt = await result.getReceipt();
      console.log('receipt', receipt);
    })
    .catch(err => {
      console.error('err', err);
    });
};
execute();
