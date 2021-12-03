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

## Directory structure
- `client`: Project's React frontend.
- `contracts`: Solidity smart contracts.
- `migrations`: Migration files for deploying contracts in contracts directory.
- `test`: Tests for smart contracts.

## Running project locally:

Prerequisites:
- Node: v16.7.0
- NPM v7.20.3
- Yarn 1.22.11 **(this is important as client will only work with Yarn and not NPM due to bug in resolving peer dependencies of project libraries and packets)**
- Ganache

1. Steps to run project locally:

    - Clone this repo
    - cd into folder
    - Create `.env` file based on `.env.example`

2. Creating Fleek account and copy credentials:

    - Go to https://fleek.co/ and create account or sign in if you already have an account
    - Go to storage page, copy link to the bucket (link should look something like `storageapi.fleek.co/your-team-bucket/`) and paste as a value for `RAZZLE_DCOMMERCE_BASE_URL` in `.env` file
    - Now go to Settings page and under Storage API click on Generate API button, copy API key and API Secret and paste to `RAZZLE_FLEEK_API_KEY` and `RAZZLE_FLEEK_API_SECRET` in `.env` file

3. Installing dependencies and running smart contracts:

    - Make sure you are in root folder of the project and run `npm install`
    - Run Ganache or ganache-cli on `port 9545` and with `chainId 1337`
    - In your terminal run `truffle migrate --network development`
    
4. Installing dependencies and running client:

    - cd into `client` folder
    - Run `yarn install` **(must be Yarn, not NPM)**
    - Run `yarn start`
    - Open `http://localhost:3000`
    - Don't forget to add a network to your Metamask with correct RPC URL and ChainId (`http://127.0.0.1:9545` and `1337`) before trying to interact with smart contracts from the frontend

## Running Smart Contract tests:

- Run `npm i` from the project root in case you haven't already
- Run `truffle develop`
- Run `test` command in truffle develop console
