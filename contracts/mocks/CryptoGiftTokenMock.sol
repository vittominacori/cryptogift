pragma solidity ^0.4.24;

import "../token/CryptoGiftToken.sol";


contract CryptoGiftTokenMock is CryptoGiftToken {

  constructor(
    string name,
    string symbol,
    uint256 maxSupply
  )
    public
    CryptoGiftToken(name, symbol, maxSupply)
  {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }

  function setTokenURI(uint256 tokenId, string uri) public {
    _setTokenURI(tokenId, uri);
  }

  function removeTokenFrom(address from, uint256 tokenId) public {
    _removeTokenFrom(from, tokenId);
  }
}
