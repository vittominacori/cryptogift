# CryptoGift

[![Build Status](https://travis-ci.org/vittominacori/cryptogift.svg?branch=master)](https://travis-ci.org/vittominacori/cryptogift)
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/cryptogift/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/cryptogift?branch=master)


An ERC721 token and Crowdsale to buy and give away an Ethereum based Collectible Gift.


Gift has:

* sender: who is sending the gift
* receiver: who is receiving the gift
* message: a message for the receiver
* youtube: an optional YouTube id (for instance a video message or a song)
* date: the date after which the gift is visible


Code created using [Open Zeppelin (openzeppelin-solidity)](https://github.com/OpenZeppelin/openzeppelin-solidity) and [Truffle Framework](https://github.com/trufflesuite/truffle).

 
 
## Installation


Install truffle, compiler and linter.

```bash
npm install -g truffle      // Version 4.1.11+ required.
npm install -g solium       // Version 1.1.7+ required.
```



## Install dependencies


```bash
npm install
```



## Linter


Use Solium

```bash
solium -d contracts
```



## Compile, migrate and test the contracts.
 

Open the Truffle console

```bash
truffle develop
```

Compile 

```bash
compile 
```

Migrate

```bash
migrate
```

Test

```bash
test
```



## Run server


Run the `liteserver` development server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.

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
truffle-flattener contracts/Migrations.sol >> dist/Migrations.sol
```
 


## TODO
 
DAPP is coming...
 

 
## Links

Solidity [Doc](https://solidity.readthedocs.io) [Github](https://solidity.readthedocs.io)

OpenZeppelin [Doc](https://openzeppelin.org/api/docs/open-zeppelin.html) [Github](https://github.com/OpenZeppelin)

Truffle [Doc](http://truffleframework.com/docs) [Github](https://github.com/trufflesuite/truffle)

Web3.js [Doc 0.20.4](https://github.com/ethereum/wiki/wiki/JavaScript-API) [Doc 1.0](http://web3js.readthedocs.io/en/1.0) [Github](https://github.com/ethereum/web3.js)
