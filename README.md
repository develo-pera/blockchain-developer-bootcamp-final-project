[![Netlify Status](https://api.netlify.com/api/v1/badges/5727d436-d08c-4893-a370-bab1e1841cca/deploy-status)](https://app.netlify.com/sites/dcommerce-nft/deploys)

Public Ethereum account for NFT certificate: `0xE0fF737685fdE7Fd0933Fc280D53978b3d0700D5`

# dCommerce: decentralized e-commerce store with redeemable NFTs

E-commerce store where you can purchase physical goods, i.e. clothing as redeemable NFTs.

In the simplest way, a platform like that should work like this:

1. Store Manager can add new products with details and mint them as redeemable NFTs.
2. Those NFTs then can be purchased on the brand's website.
3. Owners can then resell those NFTs on any other popular NFT marketplace if they want.
4. On product page you can check details of every token like owners, price, etc. by visiting something like `somebrand.com/store/{tokenId}`
5. Once a NFT owner wants to redeem the physical good NFT represents, they have to go to the brands website and burn the token. *(For simplicity and for now in order to reedem we will ask users to burn the NFTs. In production ready version users can redeem without burning, we keep the track of each individual item and just change flag to `reedemed` to true.)*

### Demo: https://dcommerce-nft.netlify.app/
