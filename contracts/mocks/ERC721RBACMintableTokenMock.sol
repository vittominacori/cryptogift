pragma solidity ^0.4.24;

import "../ERC721RBACMintableToken.sol";


contract ERC721RBACMintableTokenMock is ERC721RBACMintableToken {
  constructor(string name, string symbol) public
  ERC721RBACMintableToken(name, symbol)
  { }

  /**
   * @dev Override to add the can mint check
   */
  function mint(address _to, uint256 _tokenId) canMint hasMintPermission public {
    super._mint(_to, _tokenId);
  }

  function setTokenURI(uint256 _tokenId, string _uri) public {
    super._setTokenURI(_tokenId, _uri);
  }
}
