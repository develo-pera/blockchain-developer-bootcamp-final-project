// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Dcommerce.sol";

contract Store is Ownable {
  using Counters for Counters.Counter;

  DCommerce private DCommerceContract;
  Counters.Counter internal itemIdTracker;

  mapping(uint => uint) private itemPrice;
  mapping(address => bool) private storeManagers;

  struct ShippingAddress {
    string street;
    string city;
    string zipCode;
    string country;
  }

  struct OrderDetails {
    string sku;
    ShippingAddress shippingAddress;
  }

  event AddNewItem(uint itemId);
  event BuyItem(uint indexed itemId, address indexed buyer);
  event ReedemItem(uint indexed itemId, address indexed redeemer, OrderDetails orderDetails);
  event AddNewManager(address indexed managerAddress);
  event RemoveManager(address indexed managerAddress);
  
  modifier onlyStoreManager(address _sender) {
    require(storeManagers[_sender], "Not allowed!");
    _;
  }

  constructor(address _DCommerceAddress) {
    DCommerceContract = DCommerce(_DCommerceAddress);
  }

  /// @notice this function shloudn't exists. It's created solely for demo purposes so
  /// anyone can make themselves store managers and try adding new itens to the store
  /// through client admin dashboard.
  function makeMeStoreManager() public {
    storeManagers[msg.sender] = true;
    emit AddNewManager(msg.sender);
  }

  function mintNewItem(uint _itemPrice, uint _amount) public view onlyStoreManager(msg.sender) {

  }

  function buyItem(uint _tokenId) public payable {

  }

  function reedemItem(uint _tokenId, OrderDetails memory _orderDetails) public payable {

  }

  /// @notice Adds new store manager.
  /// @param _newManagerAddress New manager's address
  function addStoreManager(address _newManagerAddress) public onlyOwner {
    require(!storeManagers[_newManagerAddress], "Already added!");
    storeManagers[_newManagerAddress] = true;
    emit AddNewManager(_newManagerAddress);
  }

  /// @notice Removes store manager.
  /// @param _managerAddress New manager's address
  function removeStoreManager(address _managerAddress) public onlyOwner {
    require(storeManagers[_managerAddress], "Not a manager!");
    storeManagers[_managerAddress] = false;
    emit RemoveManager(_managerAddress);
  }

  function withdraw() public onlyOwner {

  }
}
