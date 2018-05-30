pragma solidity ^0.4.24;

import "../ERC721RBACMintableToken.sol";


contract ERC721RBACMintableTokenMock is ERC721RBACMintableToken {
  constructor(string name, string symbol) public
  ERC721RBACMintableToken(name, symbol)
  { }

  function setTokenURI(uint256 _tokenId, string _uri) public {
    super._setTokenURI(_tokenId, _uri);
  }
}
