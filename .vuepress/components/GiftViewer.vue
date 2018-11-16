<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-alert v-if="loading" show variant="light">
                <h4 class="alert-heading">Retrieving CryptoGift. Do not refresh the page.</h4>
                <ui--loader :loading="true"></ui--loader>
            </b-alert>
            <div v-else-if="!gift.id">
                <b-alert show variant="warning">
                    No CryptoGift ID provided
                </b-alert>

                <b-jumbotron>
                    <template slot="header">
                        <b-img slot="aside" :src="$withBase('/assets/images/logo-color.png')" width="100" :alt="$site.title"></b-img> {{ $site.title }}
                    </template>
                    <template slot="lead">
                        {{ $site.description }}
                    </template>
                    <b-button variant="outline-success" to="/send.html" size="lg">Create your CryptoGift</b-button>
                </b-jumbotron>
            </div>
            <div v-else>
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
                                    <b-button type="submit" variant="outline-success" size="lg">Decrypt your CryptoGift</b-button>
                                </b-form>
                            </b-card-body>
                        </b-card>
                    </template>
                    <template v-else>
                        <gift-box :gift="gift" :network="network.current"></gift-box>
                    </template>
                </template>
                <template v-else>
                    <b-card no-body class="shadow-lg border-0 rounded-0">
                        <b-card-body>
                            <p class="card-text" v-if="gift.date">CryptoGift will be visible on {{ formattedDate }}</p>
                            <p class="card-text" v-else>Gift doesn't exist</p>
                        </b-card-body>
                    </b-card>
                </template>
            </div>
        </b-col>
    </b-row>
</template>

<script>
  import GiftBox from './ui/GiftBox.vue';

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
          style: 0,
        },
      }
    },
    computed: {
      formattedDate () {
        return new Date(this.gift.date).toLocaleString();
      },
    },
    async mounted() {
      this.gift.id = this.getParam('id');
      if (this.gift.id) {
        this.currentNetwork = this.getParam('network') || this.network.default;
        await this.initDapp();
      } else {
        this.loading = false;
      }
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
      ready () {
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
          }

          this.loading = false;
        });
      },
      getToken () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            this.loading = true;

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
              this.loading = false;
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
        this.gift.style = structure[5];
        this.gift.visible = true;
        this.gift.loaded = true;

        this.loading = false;
      },
    },
  };
</script>
