var SimpleStorage = artifacts.require('./StarNotary.sol');

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
