<template>
    <div v-if="!loading">
        <!--<h3>Prop passed via data attribute: {{ message }}</h3>-->

        <b-card no-body class="shadow-lg" v-if="currentToken.visible">
            <h4 slot="header">For {{ currentToken.content.receiver }}</h4>
            <b-card-body>
                <p class="card-test">{{ currentToken.content.message }}</p>
            </b-card-body>
            <youtube :video-id="currentToken.content.youtube" :player-vars="playerVars"></youtube>
            <b-card-footer>
                <small class="text-muted">
                    {{ currentToken.amount }} ETH, From <strong>{{ currentToken.content.sender }}</strong> on <strong>{{ currentToken.formattedDate }}</strong>
                </small>
            </b-card-footer>
        </b-card>
        <b-card no-body class="shadow-lg" v-else>
            <b-card-body>
                <p class="card-test" v-if="currentToken.date">Gift will be visible on {{ currentToken.formattedDate }}</p>
                <p class="card-test" v-else>Gift doesn't exist</p>
            </b-card-body>
        </b-card>
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
    props: ['message'],
    data () {
      return {
        loading: true,
        playerVars: {
          autoplay: 0,
          rel: 0,
          controls: 0,
          showinfo: 0,
        },
        encryptionKey: '1hr29p28i5h3',
        currentToken: {
          visible: false,
          id: 0,
          amount: 0,
          content: {
            sender: '',
            receiver: '',
            message: '',
            youtube: '',
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
          if (result[0]) {
            this.getToken();
          } else {
            this.currentToken.date = (result[1]).valueOf() * 1000;
            this.currentToken.formattedDate = new Date(this.currentToken.date).toLocaleString();
            this.loading = false;
          }
        });
      },
      getToken () {
        this.instances.token.getGift(this.currentToken.id, (err, result) => {
          if (err) {
            alert('Some error');
            this.loading = false;
            return;
          }
          this.formatStructure(result);
        });
      },
      formatStructure (structure) {
        this.currentToken.amount = this.web3.fromWei(structure[0]);
        this.currentToken.purchaser = structure[1];
        this.currentToken.beneficiary = structure[2];
        this.currentToken.content = JSON.parse(this.decrypt(structure[3], this.encryptionKey));
        this.currentToken.date = (structure[4]).valueOf() * 1000;
        this.currentToken.formattedDate = new Date(this.currentToken.date).toLocaleString();
        this.currentToken.style = structure[5];
        this.currentToken.visible = true;
        this.loading = false;
      },
    }
  }
</script>

<style>
    iframe {
        width: 100% !important;
        max-width: 100% !important;
    }
</style>
