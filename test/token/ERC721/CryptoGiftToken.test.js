const { advanceBlock } = require('openzeppelin-solidity/test/helpers/advanceToBlock');
const time = require('openzeppelin-solidity/test/helpers/time');
const { ether } = require('openzeppelin-solidity/test/helpers/ether');
const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');

const encryption = require('../../helpers/encryption');

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');
const { shouldBehaveLikeERC721Full } = require('./behaviors/ERC721Full.behavior');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CryptoGiftToken = artifacts.require('CryptoGiftTokenMock');

// each byte encoded to hex is 2 characters. 16 bytes will be 32 characters of hex.
const ENCRYPTION_KEY = encryption.randomKey(16);

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
      content: {
        sender: 'Paperino',
        receiver: 'Topolino',
        message: 'Lorem Ipsum',
      },
      date: (await time.latest()) - time.duration.weeks(1),
      style: 0,
    };

    this.encryptedContent = encryption.encrypt(JSON.stringify(this.structure.content), ENCRYPTION_KEY);

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
        this.encryptedContent,
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

          describe('checking content', function () {
            let decryptedTokenContent;
            let encryptedTokenContent;

            beforeEach(async function () {
              encryptedTokenContent = tokenStructure[3];
              decryptedTokenContent = JSON.parse(encryption.decrypt(encryptedTokenContent, ENCRYPTION_KEY));
            });

            it('has an encrypted token content', async function () {
              encryptedTokenContent.should.be.equal(this.encryptedContent);
            });

            it('has a sender', async function () {
              decryptedTokenContent.sender.should.be.equal(this.structure.content.sender);
            });

            it('has a receiver', async function () {
              decryptedTokenContent.receiver.should.be.equal(this.structure.content.receiver);
            });

            it('has a message', async function () {
              decryptedTokenContent.message.should.be.equal(this.structure.content.message);
            });
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
        let giftTime;

        beforeEach(async function () {
          giftTime = (await time.latest()) + time.duration.weeks(1);

          await this.token.newToken(
            this.structure.amount,
            minter,
            beneficiary,
            this.encryptedContent,
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
          this.encryptedContent,
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
            this.encryptedContent,
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
            this.encryptedContent,
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
            this.encryptedContent,
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
            this.encryptedContent,
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
            this.encryptedContent,
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
            this.encryptedContent,
            this.structure.date,
            this.structure.style,
            { from: anotherAccount }
          )
        );
      });
    });
  });

  context('like a TokenRecover', function () {
    beforeEach(async function () {
      this.instance = this.token;
    });

    shouldBehaveLikeTokenRecover([creator, anotherAccount]);
  });
});
