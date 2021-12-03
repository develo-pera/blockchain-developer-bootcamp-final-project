const DCommerce = artifacts.require("DCommerce");
const Store = artifacts.require("Store");

module.exports = async (_deployer) => {
  // Use deployer to state migration tasks.
  await _deployer.deploy(DCommerce, process.env.RAZZLE_DCOMMERCE_BASE_URL);
  const DCommerceInstance = await DCommerce.deployed();

  await _deployer.deploy(Store, DCommerceInstance.address);
  const StoreInstance = await Store.deployed();

  const minterRole = web3.utils.keccak256("MINTER_ROLE");
  await DCommerceInstance.grantRole(minterRole, StoreInstance.address);
};
