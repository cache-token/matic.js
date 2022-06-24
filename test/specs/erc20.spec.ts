import { erc20, from, getPOSClient, posClient, posClientForTo, to } from './client';
import { expect } from 'chai';
import { ABIManager, setProofApi, service, utils, ITransactionRequestConfig } from '../../dist/matic.node.js';
import BN from 'bn.js';
import abi from '../ABIs/RootTunnelABI.json';

describe('ERC20', () => {
  const abiManager = new ABIManager('testnet', 'mumbai');

  before(() => {
    return Promise.all([abiManager.init(), abiManager.setABI('FxCacheRootTunnel', 'pos', abi)]);
  });

  it('get balance child', async () => {
    const client = await getPOSClient();
    let erc20Child = client.erc20(erc20.child);
    const balance = await erc20Child.getBalance(from);
    console.log('balance', balance);
    expect(balance).to.be.an('string');
    expect(Number(balance)).gte(0);
  });

  it('get balance parent', async () => {
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const balance = await erc20Parent.getBalance(from);
    console.log('balance', balance);
    expect(balance).to.be.an('string');
    expect(Number(balance)).gte(0);
  });

  it('get allowance parent', async () => {
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const allowance = await erc20Parent.getAllowance(from, {
      spenderAddress: '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483',
    });
    expect(allowance).to.be.an('string');
    expect(Number(allowance)).gte(0);
  });

  it('get allowance child', async () => {
    const client = await getPOSClient();
    let erc20Child = client.erc20(erc20.child);
    const allowance = await erc20Child.getAllowance(from, {
      spenderAddress: '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483',
    });
    expect(allowance).to.be.an('string');
    expect(Number(allowance)).gte(0);
  });
  it('approve parent return tx', async () => {
    const spenderAddress = '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483';
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const result = await erc20Parent.approve('10', {
      returnTransaction: true,
      gasLimit: 799795,
      spenderAddress: spenderAddress,
    });

    expect(result['to'].toLowerCase()).equal(erc20.parent.toLowerCase());
    expect(result).to.have.property('data');
  });

  it('approve parent return tx with spender address', async () => {
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const spenderAddress = '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483';
    const result = await erc20Parent.approve('10', {
      spenderAddress: spenderAddress,
      returnTransaction: true,
      gasLimit: 799795,
    });

    expect(result['to'].toLowerCase()).equal(erc20.parent.toLowerCase());
    expect(result).to.have.property('data');
  });

  it('approve child return tx without spender address', async () => {
    try {
      const client = await getPOSClient();
      let erc20Child = client.erc20(erc20.child);
      const result = await erc20Child.approve('10');
      expect(result['to'].toLowerCase()).equal(erc20.child.toLowerCase());
      expect(result).to.have.property('data');
    } catch (error) {
      // console.log('error', error);
      expect(error).eql({
        type: 'null_spender_address',
        message: 'Please provide spender address.',
      });
    }
  });

  it('withdrawExit return tx', async () => {
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    await abiManager.setABI('RootChainManager', 'pos', abi);
    const result = await erc20Parent.withdrawExit(
      '0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8',
      {
        gasLimit: 800000,
        returnTransaction: true,
      }
    );
    expect(result['to'].toLowerCase()).equal('0xD7ecbfE71A9d643Fc8d8868E224474864e42A483'.toLowerCase());
  });

  it('isWithdrawExited', async () => {
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const exitTxHash = '0x5242c6fc0b00505944ca456603bcc700798123f6b65996fa561793970a18b21c';
    const isExited = await erc20Parent.isWithdrawExited(exitTxHash);
    expect(isExited).to.be.an('boolean').equal(true);
  });

  it('is check pointed', async () => {
    const client = await getPOSClient();
    const isCheckPointed = await client.isCheckPointed(
      '0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8'
    );
    expect(isCheckPointed).to.be.an('boolean').equal(true);
  });

  it('child transfer returnTransaction with erp1159', async () => {
    const amount = 10;
    const client = await getPOSClient();
    let erc20Child = client.erc20(erc20.child);
    try {
      await erc20Child.transfer(amount, to, {
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 10,
        returnTransaction: true,
      });
    } catch (error) {
      console.log('error', error);
      expect(error).deep.equal({
        message: `Child chain doesn't support eip-1559`,
        type: 'eip-1559_not_supported',
      });
    }
  });

  it('child transfer returnTransaction', async () => {
    const amount = 10;
    const client = await getPOSClient();
    let erc20Child = client.erc20(erc20.child);
    const result = await erc20Child.transfer(amount, to, {
      returnTransaction: true,
    });
    expect(result).to.have.not.property('maxFeePerGas');
    expect(result).to.have.not.property('maxPriorityFeePerGas');
    // expect(result).to.have.property('gasPrice')
    // expect(result['gasPrice']).to.be.an('number').gt(0);
    expect(result).to.have.property('chainId', 80001);
    expect(result['chainId']).to.be.an('number');
  });

  it('parent transfer returnTransaction with erp1159', async () => {
    const amount = 10;
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const result = await erc20Parent.transfer(amount, to, {
      maxFeePerGas: 20,
      maxPriorityFeePerGas: 20,
      returnTransaction: true,
    });

    expect(result).to.have.property('maxFeePerGas', 20);
    expect(result).to.have.property('maxPriorityFeePerGas', 20);
    expect(result).to.have.not.property('gasPrice');
    expect(result).to.have.property('chainId', 5);
  });

  // it('isDeposited', async () => {
  //   const txHash = '0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8';
  //   const client = await getPOSClient();
  //   const isDeposited = await client.isDeposited(txHash);
  //   expect(isDeposited).to.be.an('boolean').equal(true);
  // });

  it('withdrawstart return tx', async () => {
    const amount = 10;
    const client = await getPOSClient();
    let erc20Child = client.erc20(erc20.child);
    const result = await erc20Child.withdrawStart('10', {
      returnTransaction: true,
      gasLimit: 799795,
    });

    expect(result['to'].toLowerCase()).equal(erc20.child.toLowerCase());
    expect(result).to.have.property('data');
  });

  it('deposit return tx', async () => {
    const amount = 10;
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    const result = await erc20Parent.deposit(amount, from, {
      returnTransaction: true,
      gasLimit: 799795,
    });

    const rootChainManager = '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483';
    expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
  });

  it('withdrawExitFaster return tx without setProofAPI', async () => {
    try {
      const client = await getPOSClient();
      let erc20Parent = client.erc20(erc20.parent, true);
      await abiManager.setABI('RootChainManager', 'pos', abi);
      await erc20Parent.withdrawExitFaster('0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8', {
        gasLimit: 800000,
        returnTransaction: true,
      });
      throw new Error('there should be exception');
    } catch (error) {
      expect(error).deep.equal({
        message: `Proof api is not set, please set it using "setProofApi"`,
        type: 'proof_api_not_set',
      });
    }
  });

  it('call getBlockIncluded', async () => {
    setProofApi('https://apis.matic.network');
    try {
      const result = await service.network.getBlockIncluded('testnet', 1000);
      console.log('result', result);
      expect(result.end).to.be.an('string');
      expect(result.start).to.be.an('string');
      expect(utils.BN.isBN(result.headerBlockNumber)).equal(true);
    } catch (error) {
      console.error('error', error, error.stack);
    }
  });

  it('withdrawExitFaster return tx', async () => {
    setProofApi('https://apis.matic.network');
    const client = await getPOSClient();
    let erc20Parent = client.erc20(erc20.parent, true);
    await abiManager.setABI('RootChainManager', 'pos', abi);
    const result = await erc20Parent.withdrawExitFaster(
      '0xdc140b6d853340bf55694b63c5becd08458784d91fd496f7f4fb1174b7391ef8',
      {
        gasLimit: 800000,
        returnTransaction: true,
      }
    );
    expect(result['to'].toLowerCase()).equal('0xD7ecbfE71A9d643Fc8d8868E224474864e42A483'.toLowerCase());
  });

  // it('Withdraw exited verification process', async () => {
  //   const client = await getPOSClient();
  //   await abiManager.setABI('RootChainManager', 'pos', abi);
  //   const spenderAddress = '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483';
  //   let erc20Parent = client.erc20(erc20.parent, true);
  //   let erc20Child = client.erc20(erc20.child);
  //   const amount = 10;
  //   await erc20Parent.approve(amount, {
  //     returnTransaction: true,
  //     gasLimit: 799795,
  //     spenderAddress: spenderAddress,
  //   });
  //   const result = await erc20Child.withdrawStart('10', {
  //     gasLimit: 799795,
  //     nounce: 18,
  //   });
  //   console.log(result);
  //   const txHash = await result.getTransactionHash();
  //   console.log(txHash);
  //   await erc20Parent.withdrawExit(txHash, {
  //     gasLimit: 800000,
  //   });
  //   const isExited = await erc20Parent.isWithdrawExited(txHash);
  //   expect(isExited).to.be.an('boolean').equal(true);
  // });
});
