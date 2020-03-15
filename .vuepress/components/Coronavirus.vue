<template>
    <div v-if="!loading">
        <template v-if="!makingTransaction">
            <b-alert show variant="warning">
                <h4 class="alert-heading">Help Italy against Coronavirus (COVID-19)</h4>
                <p>
                    We are experiencing an unprecedented moment in history and the lives of every one of us has been affected.
                    Many of us are taking action to cope with an event that has so suddently struck the lives of the Italian people and many others across the globe.<br>
                    Be present by entering the below <b-badge variant="danger">#againstcoronavirus</b-badge> campaign.<br>
                </p>
                <hr>
                <p>
                    <b-link v-b-toggle="'how-it-works'">How it works?</b-link>
                </p>
                <b-collapse id="how-it-works">
                    <p>
                        By entering this campaign you will create a <b-link to="/about.html" target="_blank">CryptoGift</b-link> donating
                        an amount of Ether to this <b-link :href="`${network.current.etherscanLink}/address/${gift.beneficiary}`" target="_blank">ETH address</b-link>.<br>
                        No commission will be collected on donations made during this fundraising initiative.<br>
                        100% of each donation will be converted about on April 1, 2020 and donated to
                        <b-link href="https://www.charitystars.com/collection/wewin" target="_blank">CharityStars</b-link>'
                        <b>#WeWin</b> campaign to support the Luigi Sacco Hospital in Milan,
                        the San Matteo Hospital in Pavia, the Spallanzani Hospital in Rome and the Italian Red Cross.<br>
                        You will find this donation as made from <b>CryptoGift</b> on CharityStars' campaign page.
                    </p>
                    <hr>
                    <small>
                        NOTE: CryptoGift encrypt your message using Advanced Encryption Standard (AES) and, usually,
                        allows you to choose an encryption key during CryptoGift building.
                        Your data lives on the blockchain but only who hold the key will be able to decrypt your message
                        (as explained in our <b-link target="_blank" to="/privacy-policy.html">Privacy policy</b-link>).
                        For donations made using this page, instead, encryption key will be force to be {{ encryptionKey }} in order
                        to show latest donations below. So your message could be visible to people who use this key to decrypt your message.
                    </small>
                </b-collapse>
            </b-alert>
            <b-form @submit.prevent="createGift">
                <fieldset :disabled="!metamask.installed">
                    <b-row>
                        <b-col lg="7" class="mb-4">
                            <b-card class="shadow" bg-variant="light">
                                <b-form-group id="gift-sender-group"
                                              label="Sender Name:"
                                              label-for="gift-sender">
                                    <b-form-input id="gift-sender"
                                                  name="gift-sender"
                                                  type="text"
                                                  size="lg"
                                                  v-model="gift.content.sender"
                                                  v-validate="'required'"
                                                  data-vv-as="Sender"
                                                  :class="{'is-invalid': errors.has('gift-sender')}"
                                                  placeholder="Enter your name">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-sender')" class="text-danger">
                                        {{ errors.first('gift-sender') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-message-group"
                                              label="Message:"
                                              label-for="gift-message"
                                              description="The awesome message you want to send.">
                                    <b-form-textarea id="gift-message"
                                                     name="gift-message"
                                                     v-model="gift.content.message"
                                                     v-validate="'required'"
                                                     data-vv-as="Message"
                                                     :class="{'is-invalid': errors.has('gift-message')}"
                                                     placeholder="Enter your message"
                                                     :rows="7"
                                                     :no-resize="true">
                                    </b-form-textarea>
                                    <small v-show="errors.has('gift-message')" class="text-danger">
                                        {{ errors.first('gift-message') }}
                                    </small>
                                </b-form-group>

                                <b-form-group>
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input"
                                               id="gift-privacy-and-terms"
                                               name="gift-privacy-and-terms"
                                               v-validate="'required'"
                                               :class="{'is-invalid': errors.has('gift-privacy-and-terms')}"
                                               value="1"
                                               v-model="gift.privacyAndTerms">
                                        <label class="form-check-label" for="gift-privacy-and-terms">
                                            I've read and agreed the CryptoGift <b-link target="_blank" :href="$withBase('/terms-of-use.html')">Terms of use</b-link> and <b-link target="_blank" :href="$withBase('/privacy-policy.html')">Privacy policy</b-link>.
                                        </label>
                                    </div>
                                </b-form-group>
                            </b-card>
                        </b-col>
                        <b-col lg="5" class="mb-4">
                            <b-card class="shadow" bg-variant="light">
                                <b-alert show variant="warning" v-if="!metamask.installed">
                                    You need <b-link href="https://metamask.io/" target="_blank">MetaMask</b-link> extension.
                                </b-alert>
                                <b-alert show variant="warning" v-else-if="metamask.netId !== network.current.id">
                                    You are on the wrong Network.<br>Please switch your MetaMask on <b>{{ network.current.name }}</b>.
                                </b-alert>

                                <b-form-group id="gift-value-group"
                                              label="Donation Value:"
                                              label-for="gift-value">
                                    <b-input-group append="ETH">
                                        <b-form-input id="gift-value"
                                                      name="gift-value"
                                                      step="any"
                                                      type="number"
                                                      min="0"
                                                      size="lg"
                                                      v-model="gift.amount"
                                                      v-validate="{ required: true, min_value: 0.01, decimal: 4 }"
                                                      data-vv-as="Value"
                                                      :class="{'is-invalid': errors.has('gift-value')}"
                                                      placeholder="Enter donation value in ETH">
                                        </b-form-input>
                                    </b-input-group>
                                    <small v-show="errors.has('gift-value')" class="text-danger">
                                        {{ errors.first('gift-value') }}
                                    </small>
                                </b-form-group>

                                <b-list-group class="mb-4">
                                    <b-list-group-item variant="light" class="d-flex justify-content-between align-items-center">
                                        Donation Value <b-badge variant="light" pill>{{ gift.amount || 0 }} ETH</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item variant="light" class="d-flex justify-content-between align-items-center">
                                        CryptoGift Cost <b-badge variant="light" pill>{{ price }} ETH</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item class="d-flex justify-content-between align-items-center">
                                        Total <b-badge variant="light" pill>{{ totalPrice }} ETH</b-badge>
                                    </b-list-group-item>
                                </b-list-group>

                                <b-button type="submit" variant="outline-success" size="lg" class="mb-2">Send your Donation</b-button>
                                <b-button variant="outline-info" size="lg" class="mb-2" v-on:click="preview">Preview</b-button>
                            </b-card>
                        </b-col>
                    </b-row>
                </fieldset>
            </b-form>

            <b-row v-if="donationList.length > 0">
                <b-col lg="12">
                    <b-card no-body header="Latest donations ❤️" class="shadow border-0 rounded-0 my-2"></b-card>
                    <b-alert variant="info" show>Note: use <b>{{ encryptionKey }}</b> to decrypt.</b-alert>
                    <b-row class="mt-1">
                        <b-col md="12" v-for="item in donationList" :key="item.id" v-if="item.visible" class=" mt-2 px-3">
                            <small-gift-box :gift="item" :network="network.current"></small-gift-box>
                        </b-col>
                    </b-row>
                    <b-row class="my-5" v-if="donationList.length < donationsNumber">
                        <b-col md="12" class="text-center">
                            <b-btn size="lg"
                                   variant="outline-light"
                                   @click="loadMore">
                                Load more
                            </b-btn>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </template>
        <template v-else>
            <b-row>
                <b-col lg="8" offset-lg="2">
                    <b-card v-if="tokenLink"
                            :img-src="$withBase('assets/images/cryptogift-header.jpg')"
                            title="View your unique CryptoGift on the Blockchain."
                            class="shadow mb-3 border-0 rounded-0"
                            bg-variant="light">
                        <b-row>
                            <b-col md="9" class="mb-2">
                                <p class="card-text">
                                    <b-button variant="outline-success" target="_blank" :href="tokenLink">{{ tokenLink }}</b-button>
                                </p>
                                <p class="card-text">
                                    Visit the link above or scan the QR Code.<br>
                                    Find out who sent it to you and what he wants to say.<br><br>
                                    Your encryption key: <b-badge variant="info" class="p-2">{{ encryptionKey }}</b-badge>
                                </p>
                            </b-col>
                            <b-col md="3" class="mb-2">
                                <b-img v-if="qrcode" :src="qrcode" fluid-grow></b-img>
                                <b-button v-on:click="print" variant="link" class="d-print-none mt-3">Print your Gift</b-button>
                            </b-col>
                        </b-row>
                    </b-card>

                    <b-alert show variant="warning" class="d-print-none">
                        <h6>Your encryption key is <b>{{ encryptionKey }}</b></h6>
                        <b>Do not lose it!</b> It cannot be recovered if you lose it. It allows receiver to decrypt your message. You <b>must</b> copy and share it with receiver.
                    </b-alert>

                    <template v-if="trxHash">
                        <b-alert show variant="success" class="d-print-none">
                            <h4 class="alert-heading">Well! Transaction done!</h4>
                            <div class="text-truncate">
                                TxHash <b-link :href="trxLink" target="_blank">{{ trxHash }}</b-link>
                            </div>
                        </b-alert>
                        <b-alert v-if="!tokenLink" show variant="light">
                            <h4 class="alert-heading">Retrieving CryptoGift. Do not refresh the page.</h4>
                            <ui--loader :loading="true"></ui--loader>
                        </b-alert>
                    </template>
                    <b-alert v-else show variant="light">
                        <h4 class="alert-heading">Making transaction. Do not refresh the page.</h4>
                        <ui--loader :loading="true"></ui--loader>
                    </b-alert>
                </b-col>
            </b-row>
        </template>

        <b-modal ref="giftPreview"
                 hide-footer
                 body-bg-variant="warning"
                 size="lg"
                 title="CryptoGift Preview">
            <gift-box :gift="gift" :network="network.current"></gift-box>
        </b-modal>
    </div>
</template>

<script>
  import browser from '../mixins/browser';
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';
  import QRCode from 'qrcode';

  import GiftBox from './ui/GiftBox.vue';
  import SmallGiftBox from './ui/SmallGiftBox';

  export default {
    name: 'Coronavirus',
    mixins: [
      browser,
      encryption,
      dapp,
    ],
    components: {
      GiftBox,
      SmallGiftBox,
    },
    data () {
      return {
        loading: true,
        currentNetwork: null,
        price: 0, // fixed price
        trxHash: '',
        trxLink: '',
        tokenLink: '',
        qrcode: '',
        makingTransaction: false,
        encryptionKey: '#againstcoronavirus',
        gift: {
          beneficiary: '0xd712847702DFda2B70BEa86Ceb7cf81468D2392E',
          content: {
            sender: '',
            receiver: 'Italy',
            message: '',
          },
          date: new Date(),
          style: 3,
          amount: '',
          privacyAndTerms: false,
        },
        donationList: [],
        donationsNumber: 0,
        pagination: {
          page: 1,
          limit: 12,
        },
      };
    },
    computed: {
      totalPrice () {
        const price = new this.web3.BigNumber(this.price);
        const value = new this.web3.BigNumber(this.gift.amount || 0);
        return (price.add(value)).valueOf();
      },
    },
    mounted () {
      this.currentNetwork = this.network.default;
      this.initDapp();
    },
    methods: {
      async initDapp () {
        this.network.current = this.network.list[this.currentNetwork];
        try {
          await this.initWeb3(this.currentNetwork, true);
          this.initContracts();
        } catch (e) {
          alert(e);
          document.location.href = this.$withBase('/');
        }
      },
      async ready () {
        this.$validator.extend('eth_address', {
          getMessage: field => 'Insert a valid Ethereum wallet address.',
          validate: value => this.web3.isAddress(value),
        });

        await this.getDonationsData();

        this.loading = false;

        await this.getToken(this.donationsNumber);
      },
      createGift () {
        if (!this.metamask.installed) {
          alert('To create a CryptoGift please install MetaMask!');
          return;
        } else {
          if (this.metamask.netId !== this.network.current.id) {
            alert(`Your MetaMask in on the wrong network. Please switch on ${this.network.current.name} and try again!`);
            return;
          }
        }

        this.$validator.validateAll().then(async (result) => {
          if (result) {
            try {
              this.trxHash = '';
              this.trxLink = '';
              this.tokenLink = '';
              this.makingTransaction = true;

              if (!this.legacy) {
                await this.web3Provider.enable();
              }

              setTimeout(() => {
                const encryptedContent = this.encrypt(JSON.stringify(this.gift.content), this.encryptionKey);

                const beneficiary = this.gift.beneficiary || this.web3.eth.coinbase;

                this.instances.market.buyToken(
                  beneficiary,
                  encryptedContent,
                  (new Date(this.gift.date).getTime() / 1000),
                  this.gift.style,
                  {
                    value: this.web3.toWei(this.totalPrice, 'ether'),
                    from: this.web3.eth.coinbase,
                  },
                  (err, trxHash) => {
                    if (!err) {
                      this.trxHash = trxHash;
                      this.trxLink = this.network.current.etherscanLink + '/tx/' + this.trxHash;
                      this.instances.market.TokenPurchase(
                        {
                          purchaser: this.web3.eth.coinbase,
                          beneficiary: beneficiary,
                        },
                        (err, event) => {
                          if (!err) {
                            this.tokenLink = window.location.origin + this.$withBase(`/view.html?id=${(event.args.tokenId).valueOf()}`);
                            this.generateQRCode();
                          } else {
                            this.makingTransaction = false;
                            alert('Some error occurred. Maybe transaction failed for some reasons. Check your transaction id.');
                          }
                        });
                    } else {
                      this.makingTransaction = false;
                      alert('Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!');
                    }
                  }
                );
              }, 500);
            } catch (e) {
              this.makingTransaction = false;
              alert('Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!');
            }
          }
        });
      },
      preview () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            this.$refs.giftPreview.show();
          }
        });
      },
      generateQRCode () {
        if (this.tokenLink) {
          QRCode.toDataURL(this.tokenLink)
            .then(url => {
              this.qrcode = url;
            })
            .catch(err => {
              console.error(err);
            });
        }
      },
      loadMore () {
        this.pagination.page++;
        this.getToken(this.donationsNumber - this.donationList.length);
      },
      async getDonationsData () {
        try {
          this.donationsNumber = parseInt((await this.promisify(this.instances.token.totalSupply)).valueOf());
        } catch (e) {
          // this.loading = false;
          console.log(e); // eslint-disable-line no-console
        }
      },
      async getToken (tokenId) {
        try {
          const struct = await this.promisify(this.instances.token.getGift, tokenId);
          const token = this.formatStructure(tokenId, struct);

          this.donationList.push(token);

          if (
            this.donationList.length % (this.pagination.limit * this.pagination.page) !== 0 &&
            this.donationList.length < this.donationsNumber
          ) {
            this.getToken(this.donationsNumber - this.donationList.length);
          }
        } catch (e) {
          console.log('Some error occurred. Check your Encryption Key');
        }
      },
      formatStructure (tokenId, structure) {
        try {
          return {
            id: tokenId,
            amount: parseFloat(this.web3.fromWei(structure[0])),
            purchaser: structure[1],
            beneficiary: structure[2],
            content: JSON.parse(JSON.parse(this.web3.toAscii(this.decrypt(structure[3], this.encryptionKey)))),
            date: (structure[4]).valueOf() * 1000,
            style: structure[5],
            visible: true,
            tokenLink: window.location.origin + this.$withBase(`/view.html?id=${tokenId}`),
          };
        } catch (e) {
          // this.loading = false;
          // console.log('Some error occurred. Check your Encryption Key');
        }

        return {
          id: tokenId,
          visible: false,
        };
      },
    },
  };
</script>
