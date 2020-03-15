<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-alert show variant="warning">
                <h4 class="alert-heading">Help Italy against Coronavirus (COVID-19)</h4>
                <p>
                    We are experiencing an unprecedented moment in history and the lives of every one of us has been affected.
                    Many of us are taking action to cope with an event that has so suddently struck the lives of the Italian people and many others across the globe.
                </p>
                <hr>
                <p>
                    <b-link to="/against-coronavirus.html">Be present</b-link>
                </p>
            </b-alert>
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
