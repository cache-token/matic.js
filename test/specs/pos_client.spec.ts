import { erc20, from, getPOSClient, posClient, posClientForTo, privateKey, RPC, to, toPrivateKey } from './client';
import { expect } from 'chai';
import { ABIManager } from '../../dist/matic.node.js';
import { providers, Wallet } from 'ethers';
import HDWalletProvider from '@truffle/hdwallet-provider';

describe('POS Client', (network = 'testnet', version = 'mumbai') => {
  const abiManager = new ABIManager('testnet', 'mumbai');

  before(() => {
    return Promise.all([abiManager.init()]);
  });

  it('depositEther return transaction', async () => {
    const amount = 100;
    const client = await getPOSClient();
    const result = await client.depositEther(amount, from, {
      returnTransaction: true,
      gasLimit: 799795,
    });
    const rootChainManager = '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483';
    expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
    expect(result['value']).equal('0x64');
  });
});
