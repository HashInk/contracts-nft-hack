require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

let infura_api_key = process.env.INFURA_API_KEY;
let etherscan_api_key = process.env.ETHERSCAN_API_KEY;
let rinkeby_private_key = process.env.RINKEBY_PRIVATE_KEY;
let ropsten_private_key = process.env.ROPSTEN_PRIVATE_KEY;

module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura_api_key}`,
      accounts: [`0x${rinkeby_private_key}`]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infura_api_key}`,
      accounts: [`0x${ropsten_private_key}`]
    }
  },
  etherscan: {
    apiKey: etherscan_api_key
  }
};
