<template>
    <b-card no-body class="shadow border-0 rounded-0">
        <b-card-body>
            <b-row>
                <b-col md="8">
                    <h6>{{ gift.content.sender }}</h6>
                </b-col>
                <b-col md="4" class="text-right">
                    <b-badge v-if="gift.id" :href="tokenExplorerLink"
                             target="_blank" variant="secondary"
                             class="float-right">
                        #{{ gift.id }}
                    </b-badge>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <strong>{{ gift.amount }} ETH</strong>
                </b-col>
            </b-row>
        </b-card-body>
        <b-card-footer>
            <b-row>
                <b-col md="8">
                    <b-link target="_blank" :href="gift.tokenLink"><small>View details</small></b-link>
                </b-col>
                <b-col md="4" class="text-right">
                    <small>{{ formattedDate }}</small>
                </b-col>
            </b-row>
        </b-card-footer>
    </b-card>
</template>

<script>
  export default {
    name: 'SmallGiftBox',
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
      image () {
        return 'assets/images/' + (this.gift.style ? `styles/${this.gift.style}.jpg` : 'cryptogift-header.jpg');
      },
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
