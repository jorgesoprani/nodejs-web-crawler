const search = require('./search');
const getConfig = require('./config');

async function execute() {
  const configs = await getConfig();

  for (const config of configs) {
    await search('batata', config);
  }
}