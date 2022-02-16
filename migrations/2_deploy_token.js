var FunToken = artifacts.require("FunToken");

module.exports = function(deployer) {
  deployer.deploy(FunToken, web3.utils.toBN("1000000000000000000000000"));
};
