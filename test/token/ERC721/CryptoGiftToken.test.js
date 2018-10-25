const { advanceBlock } = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const time = require('openzeppelin-solidity/test/helpers/time');
const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

const { shouldBehaveLikeERC721Full } = require('./behaviors/ERC721Full.behavior');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftToken = artifacts.require('CryptoGiftTokenMock.sol');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('CryptoGiftToken', function (accounts) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';

  const creator = accounts[0];
  const minter = accounts[1];
  const beneficiary = accounts[2];
  const anotherAccount = accounts[3];
  const maxSupply = new BigNumber(3);
  // const anotherAccount = accounts[3];

  let tokenId;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });

  beforeEach(async function () {
    this.structure = {
      amount: ether(0.1),
      sender: 'Paperino',
      receiver: 'Topolino',
      message: 'Lorem Ipsum',
      youtube: 'ABCD-123',
      date: (await time.latest()) - time.duration.weeks(1),
      style: 0,
    };

    this.token = await CryptoGiftToken.new(name, symbol, maxSupply, { from: creator });
  });

  context('like an ERC721Full', function () {
    shouldBehaveLikeERC721Full(accounts, name, symbol);
  });
});
