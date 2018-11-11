<template>
    <div v-if="!loading">
        <b-row>
            <b-col lg="8" offset-lg="2">
                <template v-if="gift.visible">
                    <template v-if="!gift.loaded">
                        <b-card no-body class="shadow-lg border-0 rounded-0">
                            <b-card-body>
                                <b-form @submit.prevent="getToken">
                                    <b-form-group id="gift-encryption-key-group"
                                                  label="Encryption Key:"
                                                  label-for="gift-encryption-key"
                                                  description="Insert the Encryption Key">
                                        <b-form-input id="gift-encryption-key"
                                                      name="gift-encryption-key"
                                                      type="password"
                                                      v-model="encryptionKey"
                                                      v-validate="'required'"
                                                      :class="{'is-invalid': errors.has('gift-encryption-key')}">
                                        </b-form-input>
                                    </b-form-group>
                                    <b-button type="submit" variant="outline-success" size="lg">Decrypt your Gift</b-button>
                                </b-form>
                            </b-card-body>
                        </b-card>
                    </template>
                    <template v-else>
                        <gift-box :gift="gift"></gift-box>
                    </template>
                </template>
                <template v-else>
                    <b-card no-body class="shadow-lg border-0 rounded-0">
                        <b-card-body>
                            <p class="card-text" v-if="gift.date">Gift will be visible on {{ gift.formattedDate }}</p>
                            <p class="card-text" v-else>Gift doesn't exist</p>
                        </b-card-body>
                    </b-card>
                </template>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  import GiftBox from './ui-components/GiftBox.vue';

  import browser from '../mixins/browser';
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';

  export default {
    name: 'GiftViewer',
    components: {
      GiftBox,
    },
    mixins: [
      browser,
      encryption,
      dapp,
    ],
    data () {
      return {
        loading: true,
        encryptionKey: '',
        gift: {
          loaded: false,
          visible: false,
          id: 0,
          amount: 0,
          content: {
            sender: '',
            receiver: '',
            message: '',
          },
          date: '',
          style: '',
        }
      }
    },
    async mounted() {
      this.currentNetwork = this.getParam('network') || this.network.default;
      await this.initDapp();
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
        this.gift.id = this.getParam('id');
        this.getTokenVisibility();
      },
      getTokenVisibility () {
        this.instances.token.isVisible(this.gift.id, (err, result) => {
          if (err) {
            alert('Some error');
            this.loading = false;
            return;
          }

          this.gift.visible = result[0];

          if (!this.gift.visible) {
            this.gift.date = (result[1]).valueOf() * 1000;
            this.gift.formattedDate = new Date(this.gift.date).toLocaleString();
          }
          this.loading = false;
        });
      },
      getToken () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            try {
              this.instances.token.getGift(this.gift.id, (err, result) => {
                if (err) {
                  alert('Some error');
                  this.loading = false;
                  return;
                }
                this.formatStructure(result);
              });
            } catch (e) {
              alert("Some error occurred. Check your Encryption Key");
            }
          }
        });
      },
      formatStructure (structure) {
        this.gift.amount = parseFloat(this.web3.fromWei(structure[0]));
        this.gift.purchaser = structure[1];
        this.gift.beneficiary = structure[2];
        this.gift.content = JSON.parse(JSON.parse(this.web3.toAscii(this.decrypt(structure[3], this.encryptionKey))));
        this.gift.date = (structure[4]).valueOf() * 1000;
        this.gift.formattedDate = new Date(this.gift.date).toLocaleString();
        this.gift.style = structure[5];
        this.gift.visible = true;
        this.gift.loaded = true;
        this.gift.beneficiaryLink = this.network.current.etherscanLink + "/address/" + this.gift.beneficiary + '#internaltx';
      },
    },
  };
</script>
