const { pos } = require('../../config');
const { getPOSClient, from } = require('../../utils');

const execute = async () => {
  const client = await getPOSClient();
  const erc20Token = client.erc20(pos.parent.erc20, true);
  const isExited = await erc20Token.isWithdrawExited(
    '0x5242c6fc0b00505944ca456603bcc700798123f6b65996fa561793970a18b21c'
  );

  console.log('result', isExited);
};
execute()
  .then(() => {})
  .catch(err => {
    console.error('err', err);
  })
  .finally(_ => {
    process.exit(0);
  });
