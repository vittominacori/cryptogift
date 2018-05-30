import assertRevert from '../helpers/assertRevert';
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

export default function shouldMintAndBurnERC721Token (accounts, tokenIds) {
  const firstTokenId = tokenIds[0];
  const unknownTokenId = 3;
  const creator = accounts[0];
  const minter = accounts[1];
  const anotherAccount = accounts[2];
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  describe('like a mintable and burnable ERC721Token', function () {
    describe('mint', function () {
      const to = accounts[1];
      const tokenId = unknownTokenId;
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.mint(to, tokenId, { from: minter });
          logs = result.logs;
        });

        it('assigns the token to the new owner', async function () {
          const owner = await this.token.ownerOf(tokenId);
          owner.should.be.equal(to);
        });

        it('increases the balance of its owner', async function () {
          const balance = await this.token.balanceOf(to);
          balance.should.be.bignumber.equal(1);
        });

        it('emits a transfer event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Transfer');
          logs[0].args._from.should.be.equal(ZERO_ADDRESS);
          logs[0].args._to.should.be.equal(to);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });
      });

      describe('when the given owner address is the zero address', function () {
        it('reverts', async function () {
          await assertRevert(this.token.mint(ZERO_ADDRESS, tokenId, { from: minter }));
        });
      });

      describe('when the given token ID was already tracked by this contract', function () {
        it('reverts', async function () {
          await assertRevert(this.token.mint(accounts[1], firstTokenId, { from: minter }));
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;
      const sender = creator;
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.burn(tokenId, { from: sender });
          logs = result.logs;
        });

        it('burns the given token ID and adjusts the balance of the owner', async function () {
          await assertRevert(this.token.ownerOf(tokenId));
          const balance = await this.token.balanceOf(sender);
          balance.should.be.bignumber.equal(1);
        });

        it('emits a burn event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.eq('Transfer');
          logs[0].args._from.should.be.equal(sender);
          logs[0].args._to.should.be.equal(ZERO_ADDRESS);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });
      });

      describe('when there is a previous approval', function () {
        beforeEach(async function () {
          await this.token.approve(accounts[1], tokenId, { from: sender });
          const result = await this.token.burn(tokenId, { from: sender });
          logs = result.logs;
        });

        it('clears the approval', async function () {
          const approvedAccount = await this.token.getApproved(tokenId);
          approvedAccount.should.be.equal(ZERO_ADDRESS);
        });

        it('emits an approval event', async function () {
          logs.length.should.be.equal(2);

          logs[0].event.should.be.eq('Approval');
          logs[0].args._owner.should.be.equal(sender);
          logs[0].args._approved.should.be.equal(ZERO_ADDRESS);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);

          logs[1].event.should.be.eq('Transfer');
        });
      });

      describe('when sender is not the contract owner', function () {
        it('reverts', async function () {
          const newTokenId = 4;
          await this.token.mint(creator, newTokenId, { from: minter });
          await assertRevert(this.token.burn(newTokenId, { from: minter }));
        });
      });

      describe('when the given token ID was not owned by this sender', function () {
        it('reverts', async function () {
          const newTokenId = 4;
          await this.token.mint(creator, newTokenId, { from: minter });
          await assertRevert(this.token.burn(newTokenId, { from: anotherAccount }));
        });
      });

      describe('when the given token ID was not tracked by this contract', function () {
        it('reverts', async function () {
          await assertRevert(this.token.burn(unknownTokenId, { from: sender }));
        });
      });
    });
  });
};
