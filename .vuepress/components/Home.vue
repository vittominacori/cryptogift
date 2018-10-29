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
                <p>Buy and Send a CryptoGift</p>
                <b-btn variant="success" to="/send.html" size="lg">Send</b-btn>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>
