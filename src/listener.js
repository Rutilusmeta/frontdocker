const { Web3 } = require('web3');

// Initialize Web3 instance
const web3 = new Web3('http://172.20.0.1:7545');

ABI = require('./contracts/abi/contracts/NFTMarketplace.sol/NFTMarketplace.json');

// Get contract instance
const contract = new web3.eth.Contract(ABI.abi, "0xCC52002af9CB334378924361121eF45CE19B62c1");

contract.on("TokenCreated", (error, event) => {
    if (error) {
        console.error('Error:', error);
        return;
    }

    // Access event data
    const { owner, tokenId } = event.returnValues;
    
    // Print event data
    console.log('Token Created - Owner:', owner, 'TokenId:', tokenId);
});

// Subscribe to the event
/*contract.events.TokenCreated({}, (error, event) => {
    if (error) {
        console.error('Error:', error);
        return;
    }

    // Access event data
    const { owner, tokenId } = event.returnValues;
    
    // Print event data
    console.log('Token Created - Owner:', owner, 'TokenId:', tokenId);
})
.on('connected', () => {
    console.log('Event listener connected');
});
.on('error', (error) => {
    console.error('Event listener error:', error);
});*/

// Keep the process alive
process.stdin.resume();
