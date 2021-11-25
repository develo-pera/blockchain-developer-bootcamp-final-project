const DCommerce = artifacts.require("DCommerce");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("DCommerce", (/* accounts */) => {
  let DCommerceInstance;

  beforeEach(async () => {
    DCommerceInstance = await DCommerce.deployed();
  });

  it("should return OpenSea friendly url for each token", async () => {
    const tokenId = 1;
    const tokenUrl = await DCommerceInstance.uri(tokenId);
    
    expect(tokenUrl).to.be.equal(`${process.env.BASE_URL}/${tokenId}.json`);
  });
});
