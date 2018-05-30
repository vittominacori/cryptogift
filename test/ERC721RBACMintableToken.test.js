import shouldBeAnERC721RBACMintableToken from './ERC721/ERC721RBACMintableToken.behaviour';

const ERC721RBACMintableToken = artifacts.require('ERC721RBACMintableTokenMock.sol');

contract('ERC721RBACMintableToken', function (accounts) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';
  const creator = accounts[0];
  const minter = accounts[1];

  beforeEach(async function () {
    this.token = await ERC721RBACMintableToken.new(name, symbol, { from: creator });
  });

  shouldBeAnERC721RBACMintableToken(accounts, creator, minter, name, symbol);
});
