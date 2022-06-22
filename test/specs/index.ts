import { use } from '../../dist/matic.node.js';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3';

use(Web3ClientPlugin);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

import './map_promise.spec';
import './pos_client.spec';
import './erc20.spec';
// import './erc721.spec'
// import './erc1155.spec'
