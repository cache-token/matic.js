import { BaseToken, Web3SideChainClient } from '../utils';
import { IPOSClientConfig, ITransactionOption } from '../interfaces';

export class RootChainManager extends BaseToken<IPOSClientConfig> {
  constructor(client_: Web3SideChainClient<IPOSClientConfig>, address: string) {
    console.log('Root Chain Manager address = ', address);
    super(
      {
        address: '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483',
        name: 'RootChainManager',
        bridgeType: 'pos',
        isParent: true,
      },
      client_
    );
  }

  method(methodName: string, ...args) {
    return this.getContract().then(contract => {
      return contract.method(methodName, ...args);
    });
  }

  deposit(userAddress: string, tokenAddress: string, depositData: string, option?: ITransactionOption) {
    return this.method('depositFor', userAddress, tokenAddress, depositData).then(method => {
      return this.processWrite(method, option);
    });
  }

    exit(exitPayload: string, option: ITransactionOption) {
        return this.method("receiveMessage", exitPayload).then(method => {
            return this.processWrite(
                method,
                option
            );
        });
    }

    isExitProcessed(exitHash: string) {
        return this.method(
            "processedExits", exitHash
        ).then(method => {
            return this.processRead<boolean>(method);
        });
    }

}
