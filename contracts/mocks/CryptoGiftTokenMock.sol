pragma solidity ^0.4.24;

import "../token/CryptoGiftToken.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol"; // solium-disable-line max-len

contract CryptoGiftTokenMock is CryptoGiftToken, ERC721Mintable, ERC721MetadataMintable { // solium-disable-line max-len

  constructor(
    string name,
    string symbol,
    uint256 maxSupply
  )
    public
    CryptoGiftToken(name, symbol, maxSupply)
  {}

  function exists(uint256 tokenId) external view returns (bool) {
    return _exists(tokenId);
  }

  function setTokenURI(uint256 tokenId, string uri) external {
    _setTokenURI(tokenId, uri);
  }

  function removeTokenFrom(address from, uint256 tokenId) external {
    _removeTokenFrom(from, tokenId);
  }
}
