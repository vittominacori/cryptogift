module.exports = {
  title: 'CryptoGift',
  description: 'CryptoGift is an ERC721 NFT Token and Marketplace to buy and give away an Ethereum based Collectible Gift. Make your Gift unique on the Blockchain!', // eslint-disable-line max-len
  base: '/cryptogift/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vittominacori.github.io/cryptogift' }],
    ['meta', { property: 'og:image', content: 'https://vittominacori.github.io/cryptogift/assets/images/cryptogift-og.jpg' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: 'https://vittominacori.github.io/cryptogift/assets/images/cryptogift-og.jpg' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:title', content: 'Make your Gift unique on the Blockchain | CryptoGift' }],
    ['script', { src: '/assets/js/web3.min.js' }],
  ],
  chainWebpack: (config) => {
    const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

    config.plugin('injections').tap(pluginArgs => pluginArgs.map(definitions => ({
      ...definitions,
      '__GOOGLE_ANALYTICS_ID__': isProd ? JSON.stringify('UA-115756440-2') : false,
      '__TOKEN_ADDRESS__': JSON.stringify(isProd ? '0x5fD14c015369BbFE101918d64944e59F38fC89Da' : '0x5fD14c015369BbFE101918d64944e59F38fC89Da'), // eslint-disable-line max-len
      '__MARKET_ADDRESS__': JSON.stringify(isProd ? '0x9073A480DC66D4CAEa36A28A0e1713AF86bF14Bf' : '0x9073A480DC66D4CAEa36A28A0e1713AF86bF14Bf'), // eslint-disable-line max-len
      '__DEFAULT_NETWORK__': JSON.stringify(isProd ? 'rinkeby' : 'rinkeby'),
    })));
  },
};
