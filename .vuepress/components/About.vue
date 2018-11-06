<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-alert show variant="info">👇 below is how a CryptoGift looks like.</b-alert>
        </b-col>
        <b-col lg="8" offset-lg="2" class="mb-3">
            <b-card :img-src="$withBase('assets/images/cryptogift-og.jpg')" no-body class="shadow-lg">
                <h4 slot="header">For Paperino</h4>
                <b-card-body>
                    <p class="card-test">You may be getting older but at least I still look great! Happy birthday best friend!</p>
                </b-card-body>
                <b-card-footer>
                    <small class="text-muted">
                        <strong>2 ETH</strong>, From <strong>Topolino</strong> on <strong>24/03/2018, 12:00:00</strong>
                    </small>
                </b-card-footer>
            </b-card>
        </b-col>
        <b-col lg="8" offset-lg="2">
            <b-card no-body class="shadow-lg">
                <b-card-body>
                    <p class="card-text">
                        A CryptoGift is an ERC721 Collectible or NFT Token to store a message into the Ethereum Blockchain.<br>
                        Send Ethereum to a friend for birthday, or send a love message. Crypt and make it eternal.<br><br>
                        Choose your and your receiver name, write an awesome message, decide how many ETH do you want to Gift (also zero) and
                        sign yor Gift using <a href="https://metamask.io/" target="_blank">MetaMask</a>.<br>
                        Copy and share gift link and encryption key with your receiver. Only who hold the key can decrypt your message.
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
  export default {
    name: 'About',
  };
</script>
