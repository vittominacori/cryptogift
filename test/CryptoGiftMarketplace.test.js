const { ether } = require('./helpers/ether');
const { assertRevert } = require('./helpers/assertRevert');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftMarketplace = artifacts.require('CryptoGiftMarketplace.sol');
const CryptoGiftToken = artifacts.require('CryptoGiftToken.sol');

const ROLE_MINTER = 'minter';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('CryptoGiftMarketplace', function ([_, wallet, purchaser, beneficiary, anotherAccount]) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';
  const maxSupply = new BigNumber(3);

  const tokenDetails = {
    sender: 'Paperino',
    receiver: 'Topolino',
    message: 'Happy Birthday!',
    youtube: 'ABCD-123',
    date: Date.now(),
    style: 0,
  };

  const price = ether(0.0001);
  const value = ether(0.0001);

  beforeEach(async function () {
    this.token = await CryptoGiftToken.new(name, symbol, maxSupply);
    this.marketplace = await CryptoGiftMarketplace.new(price, wallet, this.token.address);
    await this.token.addMinter(this.marketplace.address);
  });

  context('creating a valid marketplace', function () {
    describe('if wallet is the zero address', function () {
      it('reverts', async function () {
        await assertRevert(
          CryptoGiftMarketplace.new(price, ZERO_ADDRESS, this.token.address)
        );
      });
    });

    describe('if token is the zero address', function () {
      it('reverts', async function () {
        await assertRevert(
          CryptoGiftMarketplace.new(price, wallet, ZERO_ADDRESS)
        );
      });
    });
  });

  describe('after creation', function () {
    it('should have minter role on token', async function () {
      const isMinter = await this.token.hasRole(this.marketplace.address, ROLE_MINTER);
      isMinter.should.equal(true);
    });

    it('price should be right set', async function () {
      (await this.marketplace.price()).should.be.bignumber.equal(price);
    });

    describe('change price', function () {
      it('owner can change price', async function () {
        await this.marketplace.setPrice(price.mul(2));
        (await this.marketplace.price()).should.be.bignumber.equal(price.mul(2));
      });

      it('others can\'t change price', async function () {
        await assertRevert(
          this.marketplace.setPrice(price.mul(2), { from: anotherAccount })
        );
      });
    });
  });

  describe('accepting payments', function () {
    it('should accept payments through buyToken function', async function () {
      await this.marketplace.buyToken(
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

    it('should reject payments if beneficiary is zero address', async function () {
      await assertRevert(
        this.marketplace.buyToken(
          ZERO_ADDRESS,
          tokenDetails.sender,
          tokenDetails.receiver,
          tokenDetails.message,
          tokenDetails.youtube,
          tokenDetails.date,
          tokenDetails.style,
          { value: value, from: purchaser }
        )
      );
    });

    it('should reject payments with an invalid price', async function () {
      await assertRevert(
        this.marketplace.buyToken(
          beneficiary,
          tokenDetails.sender,
          tokenDetails.receiver,
          tokenDetails.message,
          tokenDetails.youtube,
          tokenDetails.date,
          tokenDetails.style,
          { value: value.div(2), from: purchaser }
        )
      );
    });

    it('should reject payments through default payable function', async function () {
      await assertRevert(
        this.marketplace.send(value)
      );
    });
  });

  describe('token purchase', function () {
    it('should log purchase', async function () {
      const tokenId = await this.token.progressiveId();
      const { logs } = await this.marketplace.buyToken(
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
      await this.marketplace.buyToken(
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
      const preWallet = web3.eth.getBalance(wallet);
      const preBeneficiary = web3.eth.getBalance(beneficiary);
      await this.marketplace.buyToken(
        beneficiary,
        tokenDetails.sender,
        tokenDetails.receiver,
        tokenDetails.message,
        tokenDetails.youtube,
        tokenDetails.date,
        tokenDetails.style,
        { value: price.mul(3), from: purchaser }
      );
      const postWallet = web3.eth.getBalance(wallet);
      postWallet.minus(preWallet).should.be.bignumber.equal(price);
      const postBeneficiary = web3.eth.getBalance(beneficiary);
      postBeneficiary.minus(preBeneficiary).should.be.bignumber.equal(price.mul(2));
    });
  });
});
