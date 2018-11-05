# CryptoGift

[![Build Status](https://travis-ci.org/vittominacori/cryptogift.svg?branch=master)](https://travis-ci.org/vittominacori/cryptogift)
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/cryptogift/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/cryptogift?branch=master)


An ERC721 NFT Token and Marketplace to buy and give away an Ethereum based Collectible Gift.


Gift has:

* sender: who is sending the gift
* receiver: who is receiving the gift
* message: a message for the receiver
* amount: the value of ETH sent to the receiver
* style: a number representing the message style
* date: the date after which the gift is visible


Code created using [Open Zeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) and [Truffle Framework](https://github.com/trufflesuite/truffle).

## DAPP Source
 
Discover DApp source [here](https://github.com/vittominacori/cryptogift/tree/dapp).  

## Installation

Install truffle.

```bash
npm install -g truffle      // Version 4.1.14+ required.
```

## Install dependencies

```bash
npm install
```

## Linter

Use Solium

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use both and fix

```bash
npm run lint:fix
```

## Compile and test the contracts.

Open the Truffle console

```bash
truffle develop
```

Compile 

```bash
compile 
```

Test

```bash
test
```

## Run server

Run the `liteserver` development server.

```bash
npm run dev
```

## Optional

Install the [truffle-flattener](https://github.com/alcuadrado/truffle-flattener)

```bash
npm install -g truffle-flattener
```
 
Usage 

```bash
truffle-flattener contracts/token/CryptoGiftToken.sol >> dist/CryptoGiftToken.sol
truffle-flattener contracts/marketplace/CryptoGiftMarketplace.sol >> dist/CryptoGiftMarketplace.sol
```

## License

Code released under the [MIT License](https://github.com/vittominacori/cryptogift/blob/master/LICENSE).
