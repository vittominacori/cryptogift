<template>
    <b-navbar toggleable="md" variant="light">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/">{{ $site.title }} 🦄🎁</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item to="/against-coronavirus.html"><b-badge variant="danger">Against Coronavirus</b-badge></b-nav-item>
                <b-nav-item to="/about.html">About</b-nav-item>
                <b-nav-item to="/send.html">Send a CryptoGift</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item disabled><b-badge variant="info" class="p-1">{{ currentNetwork }}</b-badge></b-nav-item>
                <!--<b-nav-item target="_blank" href="https://vittominacori.github.io/ethereum-badge/detail.html?address=0x158D6727B17aaBa726D7318ac7dcA5edf8fAf6f8">Donate</b-nav-item>-->
                <b-nav-item-dropdown text="GitHub" right>
                    <b-dropdown-item target="_blank" href="https://github.com/vittominacori/cryptogift">Smart Contracts</b-dropdown-item>
                    <b-dropdown-item target="_blank" href="https://github.com/vittominacori/cryptogift/tree/dapp">DApp</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
  /* global __DEFAULT_NETWORK_NAME__ */

  export default {
    name: 'Header',
    data () {
      return {
        currentNetwork: __DEFAULT_NETWORK_NAME__,
      };
    },
  };
</script>
