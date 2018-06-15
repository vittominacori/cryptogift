import { advanceBlock } from './helpers/advanceToBlock';
import { duration } from './helpers/increaseTime';
// import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
// import expectThrow from './helpers/expectThrow';
import assertRevert from './helpers/assertRevert';

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftToken = artifacts.require('CryptoGiftToken.sol');

contract('CryptoGiftToken', function (accounts) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';
  const creator = accounts[0];
  const minter = accounts[1];
  const maxSupply = new BigNumber(3);
  // const anotherAccount = accounts[3];

  let tokenId;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });

  beforeEach(async function () {
    this.structure = {
      sender: 'Paperino',
      receiver: 'Topolino',
      message: 'Lorem Ipsum',
      youtube: 'ABCD-123',
      date: latestTime() - duration.weeks(1),
      style: 1,
    };

    this.token = await CryptoGiftToken.new(name, symbol, maxSupply, { from: creator });
  });

  context('creating new token', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: creator });
      await this.token.newToken(
        minter,
        this.structure.sender,
        this.structure.receiver,
        this.structure.message,
        this.structure.youtube,
        this.structure.date,
        this.structure.style,
        { from: minter }
      );

      tokenId = await this.token.generatedTokens();
    });

    context('metadata', function () {
      let tokenStructure;

      describe('when now is greater than gift date', function () {
        let tokenVisibility;

        beforeEach(async function () {
          tokenStructure = await this.token.getGift(tokenId);
          tokenVisibility = await this.token.isVisible(tokenId);
        });

        it('should be visible', async function () {
          const visible = tokenVisibility[0];
          visible.should.be.equal(true);
        });

        describe('check metadata', function () {
          it('has a sender', async function () {
            const tokenSender = tokenStructure[0];
            tokenSender.should.be.equal(this.structure.sender);
          });

          it('has a receiver', async function () {
            const tokenReceiver = tokenStructure[1];
            tokenReceiver.should.be.equal(this.structure.receiver);
          });

          it('has a message', async function () {
            const tokenMessage = tokenStructure[2];
            tokenMessage.should.be.equal(this.structure.message);
          });

          it('has a youtube', async function () {
            const tokenYoutube = tokenStructure[3];
            tokenYoutube.should.be.equal(this.structure.youtube);
          });

          it('has a date', async function () {
            const tokenDate = tokenStructure[4];
            tokenDate.should.be.bignumber.equal(this.structure.date);
          });

          it('has a style', async function () {
            const tokenStyle = tokenStructure[5];
            tokenStyle.should.be.bignumber.equal(this.structure.style);
          });
        });
      });

      describe('when now is less than gift date', function () {
        let tokenVisibility;
        const giftTime = latestTime() + duration.weeks(1);

        beforeEach(async function () {
          await this.token.newToken(
            minter,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            giftTime,
            this.structure.style,
            { from: minter }
          );

          tokenId = await this.token.generatedTokens();
          tokenVisibility = await this.token.isVisible(tokenId);
        });

        it('should not be visible', async function () {
          const visible = tokenVisibility[0];
          visible.should.be.equal(false);
        });

        describe('check metadata', function () {
          it('reverts', async function () {
            await assertRevert(this.token.getGift(tokenId));
          });
        });
      });

      describe('when token is burnt', function () {
        let tokenVisibility;

        beforeEach(async function () {
          await this.token.burn(tokenId);
          tokenVisibility = await this.token.isVisible(tokenId);
        });

        it('should not be visible', async function () {
          const visible = tokenVisibility[0];
          visible.should.be.equal(false);
        });

        describe('check metadata', function () {
          it('reverts', async function () {
            await assertRevert(this.token.getGift(tokenId));
          });
        });
      });
    });

    describe('generated tokens', function () {
      it('should increase', async function () {
        const oldGeneratedToken = await this.token.generatedTokens();

        await this.token.newToken(
          minter,
          this.structure.sender,
          this.structure.receiver,
          this.structure.message,
          this.structure.youtube,
          this.structure.date,
          this.structure.style,
          { from: minter }
        );
        const newGeneratedToken = await this.token.generatedTokens();

        newGeneratedToken.should.be.bignumber.equal(oldGeneratedToken.add(1));
      });
    });

    describe('date is equal to zero', function () {
      it('reverts', async function () {
        await assertRevert(
          this.token.newToken(
            minter,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            0,
            this.structure.style,
            { from: minter }
          )
        );
      });
    });

    describe('if max supply has been already reached', function () {
      it('reverts', async function () {
        const oldGeneratedToken = await this.token.generatedTokens();
        const tokenMaxSupply = await this.token.maxSupply();
        for (let i = oldGeneratedToken; i < tokenMaxSupply.valueOf(); i++) {
          await this.token.newToken(
            minter,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            this.structure.date,
            this.structure.style,
            { from: minter }
          );
        }

        const newGeneratedToken = await this.token.generatedTokens();
        newGeneratedToken.should.be.bignumber.equal(tokenMaxSupply);

        await assertRevert(
          this.token.newToken(
            minter,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            this.structure.date,
            this.structure.style,
            { from: minter }
          )
        );
      });
    });
  });
});
