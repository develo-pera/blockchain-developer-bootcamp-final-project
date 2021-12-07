## Inheritance and Interfaces
- `DCommerce` contract inherits `ERC1155PresetMinterPauser`  OpenZeppelin ERC1155 implementation contract with Role based access control and Circuit Break design patterns already implemented.
- `Store` contract inherits OpenZeppelin's `Ownable` and `ERC1155Holder` contracts.

## Access Control Design Patterns
- `DCommerce` contract has full Role Based access control pattern implemented, so `Store` contract needs `MINTER_ROLE` in order to mint new tokens.
- `Store` contract methods `addStoreManager`, `removeStoreManager` and `withdraw` are protected with `Ownable` design pattern

## Inter-Contract Execution
`DCommerce` contract is ERC1155 impplementaton contract responsible only for NFT tokens. Throug inter-contract exectuon, `Store` contract is responsible everything else, minting (creating new product), buying (transferring ownership) and redeeming (burning tokens). 
