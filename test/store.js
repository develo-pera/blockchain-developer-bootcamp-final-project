const truffleAssert = require('truffle-assertions');
const Store = artifacts.require("Store");
const DCommerce = artifacts.require("DCommerce");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Store", (accounts) => {
  let StoreInstance;

  beforeEach(async () => {
    StoreInstance = await Store.new(DCommerce.address);
    const DCommerceInstance = await DCommerce.deployed();
    const minterRole = web3.utils.keccak256("MINTER_ROLE");
    await DCommerceInstance.grantRole(minterRole, StoreInstance.address);
  });

  it("should make me store manager on makeMeStoreManager call", async () => {
    const before = await StoreInstance.isStoreManager(accounts[0]);
    await StoreInstance.makeMeStoreManager();
    const after = await StoreInstance.isStoreManager(accounts[0]);
    
    expect(before).to.be.false;
    expect(after).to.be.true;
  });

  it("should allow store manager to add new product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 3;

    await StoreInstance.addStoreManager(accounts[1]);
    const transactionResult = await StoreInstance.mintNewItem(price, amount, {from: accounts[1]});
    const itemPrice = await StoreInstance.itemPrice(0);

    expect(itemPrice.toString()).to.be.equal(price);
    truffleAssert.eventEmitted(transactionResult, "AddNewItem", {itemId: web3.utils.toBN(0)});
  });

  it("should prevent account that's not store manager to add new product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 3;
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Not allowed!");
  });

  it("should revert minting new item if item price is not greater than 0", async () => {
    const price = 0;
    const negativePrice = -1;
    const amount = 3;

    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Invalid item price");
    await truffleAssert.fails(StoreInstance.mintNewItem(negativePrice, amount, {from: accounts[1]}));
  });

  it("should revert minting new item if amount is not greater than 0", async () => {
    const price = 1;
    const amount = 0;
    const negativeAmount = -1;

    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Invalid amount");
    await truffleAssert.fails(StoreInstance.mintNewItem(price, negativeAmount, {from: accounts[1]}));
  });

  it("should allow owner to add new store manager", async () => {
    const before = await StoreInstance.isStoreManager(accounts[1]);
    await StoreInstance.addStoreManager(accounts[1]);
    const after = await StoreInstance.isStoreManager(accounts[1]);
    
    expect(before).to.be.false;
    expect(after).to.be.true;
  });

  it("should revert if non-owner tries to add new store manager", async () => {
    await truffleAssert.reverts(StoreInstance.addStoreManager(accounts[1], {from: accounts[1]}));
  });

  it("should revert if owner tries to add the same manager twice", async () => {
    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.addStoreManager(accounts[1]), "Already added!");
  });

  it("should allow owner to add remove store manager", async () => {
    await StoreInstance.addStoreManager(accounts[1]);
    const before = await StoreInstance.isStoreManager(accounts[1]);
    await StoreInstance.removeStoreManager(accounts[1]);
    const after = await StoreInstance.isStoreManager(accounts[1]);
    
    expect(before).to.be.true;
    expect(after).to.be.false;
  });

  it("should revert if non-owner tries to remove new store manager", async () => {
    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.removeStoreManager(accounts[1], {from: accounts[1]}));
  });

  it("should revert if owner tries to tries to remove store manager that's not a manager", async () => {
    await truffleAssert.reverts(StoreInstance.removeStoreManager(accounts[1]), "Not a manager!");
  });
});
