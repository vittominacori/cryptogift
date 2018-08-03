pragma solidity ^0.4.24;

import "../token/CryptoGiftToken.sol";


contract CryptoGiftTokenMock is CryptoGiftToken {

  constructor(
    string _name,
    string _symbol,
    uint256 _maxSupply
  )
    public
    CryptoGiftToken(_name, _symbol, _maxSupply)
  {}

  /**
   * @dev Only for test purpose
   */
  function mint(
    address _to,
    uint256 _tokenId
  )
    public
    canMint
    hasMintPermission
  {
    _mint(_to, _tokenId);
  }

  /**
   * @dev Only for test purpose
   */
  function setTokenURI(uint256 _tokenId, string _uri) public {
    super._setTokenURI(_tokenId, _uri);
  }
}
