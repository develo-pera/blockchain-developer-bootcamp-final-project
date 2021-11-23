// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract DCommerce is ERC1155 {
  constructor(string memory _baseURL) ERC1155(_baseURL) {
  }
}
