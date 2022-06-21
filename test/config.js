// const dotenv = require('dotenv');
// const path = require('path');
// const env = dotenv.config({
//     path: path.join(__dirname, '.env')
// });
module.exports = {
  rpc: {
    parent: process.env.ROOT_RPC,
    child: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today',
  },
  pos: {
    parent: {
      erc20: '0x1542Ac6e42940476c729680ff147E0CEDcFcFCf2',
      erc721: '0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f',
      erc1155: '0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063',
      chainManagerAddress: '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483', // Address of RootChainManager proxy for POS Portal
    },
    child: {
      erc721: '0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649',
      erc20: '0x06995eD6Db0c4A941184e896D40baA42543a5B6f',
      weth: '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323',
      erc1155: '0xA07e45A987F19E25176c877d98388878622623FA',
    },
  },
  user1: {
    privateKey: process.env.USER1_PRIVATE_KEY,
    address: process.env.USER1_FROM,
  },
  user2: {
    address: process.env.USER2_FROM, // Your address
    privateKey: process.env.USER2_PRIVATE_KEY,
  },
};
