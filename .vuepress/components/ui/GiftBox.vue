<template>
    <b-card no-body class="shadow-lg border-0 rounded-0">
        <b-card-body>
            <h5>Dear {{ gift.content.receiver }},  <b-badge v-if="gift.id" :href="tokenExplorerLink" target="_blank" variant="secondary" class="float-right">#{{ gift.id }}</b-badge></h5>
            <p class="card-text pt-4 pb-3">{{ gift.content.message }}</p>
            <h6>{{ gift.content.sender }}</h6>
            <small>{{ formattedDate }}</small>
        </b-card-body>
        <b-card-footer v-if="gift.amount > 0 && gift.purchaser !== gift.beneficiary">
            <small class="text-muted">
                You received <strong>{{ gift.amount }} ETH</strong> at <b-link :href="beneficiaryLink" target="_blank">{{ gift.beneficiary }}</b-link>
            </small>
        </b-card-footer>
        <b-card-img :src="$withBase('assets/images/cryptogift-header.jpg')"
                    alt="CryptoGift"
                    bottom
                    class="rounded-0"></b-card-img>
    </b-card>
</template>

<script>
  export default {
    name: 'GiftBox',
    props: {
      gift: {
        type: Object,
        default: {},
      },
      network: {
        type: Object,
        default: {},
      },
    },
    computed: {
      formattedDate () {
        return new Date(this.gift.date).toLocaleString();
      },
      tokenExplorerLink () {
        return this.network.etherscanLink + '/token/' + __TOKEN_ADDRESS__ + '?a=' + this.gift.id;
      },
      beneficiaryLink () {
        return this.network.etherscanLink + '/address/' + this.gift.beneficiary + '#internaltx';
      },
    },
  };
</script>

