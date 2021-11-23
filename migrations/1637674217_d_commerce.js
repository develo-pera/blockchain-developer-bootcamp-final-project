const DCommerce = artifacts.require("DCommerce");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  console.log(process.env.BASE_URL);
  _deployer.deploy(DCommerce, process.env.BASE_URL);
};
