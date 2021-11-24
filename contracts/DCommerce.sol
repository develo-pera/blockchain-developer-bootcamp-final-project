// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract DCommerce is ERC1155PresetMinterPauser {
  constructor(string memory _baseURL) ERC1155PresetMinterPauser(_baseURL) {
  }
}
