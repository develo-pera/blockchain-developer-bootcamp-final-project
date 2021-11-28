// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Dcommerce.sol";

contract Store is Ownable, ERC1155Holder {
  using Counters for Counters.Counter;

  DCommerce private DCommerceContract;
  Counters.Counter internal itemIdTracker;

  mapping(uint => uint) public itemPrice;
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

  /// @notice This function shloudn't exists. It's created solely for demo purposes so
  /// anyone can make themselves store managers and try adding new itens to the store
  /// through client admin dashboard.
  function makeMeStoreManager() public {
    storeManagers[msg.sender] = true;
  
    emit AddNewManager(msg.sender);
  }

  /// @notice Creates new product.
  /// @param _itemPrice Product price in wei.
  /// @param _amount Number of copies available for sale.
  function mintNewItem(uint _itemPrice, uint _amount) public onlyStoreManager(msg.sender) {
    require(_itemPrice > 0, "Invalid item price");
    require(_amount > 0, "Invalid amount");

    uint itemId = itemIdTracker.current();
    itemIdTracker.increment();

    itemPrice[itemId] = _itemPrice;
    DCommerceContract.mint(address(this), itemId, _amount, "");

    emit AddNewItem(itemId);
  }

  function buyItem(uint _tokenId) public payable {

  }

  function reedemItem(uint _tokenId, OrderDetails memory _orderDetails) public payable {
    
  }

  /// @notice Adds new store manager.
  /// @param _newManagerAddress New manager's address.
  function addStoreManager(address _newManagerAddress) public onlyOwner {
    require(!storeManagers[_newManagerAddress], "Already added!");

    storeManagers[_newManagerAddress] = true;

    emit AddNewManager(_newManagerAddress);
  }

  /// @notice Removes store manager.
  /// @param _managerAddress New manager's address.
  function removeStoreManager(address _managerAddress) public onlyOwner {
    require(storeManagers[_managerAddress], "Not a manager!");

    storeManagers[_managerAddress] = false;
    
    emit RemoveManager(_managerAddress);
  }

  /// @notice Checks if given address is store manager.  
  /// @param _checkAddress Address to check.
  /// @return boolean
  function isStoreManager(address _checkAddress) public view returns(bool) {
    return storeManagers[_checkAddress];
  }

  function withdraw() public onlyOwner {

  }
}
