pragma solidity ^0.4.24;

import "./base/ERC721RBACMintableToken.sol";


contract CryptoGiftToken is ERC721RBACMintableToken {
  struct GiftStructure {
    address purchaser;
    string sender;
    string receiver;
    string message;
    string youtube;
    uint256 date;
    uint256 style;
  }

  uint256 public styles;
  uint256 public progressiveId;
  uint256 public maxSupply;

  // Mapping from token ID to the structures
  mapping(uint256 => GiftStructure) structureIndex;

  modifier canGenerate() {
    require(
      progressiveId < maxSupply,
      "Max token supply reached"
    );
    _;
  }

  constructor(
    string _name,
    string _symbol,
    uint256 _maxSupply
  )
    public
    ERC721RBACMintableToken(_name, _symbol)
  {
    maxSupply = _maxSupply;
  }

  function newToken(
    address _purchaser,
    address _beneficiary,
    string _sender,
    string _receiver,
    string _message,
    string _youtube,
    uint256 _date,
    uint256 _style
  )
    public
    canGenerate
    returns (uint256)
  {
    require(
      _date > 0,
      "Date must be greater than zero"
    );
    require(
      _style <= styles,
      "Style is not available"
    );
    uint256 tokenId = progressiveId.add(1);
    _mint(_beneficiary, tokenId);
    structureIndex[tokenId] = GiftStructure(
      _purchaser,
      _sender,
      _receiver,
      _message,
      _youtube,
      _date,
      _style
    );
    progressiveId = tokenId;
    return tokenId;
  }

  function isVisible (
    uint256 tokenId
  )
    public
    view
    returns (bool visible, uint256 date)
  {
    if (exists(tokenId)) {
      GiftStructure storage gift = structureIndex[tokenId];

      // solium-disable-next-line security/no-block-members
      visible = block.timestamp >= gift.date;
      date = gift.date;
    } else {
      visible = false;
      date = 0;
    }
  }

  function getGift (uint256 tokenId)
    public
    view
    returns (
      address purchaser,
      address beneficiary,
      string sender,
      string receiver,
      string message,
      string youtube,
      uint256 date,
      uint256 style
    )
  {
    require(
      exists(tokenId),
      "Token must exists"
    );

    GiftStructure storage gift = structureIndex[tokenId];

    require(
      block.timestamp >= gift.date, // solium-disable-line security/no-block-members
      "Now should be greater than gift date"
    );

    purchaser = gift.purchaser;
    beneficiary = ownerOf(tokenId);
    sender = gift.sender;
    receiver = gift.receiver;
    message = gift.message;
    youtube = gift.youtube;
    date = gift.date;
    style = gift.style;
  }

  /**
   * @dev Only contract owner or token owner can burn
   */
  function burn(uint256 tokenId) public {
    address tokenOwner = msg.sender == owner ? ownerOf(tokenId) : msg.sender;
    super._burn(tokenOwner, tokenId);
    delete structureIndex[tokenId];
  }

  /**
   * @dev Set the max amount of styles available
   */
  function setStyles(uint256 _styles) public hasMintPermission {
    require(
      _styles > styles,
      "Styles cannot be decreased"
    );
    styles = _styles;
  }
}
