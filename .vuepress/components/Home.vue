<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-jumbotron>
                <template slot="header">
                    {{ $site.title }}
                </template>
                <template slot="lead">
                    {{ $site.description }}
                </template>
                <hr class="my-4">
                <p>Make your Gift unique on the Blockchain!</p>
                <b-btn variant="success" to="/send.html" size="lg">Send a CryptoGift</b-btn>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
