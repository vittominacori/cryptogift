<template>
    <div v-if="!loading">
        <b-row>
            <b-col lg="8" offset-lg="2">
                <b-card no-body class="shadow-lg" v-if="currentToken.visible">
                    <template v-if="!currentToken.loaded">
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
                                <b-button type="submit" variant="success" size="lg">Decrypt</b-button>
                            </b-form>
                        </b-card-body>
                    </template>
                    <template v-else>
                        <h4 slot="header">For {{ currentToken.content.receiver }}</h4>
                        <b-card-body>
                            <p class="card-test">{{ currentToken.content.message }}</p>
                        </b-card-body>
                        <b-card-footer>
                            <small class="text-muted">
                                {{ currentToken.amount }} ETH, From <strong>{{ currentToken.content.sender }}</strong> on <strong>{{ currentToken.formattedDate }}</strong>
                            </small>
                        </b-card-footer>
                    </template>
                </b-card>
                <b-card no-body class="shadow-lg" v-else>
                    <b-card-body>
                        <p class="card-test" v-if="currentToken.date">Gift will be visible on {{ currentToken.formattedDate }}</p>
                        <p class="card-test" v-else>Gift doesn't exist</p>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
  import browser from '../mixins/browser';
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';

  export default {
    name: 'GiftViewer',
    mixins: [
      browser,
      encryption,
      dapp,
    ],
    data () {
      return {
        loading: true,
        playerVars: {
          autoplay: 0,
          rel: 0,
          controls: 0,
          showinfo: 0,
        },
        encryptionKey: '',
        currentToken: {
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
        this.currentToken.id = this.getParam('id');
        this.getTokenVisibility();
      },
      getTokenVisibility () {
        this.instances.token.isVisible(this.currentToken.id, (err, result) => {
          if (err) {
            alert('Some error');
            this.loading = false;
            return;
          }

          this.currentToken.visible = result[0];

          if (!this.currentToken.visible) {
            this.currentToken.date = (result[1]).valueOf() * 1000;
            this.currentToken.formattedDate = new Date(this.currentToken.date).toLocaleString();
          }
          this.loading = false;
        });
      },
      getToken () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            try {
              this.instances.token.getGift(this.currentToken.id, (err, result) => {
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
        this.currentToken.amount = parseFloat(this.web3.fromWei(structure[0]));
        this.currentToken.purchaser = structure[1];
        this.currentToken.beneficiary = structure[2];
        this.currentToken.content = JSON.parse(JSON.parse(this.web3.toAscii(this.decrypt(structure[3], this.encryptionKey))));
        this.currentToken.date = (structure[4]).valueOf() * 1000;
        this.currentToken.formattedDate = new Date(this.currentToken.date).toLocaleString();
        this.currentToken.style = structure[5];
        this.currentToken.visible = true;
        this.currentToken.loaded = true;
      },
    },
  };
</script>

<style>
    iframe {
        width: 100% !important;
        max-width: 100% !important;
    }
</style>
