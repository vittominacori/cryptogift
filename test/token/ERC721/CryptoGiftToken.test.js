const { advanceBlock } = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const time = require('openzeppelin-solidity/test/helpers/time');
const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');

const { shouldBehaveLikeERC721Full } = require('./behaviors/ERC721Full.behavior');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftToken = artifacts.require('CryptoGiftTokenMock.sol');

contract('CryptoGiftToken', function (
  [
    creator,
    minter,
    beneficiary,
    anotherAccount,
    ...accounts
  ]
) {
  const name = 'CryptoGiftToken';
  const symbol = 'CGT';

  const maxSupply = new BigNumber(3);

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

  context('testing ERC721 behaviors', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: creator });
    });

    shouldBehaveLikeERC721Full(creator, minter, accounts, name, symbol);
  });

  context('check initial values', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: creator });
    });

    describe('styles', function () {
      it('should be zero', async function () {
        (await this.token.styles()).should.be.bignumber.equal(0);
      });

      it('minter should be able to update', async function () {
        const newStyle = new BigNumber(3);
        await this.token.setStyles(newStyle, { from: minter });
        (await this.token.styles()).should.be.bignumber.equal(newStyle);
      });

      it('minter should fail to update if less than actual value', async function () {
        const newStyle = new BigNumber(3);
        await this.token.setStyles(newStyle, { from: minter });
        (await this.token.styles()).should.be.bignumber.equal(newStyle);

        const invalidValue = new BigNumber(3);
        await shouldFail.reverting(
          this.token.setStyles(invalidValue, { from: minter })
        );
        (await this.token.styles()).should.be.bignumber.equal(newStyle);
      });

      it('another account should fail to update', async function () {
        const newStyle = new BigNumber(3);
        await shouldFail.reverting(
          this.token.setStyles(newStyle, { from: anotherAccount })
        );
        (await this.token.styles()).should.be.bignumber.equal(0);
      });
    });
  });

  context('creating new token', function () {
    beforeEach(async function () {
      await this.token.addMinter(minter, { from: creator });
      await this.token.newToken(
        this.structure.amount,
        minter,
        beneficiary,
        this.structure.sender,
        this.structure.receiver,
        this.structure.message,
        this.structure.youtube,
        this.structure.date,
        this.structure.style,
        { from: minter }
      );

      tokenId = await this.token.progressiveId();
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
          it('has an amount', async function () {
            const tokenAmount = tokenStructure[0];
            tokenAmount.should.be.bignumber.equal(this.structure.amount);
          });

          it('has a purchaser', async function () {
            const tokenPurchaser = tokenStructure[1];
            tokenPurchaser.should.be.equal(minter);
          });

          it('has a beneficiary', async function () {
            const tokenBeneficiary = tokenStructure[2];
            tokenBeneficiary.should.be.equal(beneficiary);
          });

          it('has a sender', async function () {
            const tokenSender = tokenStructure[3];
            tokenSender.should.be.equal(this.structure.sender);
          });

          it('has a receiver', async function () {
            const tokenReceiver = tokenStructure[4];
            tokenReceiver.should.be.equal(this.structure.receiver);
          });

          it('has a message', async function () {
            const tokenMessage = tokenStructure[5];
            tokenMessage.should.be.equal(this.structure.message);
          });

          it('has a youtube', async function () {
            const tokenYoutube = tokenStructure[6];
            tokenYoutube.should.be.equal(this.structure.youtube);
          });

          it('has a date', async function () {
            const tokenDate = tokenStructure[7];
            tokenDate.should.be.bignumber.equal(this.structure.date);
          });

          it('has a style', async function () {
            const tokenStyle = tokenStructure[8];
            tokenStyle.should.be.bignumber.equal(this.structure.style);
          });
        });
      });

      describe('when now is less than gift date', function () {
        let tokenVisibility;
        let giftTime;

        beforeEach(async function () {
          giftTime = (await time.latest()) + time.duration.weeks(1);

          await this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            giftTime,
            this.structure.style,
            { from: minter }
          );

          tokenId = await this.token.progressiveId();
          tokenVisibility = await this.token.isVisible(tokenId);
        });

        it('should not be visible', async function () {
          const visible = tokenVisibility[0];
          visible.should.be.equal(false);
        });

        describe('check metadata', function () {
          it('reverts', async function () {
            await shouldFail.reverting(this.token.getGift(tokenId));
          });
        });
      });

      describe('when token is burnt', function () {
        let tokenVisibility;

        beforeEach(async function () {
          await this.token.burn(tokenId, { from: beneficiary });
          tokenVisibility = await this.token.isVisible(tokenId);
        });

        it('should not be visible', async function () {
          const visible = tokenVisibility[0];
          visible.should.be.equal(false);
        });

        describe('check metadata', function () {
          it('reverts', async function () {
            await shouldFail.reverting(this.token.getGift(tokenId));
          });
        });
      });
    });

    describe('progressive id', function () {
      it('should increase', async function () {
        const oldProgressiveId = await this.token.progressiveId();

        await this.token.newToken(
          this.structure.amount,
          minter,
          beneficiary,
          this.structure.sender,
          this.structure.receiver,
          this.structure.message,
          this.structure.youtube,
          this.structure.date,
          this.structure.style,
          { from: minter }
        );
        const newProgressiveId = await this.token.progressiveId();

        newProgressiveId.should.be.bignumber.equal(oldProgressiveId.add(1));
      });
    });

    describe('date is equal to zero', function () {
      it('reverts', async function () {
        await shouldFail.reverting(
          this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
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

    describe('style is not available', function () {
      it('reverts', async function () {
        await shouldFail.reverting(
          this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            this.structure.date,
            999,
            { from: minter }
          )
        );
      });
    });

    describe('if max supply has been already reached', function () {
      it('reverts', async function () {
        const oldProgressiveId = await this.token.progressiveId();
        const tokenMaxSupply = await this.token.maxSupply();
        for (let i = oldProgressiveId; i < tokenMaxSupply.valueOf(); i++) {
          await this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            this.structure.date,
            this.structure.style,
            { from: minter }
          );
        }

        const newProgressiveId = await this.token.progressiveId();
        newProgressiveId.should.be.bignumber.equal(tokenMaxSupply);

        await shouldFail.reverting(
          this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
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

    describe('if beneficiary is the zero address', function () {
      it('reverts', async function () {
        await shouldFail.reverting(
          this.token.newToken(
            this.structure.amount,
            minter,
            ZERO_ADDRESS,
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

    describe('if caller has not minter permission', function () {
      it('reverts', async function () {
        await shouldFail.reverting(
          this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
            this.structure.sender,
            this.structure.receiver,
            this.structure.message,
            this.structure.youtube,
            this.structure.date,
            this.structure.style,
            { from: anotherAccount }
          )
        );
      });
    });
  });
});
