# Cool Cats Opensea Collection Snapshotting
Simple script to snapshot all owners of an opensea collection.

## Fill in some constants
In `src/snapshotter.js` you will need to fill in:
- API_KEY

## How to get a Moralis API key
A guide to getting your API key is available at [Moralis - Getting Started](https://docs.moralis.io/moralis-web3-rest/deep-index-api)

## Running the code
At the bottom of `src/snapshotter.js` you can fill in the opensea collection slug, contract address, and the number of available tokens in the collection.

Then use `npm run start` to generate your list of holders. A json file containing this list will be made in `src/snapshots`

### Note
This code is intended as a learning piece. Consider it as a starting point. You might want to improve the code with more error catching, maybe convert it to typescript (we do this), maybe put all the constants in an .env file.
