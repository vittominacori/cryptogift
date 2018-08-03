pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./CryptoGiftToken.sol";


contract CryptoGiftMarket is Ownable {
  using SafeMath for uint256;

  // The token being sold
  CryptoGiftToken public token;

  // Address where funds are collected
  address public wallet;

  // The price for a token
  uint256 public price;

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
   * @param _price The price for a token in wei
   * @param _wallet Address where collected funds will be forwarded to
   * @param _token Address of the token being sold
   */
  constructor(uint256 _price, address _wallet, address _token) public {
    require(
      _wallet != address(0),
      "Wallet can't be the zero address"
    );
    require(
      _token != address(0),
      "Token can't be the zero address"
    );

    price = _price;
    wallet = _wallet;
    token = CryptoGiftToken(_token);
  }

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _beneficiary Address performing the token purchase
   */
  function buyToken(
    address _beneficiary,
    string _sender,
    string _receiver,
    string _message,
    string _youtube,
    uint256 _date,
    uint256 _style
  )
  public
  payable
  {
    uint256 weiAmount = msg.value;
    _preValidatePurchase(_beneficiary, weiAmount);

    uint256 giftValue = msg.value.sub(price);

    uint256 lastTokenId = _processPurchase(
      _beneficiary,
      _sender,
      _receiver,
      _message,
      _youtube,
      _date,
      _style
    );

    emit TokenPurchase(
      msg.sender,
      _beneficiary,
      weiAmount,
      lastTokenId
    );

    _forwardFunds(giftValue, _beneficiary);
  }

  function setPrice(uint256 _price) public onlyOwner {
    price = _price;
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
   * @param _beneficiary Address performing the token purchase
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _preValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
  internal
  view
  {
    require(
      _beneficiary != address(0),
      "Beneficiary can't be the zero address"
    );
    require(
      _weiAmount >= price,
      "Sent ETH must be greater than or equal to token price"
    );
  }

  /**
   * @dev Executed when a purchase has been validated and is ready to be executed.
   */
  function _processPurchase(
    address _beneficiary,
    string _sender,
    string _receiver,
    string _message,
    string _youtube,
    uint256 _date,
    uint256 _style
  )
  internal
  returns (uint256)
  {
    return token.newToken(
      msg.sender,
      _beneficiary,
      _sender,
      _receiver,
      _message,
      _youtube,
      _date,
      _style
    );
  }

  /**
   * @dev Determines how ETH is stored/forwarded on purchases.
   */
  function _forwardFunds(uint256 _giftValue, address _beneficiary) internal {
    if (price > 0) {
      wallet.transfer(price);
    }

    if (_giftValue > 0) {
      _beneficiary.transfer(_giftValue);
    }
  }
}
