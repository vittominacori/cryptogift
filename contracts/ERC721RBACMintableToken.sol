pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";


contract ERC721RBACMintableToken is ERC721Token, Ownable, RBAC {
  event MintFinished();

  bool public mintingFinished = false;

  /**
   * A constant role name for indicating minters.
   */
  string public constant ROLE_MINTER = "minter";

  modifier canMint() {
    require(!mintingFinished, "Minting is finished");
    _;
  }

  /**
   * @dev add role based logic
   */
  modifier hasMintPermission() {
    checkRole(msg.sender, ROLE_MINTER);
    _;
  }

  constructor(string _name, string _symbol) public
  ERC721Token(_name, _symbol)
  { }

  /**
   * @dev add a minter role to an address
   * @param minter address
   */
  function addMinter(address minter) public onlyOwner {
    addRole(minter, ROLE_MINTER);
  }

  /**
   * @dev remove a minter role from an address
   * @param minter address
   */
  function removeMinter(address minter) public onlyOwner {
    removeRole(minter, ROLE_MINTER);
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() public onlyOwner canMint returns (bool) {
    mintingFinished = true;
    emit MintFinished();
    return true;
  }

  /**
   * @dev Override to add the can mint check
   */
  function _mint(address _to, uint256 _tokenId) internal canMint hasMintPermission {
    super._mint(_to, _tokenId);
  }
}
