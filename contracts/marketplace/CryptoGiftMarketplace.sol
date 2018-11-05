pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../token/CryptoGiftToken.sol";

contract CryptoGiftMarketplace is TokenRecover {
  using SafeMath for uint256;

  // The token being sold
  CryptoGiftToken private _token;

  // Address where funds are collected
  address private _wallet;

  // The price for a token
  uint256 private _price;

  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param tokenId the token id purchased
   */
  event TokenPurchase(
    address indexed purchaser,
    address indexed beneficiary,
    uint256 value,
    uint256 tokenId
  );

  /**
   * @param price The price for a token in wei
   * @param wallet Address where collected funds will be forwarded to
   * @param token Address of the token being sold
   */
  constructor(uint256 price, address wallet, address token) public {
    require(
      wallet != address(0),
      "Wallet can't be the zero address"
    );
    require(
      token != address(0),
      "Token can't be the zero address"
    );

    _price = price;
    _wallet = wallet;
    _token = CryptoGiftToken(token);
  }

  function token() public view returns (CryptoGiftToken) {
    return _token;
  }

  function wallet() public view returns (address) {
    return _wallet;
  }

  function price() public view returns (uint256) {
    return _price;
  }

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param beneficiary Address performing the token purchase
   */
  function buyToken(
    address beneficiary,
    string content,
    uint256 date,
    uint256 style
  )
    public
    payable
  {
    uint256 weiAmount = msg.value;
    _preValidatePurchase(beneficiary, weiAmount);

    uint256 giftValue = msg.value.sub(_price);

    uint256 lastTokenId = _processPurchase(
      giftValue,
      beneficiary,
      content,
      date,
      style
    );

    emit TokenPurchase(
      msg.sender,
      beneficiary,
      giftValue,
      lastTokenId
    );

    _forwardFunds(giftValue, beneficiary);
  }

  /**
   * @dev Set the price of a gift
   * @param newPrice Value of the gift
   */
  function setPrice(uint256 newPrice) public onlyOwner {
    _price = newPrice;
  }

  /**
   * @dev Change the destination wallet
   * @param newWallet Address of the wallet
   */
  function setWallet(address newWallet) public onlyOwner {
    require(
      newWallet != address(0),
      "Wallet can't be the zero address"
    );

    _wallet = newWallet;
  }

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
   * @param beneficiary Address performing the token purchase
   * @param weiAmount Value in wei involved in the purchase
   */
  function _preValidatePurchase(
    address beneficiary,
    uint256 weiAmount
  )
    internal
    view
  {
    require(
      beneficiary != address(0),
      "Beneficiary can't be the zero address"
    );
    require(
      weiAmount >= _price,
      "Sent ETH must be greater than or equal to token price"
    );
  }

  /**
   * @dev Executed when a purchase has been validated and is ready to be executed.
   */
  function _processPurchase(
    uint256 amount,
    address beneficiary,
    string content,
    uint256 date,
    uint256 style
  )
    internal
    returns (uint256)
  {
    return _token.newToken(
      amount,
      msg.sender,
      beneficiary,
      content,
      date,
      style
    );
  }

  /**
   * @dev Determines how ETH is stored/forwarded on purchases.
   */
  function _forwardFunds(uint256 giftValue, address beneficiary) internal {
    if (_price > 0) {
      _wallet.transfer(_price);
    }

    if (giftValue > 0) {
      beneficiary.transfer(giftValue);
    }
  }
}
