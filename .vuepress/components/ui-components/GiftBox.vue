<template>
    <b-card :img-src="$withBase('assets/images/cryptogift-header.jpg')" no-body class="shadow-lg border-0 rounded-0">
        <h4 slot="header">For {{ gift.content.receiver }}</h4>
        <b-card-body>
            <p class="card-test">{{ gift.content.message }}</p>
        </b-card-body>
        <b-card-footer>
            <small class="text-muted">
                <strong>{{ gift.amount }} ETH</strong>, From <strong>{{ gift.content.sender }}</strong> on <strong>{{ gift.formattedDate }}</strong>
            </small>
        </b-card-footer>
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
    },
  };
</script>

