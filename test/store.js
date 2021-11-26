const Store = artifacts.require("Store");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Store", (accounts) => {
  let StoreInstance;

  beforeEach(async () => {
    StoreInstance = await Store.deployed();
  });

  it("should make me store manager on makeMeStoreManager call", async () => {
    const before = await StoreInstance.isStoreManager(accounts[0]);
    await StoreInstance.makeMeStoreManager();
    const after = await StoreInstance.isStoreManager(accounts[0]);
    
    expect(before).to.be.false;
    expect(after).to.be.true;
  });
});
