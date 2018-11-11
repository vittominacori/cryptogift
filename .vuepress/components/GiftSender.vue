<template>
    <div v-if="!loading">
        <template v-if="!makingTransaction">
            <b-form @submit.prevent="createGift">
                <fieldset :disabled="!metamask.installed">
                    <b-row>
                        <b-col lg="7" class="mb-4">
                            <b-card class="shadow-lg" bg-variant="light">
                                <b-form-group id="gift-sender-group"
                                              label="Sender Name:"
                                              label-for="gift-sender"
                                              description="The name of your gift sender">
                                    <b-form-input id="gift-sender"
                                                  name="gift-sender"
                                                  type="text"
                                                  v-model="gift.content.sender"
                                                  v-validate="'required'"
                                                  data-vv-as="Sender"
                                                  :class="{'is-invalid': errors.has('gift-sender')}"
                                                  placeholder="Enter sender name">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-sender')" class="text-danger">
                                        {{ errors.first('gift-sender') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-receiver-group"
                                              label="Receiver Name:"
                                              label-for="gift-receiver"
                                              description="The name of your gift receiver">
                                    <b-form-input id="gift-receiver"
                                                  name="gift-receiver"
                                                  type="text"
                                                  v-model="gift.content.receiver"
                                                  v-validate="'required'"
                                                  data-vv-as="Receiver"
                                                  :class="{'is-invalid': errors.has('gift-receiver')}"
                                                  placeholder="Enter receiver name">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-receiver')" class="text-danger">
                                        {{ errors.first('gift-receiver') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-date-group"
                                              label="Date:"
                                              label-for="gift-date"
                                              description="The date of your gift">
                                    <b-form-input id="gift-date"
                                                  name="gift-date"
                                                  type="datetime-local"
                                                  v-model="gift.date"
                                                  v-validate="'required'"
                                                  data-vv-as="Date"
                                                  :class="{'is-invalid': errors.has('gift-date')}">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-date')" class="text-danger">
                                        {{ errors.first('gift-date') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-message-group"
                                              label="Message:"
                                              label-for="gift-message"
                                              description="The message you want to send">
                                    <b-form-textarea id="gift-message"
                                                     name="gift-message"
                                                     v-model="gift.content.message"
                                                     v-validate="'required'"
                                                     data-vv-as="Message"
                                                     :class="{'is-invalid': errors.has('gift-message')}"
                                                     placeholder="Enter your message"
                                                     :rows="4"
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
                                            I accept the terms and use
                                        </label>
                                    </div>
                                </b-form-group>
                            </b-card>
                        </b-col>
                        <b-col lg="5" class="mb-4">
                            <b-card class="shadow-lg" bg-variant="light">
                                <b-alert show variant="warning" v-if="!metamask.installed">
                                    You need <a href="https://metamask.io/" target="_blank">MetaMask</a> extension.
                                </b-alert>
                                <b-alert show variant="warning" v-else-if="metamask.netId !== network.current.id">
                                    You are on the wrong Network.<br>Please switch your MetaMask on <b>{{ network.current.name }}</b>.
                                </b-alert>

                                <b-form-group id="gift-beneficiary-group"
                                              label="Receiver Ethereum Address:"
                                              label-for="gift-beneficiary"
                                              description="The Ethereum address of your receiver">
                                    <b-form-input id="gift-beneficiary"
                                                  name="gift-beneficiary"
                                                  type="text"
                                                  v-model="gift.beneficiary"
                                                  v-validate="'required|eth_address'"
                                                  data-vv-as="Wallet Address"
                                                  :class="{'is-invalid': errors.has('gift-beneficiary')}"
                                                  placeholder="0x12312312...">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-beneficiary')" class="text-danger">
                                        {{ errors.first('gift-beneficiary') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-value-group"
                                              label="Gift Value:"
                                              label-for="gift-value"
                                              description="The value of your gift">
                                    <b-form-input id="gift-value"
                                                  name="gift-value"
                                                  step="any"
                                                  type="number"
                                                  min="0"
                                                  v-model="gift.value"
                                                  v-validate="{ required: true, decimal: 4 }"
                                                  data-vv-as="Value"
                                                  :class="{'is-invalid': errors.has('gift-value')}"
                                                  placeholder="Enter gift value">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-value')" class="text-danger">
                                        {{ errors.first('gift-value') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-encryption-key-group"
                                              label="Encryption Key:"
                                              label-for="gift-encryption-key"
                                              description="Insert the Encryption Key">
                                    <b-form-input id="gift-encryption-key"
                                                  name="gift-encryption-key"
                                                  type="text"
                                                  v-model="encryptionKey"
                                                  v-validate="'required|alpha_dash'"
                                                  data-vv-as="Encryption Key"
                                                  :class="{'is-invalid': errors.has('gift-encryption-key')}">
                                    </b-form-input>
                                    <small v-show="errors.has('gift-encryption-key')" class="text-danger">
                                        {{ errors.first('gift-encryption-key') }}
                                    </small>
                                </b-form-group>

                                <b-form-group id="gift-style-group"
                                              label="Style:"
                                              label-for="gift-style"
                                              description="The style of your gift"
                                              class="d-none">
                                    <b-form-select id="gift-style"
                                                   name="gift-style"
                                                   v-model="gift.style"
                                                   v-validate="'required'"
                                                   data-vv-as="Style"
                                                   :class="{'is-invalid': errors.has('gift-style')}">
                                        <option value="0">default ({{ price }} ETH)</option>
                                    </b-form-select>
                                    <small v-show="errors.has('gift-style')" class="text-danger">
                                        {{ errors.first('gift-style') }}
                                    </small>
                                </b-form-group>

                                <b-list-group class="mb-4">
                                    <b-list-group-item variant="light" class="d-flex justify-content-between align-items-center">
                                        Gift Value <b-badge variant="light" pill>{{ gift.value || 0 }} ETH</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item variant="light" class="d-flex justify-content-between align-items-center">
                                        Gift Cost <b-badge variant="light" pill>{{ price }} ETH</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item class="d-flex justify-content-between align-items-center">
                                        Total <b-badge variant="light" pill>{{ totalPrice }} ETH</b-badge>
                                    </b-list-group-item>
                                </b-list-group>

                                <b-button type="submit" variant="outline-success" size="lg">Send your Gift</b-button>
                            </b-card>
                        </b-col>
                    </b-row>
                </fieldset>
            </b-form>
        </template>
        <template v-else>
            <b-row>
                <b-col lg="8" offset-lg="2">
                    <b-card v-if="tokenLink"
                            :img-src="$withBase('assets/images/cryptogift-header.jpg')"
                            title="View your unique Gift on the Blockchain."
                            class="shadow-lg mb-3 border-0 rounded-0"
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

                    <b-alert v-if="trxHash" show variant="success" class="d-print-none">
                        <div class="text-truncate">
                            <b>Well! Transaction done!</b><br>
                            TxHash <a :href="trxLink" target="_blank">{{ trxHash }}</a>
                        </div>
                        <div v-if="!tokenLink">
                            Retrieving Gift. Please wait...
                        </div>
                    </b-alert>
                    <b-alert v-else show variant="light">Making transaction. Do not refresh the page. Please wait...</b-alert>
                </b-col>
            </b-row>
        </template>
    </div>
</template>

<script>
  import browser from '../mixins/browser';
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';
  import QRCode from 'qrcode';

  export default {
    name: 'GiftSender',
    mixins: [
      browser,
      encryption,
      dapp,
    ],
    data () {
      return {
        loading: true,
        currentNetwork: null,
        price: 0.0001, // fixed price
        trxHash: '',
        trxLink: '',
        tokenLink: '',
        qrcode: '',
        makingTransaction: false,
        encryptionKey: this.randomKey(),
        gift: {
          beneficiary: '',
          content: {
            sender: '',
            receiver: '',
            message: '',
          },
          date: '',
          style: 0,
          value: '',
          privacyAndTerms: false,
        }
      }
    },
    computed: {
      totalPrice () {
        const price = new this.web3.BigNumber(this.price);
        const value = new this.web3.BigNumber(this.gift.value || 0);
        return (price.add(value)).valueOf();
      },
    },
    mounted () {
      this.currentNetwork = this.getParam('network') || this.network.default;
      this.initDapp();
    },
    methods: {
      async initDapp() {
        this.network.current = this.network.list[this.currentNetwork];
        try {
          await this.initWeb3(this.currentNetwork, true);
          this.initContracts();
          this.loading = false;
        } catch (e) {
          alert(e);
          document.location.href = this.$withBase('/');
        }
      },
      ready () {
        this.$validator.extend('eth_address', {
          getMessage: field => 'Insert a valid Ethereum wallet address.',
          validate: value => this.web3.isAddress(value)
        });
      },
      createGift () {
        if (!this.metamask.installed) {
          alert("To create a Gift please install MetaMask!");
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
                    from: this.web3.eth.coinbase
                  },
                  (err, trxHash) => {
                    if (!err) {
                      this.trxHash = trxHash;
                      this.trxLink = this.network.current.etherscanLink + "/tx/" + this.trxHash;
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
                            alert("Some error occurred. Maybe transaction failed for some reasons. Check your transaction id.");
                          }
                        });
                    } else {
                      this.makingTransaction = false;
                      alert("Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!");
                    }
                  }
                );
              }, 500);
            } catch (e) {
              this.makingTransaction = false;
              alert("Some error occurred. Maybe you rejected the transaction or you have MetaMask locked!");
            }
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
              console.error(err)
            });
        }
      },
    },
  };
</script>
