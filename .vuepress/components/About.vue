<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-alert show variant="info">👇 below is how a CryptoGift looks like.</b-alert>
        </b-col>
        <b-col lg="8" offset-lg="2" class="mb-3">
            <b-alert v-if="loading" show variant="light">
                <h4 class="alert-heading">Retrieving CryptoGift. Do not refresh the page.</h4>
                <ui--loader :loading="true"></ui--loader>
            </b-alert>
            <template v-else>
                <gift-box :gift="gift" :network="network.current"></gift-box>
            </template>
        </b-col>
        <b-col lg="8" offset-lg="2">
            <b-card no-body class="shadow-lg">
                <b-card-body>
                    <p class="card-text">
                        A CryptoGift is an ERC721 Collectible or NFT Token to store a message into the Ethereum Blockchain.<br>
                        Send Ethereum to a friend for birthday, or send a love message. Crypt and make it eternal.<br><br>
                        Choose your and your receiver name, write an awesome message, decide how many ETH do you want to Gift (also zero) and
                        sign yor CryptoGift using <b-link href="https://metamask.io/" target="_blank">MetaMask</b-link>.<br>
                        Copy and share CryptoGift link and encryption key with your receiver. Only who hold the key can decrypt your message.
                    </p>
                    <p class="card-text">
                        Make your Gift unique on the Blockchain!
                    </p>
                    <b-button variant="outline-success" to="/send.html" size="lg">Send a CryptoGift</b-button>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
  import encryption from '../mixins/encryption';
  import dapp from '../mixins/dapp';

  import GiftBox from './ui/GiftBox.vue';

  export default {
    name: 'About',
    mixins: [
      encryption,
      dapp,
    ],
    components: {
      GiftBox,
    },
    data () {
      return {
        loading: true,
        encryptionKey: 'thebros',
        gift: {
          loaded: false,
          visible: false,
          id: 1,
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
    async mounted() {
      await this.initDapp();
    },
    methods: {
      async initDapp () {
        this.network.current = this.network.list[this.network.default];
        try {
          await this.initWeb3(this.network.default, true);
          this.initContracts();
        } catch (e) {
          alert(e);
        }
      },
      ready () {
        this.getToken();
      },
      getToken () {
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
