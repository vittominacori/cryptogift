<template>
    <b-row>
        <b-col lg="8" offset-lg="2">
            <b-jumbotron>
                <template slot="header">
                    <b-img slot="aside" :src="$withBase('/assets/images/logo-color.png')" width="100" :alt="$site.title"></b-img> {{ $site.title }}
                </template>
                <template slot="lead">
                    {{ $site.description }}
                </template>
                <hr class="my-4">
                <p>Make your Gift unique on the Blockchain!</p>
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
