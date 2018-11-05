pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "eth-token-recover/contracts/TokenRecover.sol";

contract CryptoGiftToken is ERC721Full, MinterRole, TokenRecover {
  struct GiftStructure {
    uint256 amount;
    address purchaser;
    string content;
    uint256 date;
    uint256 style;
  }

  uint256 private _styles;
  uint256 private _progressiveId;
  uint256 private _maxSupply;

  // Mapping from token ID to the structures
  mapping(uint256 => GiftStructure) private _structureIndex;

  modifier canGenerate() {
    require(
      _progressiveId < _maxSupply,
      "Max token supply reached"
    );
    _;
  }

  constructor(
    string name,
    string symbol,
    uint256 maxSupply
  )
    public
    ERC721Full(name, symbol)
  {
    _maxSupply = maxSupply;
  }

  function styles() public view returns (uint256) {
    return _styles;
  }

  function progressiveId() public view returns (uint256) {
    return _progressiveId;
  }

  function maxSupply() public view returns (uint256) {
    return _maxSupply;
  }

  function newToken(
    uint256 amount,
    address purchaser,
    address beneficiary,
    string content,
    uint256 date,
    uint256 style
  )
    public
    canGenerate
    onlyMinter
    returns (uint256)
  {
    require(
      date > 0,
      "Date must be greater than zero"
    );
    require(
      style <= _styles,
      "Style is not available"
    );
    uint256 tokenId = _progressiveId.add(1);
    _mint(beneficiary, tokenId);
    _structureIndex[tokenId] = GiftStructure(
      amount,
      purchaser,
      content,
      date,
      style
    );
    _progressiveId = tokenId;
    return tokenId;
  }

  function isVisible (
    uint256 tokenId
  )
    public
    view
    returns (bool visible, uint256 date)
  {
    if (_exists(tokenId)) {
      GiftStructure storage gift = _structureIndex[tokenId];

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
      uint256 amount,
      address purchaser,
      address beneficiary,
      string content,
      uint256 date,
      uint256 style
    )
  {
    require(
      _exists(tokenId),
      "Token must exists"
    );

    GiftStructure storage gift = _structureIndex[tokenId];

    require(
      block.timestamp >= gift.date, // solium-disable-line security/no-block-members
      "Now should be greater than gift date"
    );

    amount = gift.amount;
    purchaser = gift.purchaser;
    beneficiary = ownerOf(tokenId);
    content = gift.content;
    date = gift.date;
    style = gift.style;
  }

  /**
   * @dev Only contract owner or token owner can burn
   */
  function burn(uint256 tokenId) public {
    address tokenOwner = isOwner() ? ownerOf(tokenId) : msg.sender;
    super._burn(tokenOwner, tokenId);
    delete _structureIndex[tokenId];
  }

  /**
   * @dev Set the max amount of styles available
   */
  function setStyles(uint256 newStyles) public onlyMinter {
    require(
      newStyles > _styles,
      "Styles cannot be decreased"
    );
    _styles = newStyles;
  }
}
