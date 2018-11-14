<template>
    <div v-if="loading" class="p-4">
        <RingLoader
                class="mx-auto"
                :loading="loading"
                color="#e74c3c"
                :size="150"></RingLoader>
    </div>
</template>

<script>
  export default {
    name: 'Loader',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
