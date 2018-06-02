pragma solidity ^0.4.24;

import "../ERC721RBACMintableToken.sol";


contract ERC721RBACMintableTokenMock is ERC721RBACMintableToken {
  constructor(string name, string symbol) public
  ERC721RBACMintableToken(name, symbol)
  { }

  function mint(address _to, uint256 _tokenId) canMint hasMintPermission public {
    super._mint(_to, _tokenId);
  }

  /**
   * @dev This mock is like the CriptoGiftToken burn
   * @dev Only contract owner or token owner can burn
   */
  function burn(uint256 _tokenId) public {
    address tokenOwner = msg.sender == owner ? ownerOf(_tokenId) : msg.sender;
    super._burn(tokenOwner, _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _uri) public {
    super._setTokenURI(_tokenId, _uri);
  }
}
