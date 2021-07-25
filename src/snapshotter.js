const fs = require("fs");
const fetch = require("node-fetch");

/**
 * Creates a file containing all the owners for a given collection.
 *
 * @param {string} slug The collection slug on opensea
 * @param {string} address The contract address of the collection
 * @param {number} totalTokens Total items on the opensea page (approx)
 */
async function snapShot(slug, address, totalTokens) {
    const API_KEY = ""

    const pages = Math.ceil(totalTokens / 50); // Paginate to account for OpenSea api call limits.
    let offSet = 0;

    let num = 0;
    let totalOwned = 0;
    let foundTokens = 0;
    let holderAddresses = {};

    for (let i = 0; i < pages; i++) {
        offSet = i * 50;

        console.log('page:', i);
        const response = await fetch(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offSet}&limit=50&collection=${slug}`);
        const listOfTokens = await response.json();

        // Loop through found tokens
        for (const asset of listOfTokens.assets) {
            foundTokens++;

            const url = `https://deep-index.moralis.io/api/nft/contract/${address}/token/${asset.token_id}/owners?chain=eth&chain_name=mainnet&format=decimal&order=name.DESC`;
            const header = {
                method: 'GET', headers: {
                    'X-API-Key': API_KEY
                }
            }
            const fetchResult = await fetch(url, header);
            const jsonResult = await fetchResult.json();
            totalOwned += jsonResult.total;

            // iterate through results
            for (const result of jsonResult.result) {
                if (!holderAddresses[result.owner_of]) {
                    holderAddresses[result.owner_of] = 1;
                } else {
                    holderAddresses[result.owner_of]++;
                }
            }
            num++;
        }
    }

    // Log useful data
    console.log('total tokens:', foundTokens);
    console.log('total owned:', totalOwned);
    console.log('total holders', Object.keys(holderAddresses).length);

    // Write holders to json file
    fs.writeFile(`./src/snapshots/${slug}-holders.json`, JSON.stringify(holderAddresses), {flag: 'w'}, function(err) {
        // Log error if fail saving fails.
        if (err) return console.log(err);
    });
}

// Change
async function combineSnapShots() {
    const l1 = JSON.parse(fs.readFileSync('./snapshots/cxllabsHolders.json', 'utf8'));
    const l2 = JSON.parse(fs.readFileSync('./snapshots/ghxstHolders.json', 'utf8'));
    const l3 = JSON.parse(fs.readFileSync('./snapshots/ghxstsCxltureHolders.json', 'utf8'));
    const l4 = JSON.parse(fs.readFileSync('./snapshots/holders.json', 'utf8'));
    const l5 = JSON.parse(fs.readFileSync('./snapshots/pxinGxngHolders.json', 'utf8'));

    const arr = [l1, l2, l3, l4, l5];
    const allHolders = {}

    for (const obj of arr) {
        const keys = Object.keys(obj);
        for (let key of keys) {
            key = key.toLowerCase();
            if (!allHolders[key]) {
                allHolders[key] = 1;
            } else {
                allHolders[key]++;
            }
        }
    }
    // save
    fs.writeFile('allHolders.json', JSON.stringify(allHolders), {flag: 'w'}, function(err) {
        if (err) return console.log(err);
    });
}

snapShot("", "", 1);