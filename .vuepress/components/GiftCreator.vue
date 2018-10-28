<template>
    <div>
        <!--<h3>Prop passed via data attribute: {{ message }}</h3>-->

        <b-card bg-variant="light">
            <b-alert show variant="warning" v-if="!metamask.installed">
                You need the <a href="https://metamask.io/" target="_blank">MetaMask</a> extension.
            </b-alert>
            <b-alert show variant="warning" v-else-if="metamask.netId !== network.current.id">
                You are on the wrong Network.<br>Please switch your MetaMask on {{ network.current.name }}.
            </b-alert>

            <br>

            <b-form v-if="!makingTransaction" @submit.prevent="createGift">
                <fieldset :disabled="!metamask.installed || makingTransaction">

                    <b-form-group id="gift-sender-group"
                                  label="Sender Name:"
                                  label-for="gift-sender"
                                  description="The name of your gift sender">
                        <b-form-input id="gift-sender"
                                      name="gift-sender"
                                      type="text"
                                      v-model="gift.content.sender"
                                      v-validate="'required'"
                                      :class="{'is-invalid': errors.has('gift-sender')}"
                                      placeholder="Enter sender name">
                        </b-form-input>
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
                                      :class="{'is-invalid': errors.has('gift-receiver')}"
                                      placeholder="Enter receiver name">
                        </b-form-input>
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
                                      :class="{'is-invalid': errors.has('gift-date')}">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group id="gift-message-group"
                                  label="Message:"
                                  label-for="gift-message"
                                  description="The message you want to send">
                        <b-form-textarea id="gift-message"
                                         name="gift-message"
                                         v-model="gift.content.message"
                                         v-validate="'required'"
                                         :class="{'is-invalid': errors.has('gift-message')}"
                                         placeholder="Enter your message"
                                         :rows="4"
                                         :no-resize="true">
                        </b-form-textarea>
                    </b-form-group>

                    <b-form-group id="gift-beneficiary-group"
                                  label="Receiver Ethereum Address:"
                                  label-for="gift-beneficiary"
                                  description="The Ethereum address of your receiver">
                        <b-form-input id="gift-beneficiary"
                                      name="gift-beneficiary"
                                      type="text"
                                      v-model="gift.beneficiary"
                                      v-validate="'required|eth_address'"
                                      :class="{'is-invalid': errors.has('gift-beneficiary')}"
                                      placeholder="0x12312312...">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group id="gift-youtube-group"
                                  label="Youtube:"
                                  label-for="gift-youtube"
                                  description="The YouTube link (optional)">
                        <b-form-input id="gift-youtube"
                                      name="gift-youtube"
                                      type="url"
                                      v-model="gift.content.youtube"
                                      v-validate="'url'"
                                      :class="{'is-invalid': errors.has('gift-youtube')}"
                                      placeholder="Enter a YouTube video link">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group id="gift-style-group"
                                  label="Style:"
                                  label-for="gift-style"
                                  description="The style of your gift">
                        <b-form-select id="gift-style"
                                       name="gift-style"
                                       v-model="gift.style"
                                       v-validate="'required'"
                                       :class="{'is-invalid': errors.has('gift-style')}">
                            <option value="0">default</option>
                        </b-form-select>
                    </b-form-group>

                    <b-form-group>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input"
                                   id="gift-privacy-and-term"
                                   name="gift-privacy-and-term"
                                   v-validate="'required'"
                                   :class="{'is-invalid': errors.has('gift-privacy-and-term')}"
                                   value="1"
                                   v-model="gift.privacyAndTerms">
                            <label class="form-check-label" for="gift-privacy-and-term">
                                I accept the terms and use
                            </label>
                        </div>
                    </b-form-group>

                    <b-button type="submit" variant="primary">Submit</b-button>
                </fieldset>
            </b-form>
            <b-alert v-else show variant="success">
                <div v-if="encryptionKey !== ''">Your encryption key is <b>{{ encryptionKey }}</b></div>
                <div>Making transaction. Do not refresh the page. Please wait...</div>
                <div v-if="trxHash !== ''">
                    <b>Well! Transaction done!</b><br>
                    Transaction id <a :href="trxLink" target="_blank">{{ trxHash }}</a>
                </div>
                <div v-if="tokenLink !== ''">
                    <b>View <a :href="tokenLink">your Gift</a>.</b>
                </div>
                <div v-else>
                    Retrieving Gift. Please wait...
                </div>
            </b-alert>
        </b-card>
    </div>
</template>

<script>
  import browser from '../mixins/browser';
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';

  export default {
    name: 'GiftCreator',
    mixins: [
      browser,
      encryption,
      dapp,
    ],
    props: ['message'],
    data () {
      return {
        loading: true,
        currentNetwork: null,
        price: 0,
        trxHash: '',
        trxLink: '',
        tokenLink: '',
        makingTransaction: false,
        encryptionKey: '',
        gift: {
          beneficiary: '',
          content: {
            sender: '',
            receiver: '',
            message: '',
            youtube: '',
          },
          date: '',
          style: 0,
          privacyAndTerms: false,
        }
      }
    },
    mounted() {
      this.currentNetwork = this.getParam('network') || this.network.default;
      this.initDapp();
      this.price = this.web3.toWei(0.0001, 'ether');
    },
    methods: {
      async initDapp () {
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
            alert("Your MetaMask in on the wrong network. Please switch on " + this.network.current.name + " and try again!");
            return;
          }
        }

        this.$validator.validateAll().then(async (result) => {
          if (result) {
            try {
              this.trxHash = '';
              this.trxLink = '';
              this.encryptionKey = '';
              this.makingTransaction = true;

              if (!this.legacy) {
                await this.web3Provider.enable();
              }

              setTimeout(() => {
                this.encryptionKey = this.randomKey();
                const encryptedContent = this.encrypt(JSON.stringify(this.gift.content), this.encryptionKey);

                const beneficiary = this.gift.beneficiary || this.web3.eth.coinbase;

                console.log(this.encryptionKey);
                console.log(encryptedContent);
                console.log(this.gift);
                console.log(beneficiary);
                console.log((new Date(this.gift.date).getTime() / 1000));
                console.log(this.web3.eth.coinbase);
                console.log(this.price);

                this.instances.market.buyToken(
                  beneficiary,
                  encryptedContent,
                  (new Date(this.gift.date).getTime() / 1000),
                  this.gift.style,
                  {
                    value: this.price,
                    from: this.web3.eth.coinbase
                  },
                  (err, trxHash) => {
                    if (!err) {
                      this.trxHash = trxHash;
                      this.trxLink = this.etherscanLink + "/tx/" + this.trxHash;
                      this.instances.market.TokenPurchase(
                        {
                          purchaser: this.web3.eth.coinbase,
                          beneficiary: beneficiary,
                        },
                        (err, event) => {
                          if (!err) {
                            this.tokenLink = `view?id=${(event.args.tokenId).valueOf()}`;
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
    }
  }
</script>
