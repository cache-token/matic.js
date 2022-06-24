import HDWalletProvider from '@truffle/hdwallet-provider';
import { POSClient } from '../../dist/matic.node.js';
import { user1, rpc, pos, user2 } from '../config';
import { providers, Wallet } from 'ethers';
export const privateKey = user1.privateKey;
export const from = user1.address;
export const to = user2.address;
export const toPrivateKey = user2.privateKey;
const parentProvider = new providers.JsonRpcProvider(rpc.parent);
const childProvider = new providers.JsonRpcProvider(rpc.child);
export const RPC = rpc;
export const rootChainManagerAddress = pos.parent.rootChainManagerAddress;
export const erc20 = {
  parent: pos.parent.erc20,
  child: pos.child.erc20,
};
export const erc721 = {
  parent: pos.parent.erc721,
  child: pos.child.erc721,
};
export const erc1155 = {
  parent: pos.parent.erc1155,
  child: pos.child.erc1155,
};

export const posClient = new POSClient();

export const posClientForTo = new POSClient();

export const getPOSClient = (network = 'testnet', version = 'mumbai') => {
  const posClient = new POSClient();
  return posClient.init({
    //log: true,
    network: network,
    version: version,
    child: {
      provider: new HDWalletProvider(privateKey, rpc.child),
      defaultConfig: {
        from: from,
      },
    },
    parent: {
      provider: new HDWalletProvider(privateKey, rpc.parent),
      defaultConfig: {
        from: from,
      },
    },
  });
};
