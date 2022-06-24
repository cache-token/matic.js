const { pos } = require('../../config');
const { getPOSClient, from } = require('../../utils');

const execute = async () => {
  const client = await getPOSClient();
  const erc20Token = client.erc20(pos.parent.erc20, true);

  const result = await erc20Token.getAllowance(from, {
    spenderAddress: '0xD7ecbfE71A9d643Fc8d8868E224474864e42A483',
  });

  console.log('result', result);
};
execute()
  .then(() => {})
  .catch(err => {
    console.error('err', err);
  })
  .finally(_ => {
    process.exit(0);
  });
