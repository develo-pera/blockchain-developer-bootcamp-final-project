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
  let DCommerceInstance;

  beforeEach(async () => {
    DCommerceInstance = await DCommerce.new("testurl.com/");
    StoreInstance = await Store.new(DCommerceInstance.address);
    await StoreInstance.makeMeStoreManager();
    const minterRole = web3.utils.keccak256("MINTER_ROLE");
    await DCommerceInstance.grantRole(minterRole, StoreInstance.address);
  });

  it("should make me store manager on makeMeStoreManager call", async () => {
    const before = await StoreInstance.isStoreManager(accounts[1]);
    await StoreInstance.makeMeStoreManager({from: accounts[1]});
    const after = await StoreInstance.isStoreManager(accounts[1]);
    
    expect(before).to.be.false;
    expect(after).to.be.true;
  });

  it("should allow store manager to add new product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 3;

    await StoreInstance.addStoreManager(accounts[1]);
    const transactionResult = await StoreInstance.mintNewItem(price, amount, {from: accounts[1]});
    const itemPrice = await StoreInstance.itemPrice(1);

    expect(itemPrice.toString()).to.be.equal(price);
    truffleAssert.eventEmitted(transactionResult, "AddNewItem", {itemId: web3.utils.toBN(1)});
  });

  it("should prevent account that's not store manager to add new product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 3;
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Not allowed!");
  });

  it("should revert adding new item if item price is not greater than 0", async () => {
    const price = 0;
    const negativePrice = -1;
    const amount = 3;

    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Invalid item price");
    await truffleAssert.fails(StoreInstance.mintNewItem(negativePrice, amount, {from: accounts[1]}));
  });

  it("should revert adding new item if amount is not greater than 0", async () => {
    const price = 1;
    const amount = 0;
    const negativeAmount = -1;

    await StoreInstance.addStoreManager(accounts[1]);
    await truffleAssert.reverts(StoreInstance.mintNewItem(price, amount, {from: accounts[1]}), "Invalid amount");
    await truffleAssert.fails(StoreInstance.mintNewItem(price, negativeAmount, {from: accounts[1]}));
  });

  it("should allow everyone to buy a single product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    const transactionResult = await StoreInstance.buyItems(1, 1, {value: price});
    
    truffleAssert.eventEmitted(transactionResult, "BuyItems", {itemId: web3.utils.toBN(1), buyer: accounts[0], itemsAmount: web3.utils.toBN(1)});
  });

  it("should allow everyone to buy multiple copies of a single product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    const transactionResult = await StoreInstance.buyItems(1, 2, {value: price * 2});
    
    truffleAssert.eventEmitted(transactionResult, "BuyItems", {itemId: web3.utils.toBN(1), buyer: accounts[0], itemsAmount: web3.utils.toBN(2)});
  });

  it("should revert if user tries to buy product with invalid id", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    
    await truffleAssert.reverts(StoreInstance.buyItems(0, 1, {value: price}), "Invalid product id");
  });

  it("should revert if user tries to buy product passing invalid amount", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    
    await truffleAssert.reverts(StoreInstance.buyItems(1, 0, {value: price}), "Invalid amount");
  });

  it("should revert if user tries to buy product without providing enough funds", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    
    await truffleAssert.reverts(StoreInstance.buyItems(1, 2, {value: price}), "Not enough funds");
  });

  it("should revert if user tries to buy more copies of porduct than there is in the store", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    
    await truffleAssert.reverts(StoreInstance.buyItems(1, 3, {value: price * 3}), "Out of stock");
  });

  it("should allow token owner to reedem the product", async () => {
    const price = web3.utils.toWei("0.01", "ether");
    const amount = 2;
    await StoreInstance.makeMeStoreManager();
    await StoreInstance.mintNewItem(price, amount);
    await StoreInstance.buyItems(1, 1, {value: price});

    const orderDetails = {
      sku: "abc123",
      shippingAddress: {
        street: "Street",
        city: "City",
        zipCode: "Zip code",
        country: "Country",
      }
    }

    DCommerceInstance.setApprovalForAll(StoreInstance.address, true, {from: accounts[0]});

    const balanceBefore = await DCommerceInstance.balanceOf(accounts[0], 1);
    const transactionResult = await StoreInstance.reedemItem(1, orderDetails);
    const balanceAfter = await DCommerceInstance.balanceOf(accounts[0], 1);

    expect(balanceBefore.toNumber()).to.be.equal(1);
    expect(balanceAfter.toNumber()).to.be.equal(0);

    // TODO: Testing orderDeatils struct was real pain in the ass,
    // leaving for now and just testing if event was emited or not
    truffleAssert.eventEmitted(transactionResult, "ReedemItem");
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
