<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <ui--loader></ui--loader>
            <b-jumbotron>
                <template slot="header">{{ $site.title }} 🦄🎁</template>
                <template slot="lead">{{ $site.description }}</template>
                <hr class="my-4">
                <p>Send Ethereum to a friend for birthday or Christmas, or send a love message. <br>Encrypt and make it eternal.</p>
                <b-button variant="outline-success" to="/send.html" size="lg">Send a CryptoGift</b-button>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
