App = {
  hasPrivacyMode: false,
  web3Provider: null,
  contracts: {},
  instances: {},
  init: function () {
    return App.initWeb3();
  },
  initWeb3: function () {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof ethereum !== 'undefined') {
      console.log('injected web3');
      App.web3Provider = ethereum;
      App.hasPrivacyMode = true;
    } else if (typeof web3 !== 'undefined') {
      console.log('injected web3 (legacy)');
      App.web3Provider = web3.currentProvider;
    } else {
      // set the provider you want from Web3.providers
      console.log('provided web3');
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },
  initContract: function () {
    if (App.hasPrivacyMode) {
      App.web3Provider.enable();
    }

    $.getJSON('CryptoGiftToken.json', function(data) {
      App.contracts.CryptoGiftToken = TruffleContract(data);
      App.contracts.CryptoGiftToken.setProvider(App.web3Provider);
    });

    $.getJSON('CryptoGiftMarketplace.json', function(data) {
      App.contracts.CryptoGiftMarketplace = TruffleContract(data);
      App.contracts.CryptoGiftMarketplace.setProvider(App.web3Provider);
    });
  },
  deployToken: async function () {
    const name = 'CryptoGiftToken';
    const symbol = 'GIFT';
    const maxSupply = new web3.BigNumber(1000000000);

    const logs = await App.contracts.CryptoGiftToken.new(name, symbol, maxSupply);

    console.log(logs);
  },
};

$(function() {
  $(window).load(function () {
    App.init();
  });
});
