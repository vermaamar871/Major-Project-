//https://eth-sepolia.g.alchemy.com/v2/PKzbEJitV8CYrIAubW73DdWNNsCWCxZ8
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/PKzbEJitV8CYrIAubW73DdWNNsCWCxZ8',
      accounts: ['df1552e47c52586c7d783609bfc03619ca4c4b5bb7ab3df4981bf9696b752cdd'],
    },
  },
};