module.exports = {
  title: 'CryptoGift',
  description: 'An ERC721 NFT Token and Marketplace to buy and give away an Ethereum based Collectible Gift',
  base: '/cryptogift/',
  ga: 'UA-115756440-2',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vittominacori.github.io/cryptogift' }],
    ['meta', { property: 'og:image', content: 'https://vittominacori.github.io/cryptogift/assets/images/cryptogift.png' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: 'https://vittominacori.github.io/cryptogift/assets/images/cryptogift.png' }], // eslint-disable-line max-len
    ['meta', { property: 'twitter:title', content: 'CryptoGift' }],
    ['script', { src: '/assets/js/web3.min.js' }],
  ],
  chainWebpack: (config) => {
    const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

    config.plugin('injections').tap(pluginArgs => pluginArgs.map(definitions => ({
      ...definitions,
      '__TOKEN_ADDRESS__': JSON.stringify(isProd ? '0x9d938d3139A26477e5990FF5fD3eB5f4584AeE97' : '0x9d938d3139A26477e5990FF5fD3eB5f4584AeE97'), // eslint-disable-line max-len
      '__MARKET_ADDRESS__': JSON.stringify(isProd ? '0x4D97594F27A86E1440cC9b0C5361dC8F3B63f8E1' : '0x4D97594F27A86E1440cC9b0C5361dC8F3B63f8E1'), // eslint-disable-line max-len
      '__DEFAULT_NETWORK__': JSON.stringify(isProd ? 'rinkeby' : 'rinkeby'),
    })));
  },
};
