import ether from './helpers/ether';
import assertRevert from './helpers/assertRevert';

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftMarket = artifacts.require('CryptoGiftMarket.sol');
const CryptoGiftToken = artifacts.require('CryptoGiftToken.sol');

const ROLE_MINTER = 'minter';

contract('CryptoGiftMarket', function ([_, wallet, purchaser, beneficiary]) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';
  const maxSupply = new BigNumber(3);

  const tokenDetails = {
    sender: 'Paperino',
    receiver: 'Topolino',
    message: 'Happy Birthday!',
    youtube: 'ABCD-123',
    date: Date.now(),
    style: 1,
  };

  const price = ether(0.01);
  const value = ether(0.01);

  beforeEach(async function () {
    this.token = await CryptoGiftToken.new(name, symbol, maxSupply);
    this.crowdsale = await CryptoGiftMarket.new(price, wallet, this.token.address);
    await this.token.addMinter(this.crowdsale.address);
  });

  describe('after creation', function () {
    it('should have minter role on token', async function () {
      const isMinter = await this.token.hasRole(this.crowdsale.address, ROLE_MINTER);
      isMinter.should.equal(true);
    });
  });

  describe('accepting payments', function () {
    it('should accept payments through buyToken function', async function () {
      await this.crowdsale.buyToken(
        beneficiary,
        tokenDetails.sender,
        tokenDetails.receiver,
        tokenDetails.message,
        tokenDetails.youtube,
        tokenDetails.date,
        tokenDetails.style,
        { value: value, from: purchaser }
      ).should.be.fulfilled;
    });

    it('should reject payments through with an invalid price', async function () {
      await assertRevert(
        this.crowdsale.send(value.mul(2))
      );
    });

    it('should reject payments through default payable function', async function () {
      await assertRevert(
        this.crowdsale.send(value)
      );
    });
  });

  describe('token purchase', function () {
    it('should log purchase', async function () {
      const tokenId = await this.token.generatedTokens();
      const { logs } = await this.crowdsale.buyToken(
        beneficiary,
        tokenDetails.sender,
        tokenDetails.receiver,
        tokenDetails.message,
        tokenDetails.youtube,
        tokenDetails.date,
        tokenDetails.style,
        { value: value, from: purchaser }
      );
      const event = logs.find(e => e.event === 'TokenPurchase');
      should.exist(event);
      event.args.purchaser.should.equal(purchaser);
      event.args.beneficiary.should.equal(beneficiary);
      event.args.value.should.be.bignumber.equal(value);
      event.args.tokenId.should.be.bignumber.equal(tokenId.add(1));
    });

    it('should assign token to beneficiary', async function () {
      await this.crowdsale.buyToken(
        beneficiary,
        tokenDetails.sender,
        tokenDetails.receiver,
        tokenDetails.message,
        tokenDetails.youtube,
        tokenDetails.date,
        tokenDetails.style,
        { value: value, from: purchaser }
      );
      const balance = await this.token.balanceOf(beneficiary);
      balance.should.be.bignumber.equal(1);
    });

    it('should forward funds to wallet', async function () {
      const pre = web3.eth.getBalance(wallet);
      await this.crowdsale.buyToken(
        beneficiary,
        tokenDetails.sender,
        tokenDetails.receiver,
        tokenDetails.message,
        tokenDetails.youtube,
        tokenDetails.date,
        tokenDetails.style,
        { value: value, from: purchaser }
      );
      const post = web3.eth.getBalance(wallet);
      post.minus(pre).should.be.bignumber.equal(value);
    });
  });
});
