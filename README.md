# Fashion brand store with redeemable NFTs

eCommerce store where you can purchase physical goods, i.e. clothing as redeemable NFTs.

In the simplest way, a platform like that should work like this:

1. Store Manager can add new products with details and mint them as redeemable NFTs.
2. Those NFTs then can be purchased on the brand's website.
3. Owners can then resell those NFTs on any other popular NFT marketplace if they want.
4. Once a NFT owner wants to redeem the physical good NFT represents, they have to go the brands website and initiate transaction.
5. You can check details of every token like who is the owner, initial price, last price it was sold for, is it already redeemed or not, etc. by visiting `somebrand.com/metadata/{tokenId}`
6. Once NFT is redeemed we have to change the flag redeemed to `true` *(Another option is that you have to burn the token in order to redeem it, because once you redeem it you shouldn't be able to resell the token as it doesn't have any real value any more).*
