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
  
  modifier onlyStoreManager(address _sender) {
    require(storeManagers[_sender], "STORE: Not allowed!");
    _;
  }

  constructor(address _DCommerceAddress) {
    DCommerceContract = DCommerce(_DCommerceAddress);
  }

  function mintNewItem(uint _itemPrice, uint _amount) public view onlyStoreManager(msg.sender) {

  }

  function buyItem(uint _tokenId) public payable {

  }

  function reedemItem(uint _tokenId, OrderDetails memory _orderDetails) public payable {

  }

  function addStoreManager(address _newManager) public onlyOwner {
    
  }

  function withdraw() public onlyOwner {

  }
}