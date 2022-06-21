const { pos } = require('../../config');
const { getPOSClient, from } = require('../../utils');

const execute = async () => {
    const client = await getPOSClient();
    const erc20Token = client.erc20(pos.parent.erc20, true);
    const isExited = await erc20Token.isWithdrawExited('0x548a88d6af6633537def2b3b5deb311198ece649f6aa4ade9ec574ff0fda7698');

    console.log("result", isExited);
}
execute().then(() => {
}).catch(err => {
    console.error("err", err);
}).finally(_ => {
    process.exit(0);
})