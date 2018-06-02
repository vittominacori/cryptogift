pragma solidity ^0.4.24;

import "./ERC721RBACMintableToken.sol";


contract CryptoGiftToken is ERC721RBACMintableToken {
  struct GiftStructure {
    string sender;
    string receiver;
    string message;
    string youtube;
    uint256 date;
  }

  uint256 public generatedTokens = 0;
  uint256 public maxSupply;

  // Mapping from token ID to the structures
  mapping(uint256 => GiftStructure) structureIndex;

  modifier canGenerate() {
    require(generatedTokens < maxSupply);
    _;
  }

  constructor(string _name, string _symbol, uint256 _maxSupply) public
  ERC721RBACMintableToken(_name, _symbol)
  {
    maxSupply = _maxSupply;
  }

  function newToken(
    address _purchaser,
    string _sender,
    string _receiver,
    string _message,
    string _youtube,
    uint256 _date
  )
  canGenerate
  public
  returns (uint256)
  {
    uint256 tokenId = generatedTokens.add(1);
    _mint(_purchaser, tokenId);
    structureIndex[tokenId] = GiftStructure(
      _sender,
      _receiver,
      _message,
      _youtube,
      _date
    );
    generatedTokens = tokenId;
    return tokenId;
  }

  function isVisible (uint256 tokenId) public view returns (bool visible, uint256 date) {
    GiftStructure storage gift = structureIndex[tokenId];

    // solium-disable-next-line security/no-block-members
    visible = block.timestamp >= gift.date;
    date = gift.date;
  }

  function getGift (uint256 tokenId)
  public
  view
  returns (
    string sender,
    string receiver,
    string message,
    string youtube,
    uint256 date
  )
  {
    GiftStructure storage gift = structureIndex[tokenId];

    // solium-disable-next-line security/no-block-members
    require(block.timestamp >= gift.date);

    sender = gift.sender;
    receiver = gift.receiver;
    message = gift.message;
    youtube = gift.youtube;
    date = gift.date;
  }
}
