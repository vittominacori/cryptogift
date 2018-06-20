import expectThrow from '../helpers/expectThrow';
import shouldBeAnERC721Token from './ERC721Token.behaviour';
import assertRevert from '../helpers/assertRevert';

const ROLE_MINTER = 'minter';

export default function shouldRBACMintableERC721Token (accounts, creator, minter, name, symbol) {
  const anotherAccount = accounts[3];

  const tokenIds = [1, 2, 3];

  beforeEach(async function () {
    await this.token.mint(creator, tokenIds[0], { from: minter });
    await this.token.mint(creator, tokenIds[1], { from: minter });
  });

  describe('handle roles', function () {
    it('owner can add and remove a minter role', async function () {
      await this.token.addMinter(anotherAccount, { from: creator });
      let hasRole = await this.token.hasRole(anotherAccount, ROLE_MINTER);
      assert.equal(hasRole, true);

      await this.token.removeMinter(anotherAccount, { from: creator });
      hasRole = await this.token.hasRole(anotherAccount, ROLE_MINTER);
      assert.equal(hasRole, false);
    });

    it('another account can\'t add or remove a minter role', async function () {
      await expectThrow(
        this.token.addMinter(anotherAccount, { from: anotherAccount })
      );

      await this.token.addMinter(anotherAccount, { from: creator });
      await expectThrow(
        this.token.removeMinter(anotherAccount, { from: anotherAccount })
      );
    });
  });

  shouldBeAnERC721Token(accounts, creator, minter, name, symbol, tokenIds);

  describe('minting finished', function () {
    describe('when the token minting is not finished', function () {
      it('returns false', async function () {
        const mintingFinished = await this.token.mintingFinished();
        assert.equal(mintingFinished, false);
      });
    });

    describe('when the token is minting finished', function () {
      beforeEach(async function () {
        await this.token.finishMinting({ from: creator });
      });

      it('returns true', async function () {
        const mintingFinished = await this.token.mintingFinished();
        assert.equal(mintingFinished, true);
      });
    });
  });

  describe('finish minting', function () {
    describe('when the sender is the token owner', function () {
      const from = creator;

      describe('when the token minting was not finished', function () {
        it('finishes token minting', async function () {
          await this.token.finishMinting({ from });

          const mintingFinished = await this.token.mintingFinished();
          assert.equal(mintingFinished, true);
        });

        it('emits a mint finished event', async function () {
          const { logs } = await this.token.finishMinting({ from });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'MintFinished');
        });
      });

      describe('when the token minting was already finished', function () {
        beforeEach(async function () {
          await this.token.finishMinting({ from });
        });

        it('reverts', async function () {
          await assertRevert(this.token.finishMinting({ from }));
        });
      });
    });
  });

  describe('mint', function () {
    describe('when the sender has the minting permission', function () {
      const from = minter;

      describe('when the token minting is not finished', function () {
        it('mints', async function () {
          await this.token.mint(creator, tokenIds[2], { from });
        });
      });

      describe('when the token minting is finished', function () {
        beforeEach(async function () {
          await this.token.finishMinting({ from: creator });
        });

        it('reverts', async function () {
          await assertRevert(this.token.mint(creator, tokenIds[2], { from }));
        });
      });
    });

    describe('when the sender has not the minting permission', function () {
      const from = anotherAccount;

      describe('when the token minting is not finished', function () {
        it('reverts', async function () {
          await assertRevert(this.token.mint(creator, tokenIds[0], { from }));
        });
      });

      describe('when the token minting is already finished', function () {
        beforeEach(async function () {
          await this.token.finishMinting({ from: creator });
        });

        it('reverts', async function () {
          await assertRevert(this.token.mint(creator, tokenIds[0], { from }));
        });
      });
    });
  });
};
