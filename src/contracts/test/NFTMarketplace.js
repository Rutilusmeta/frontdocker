// NFTMarketplace.test.js

const { assert } = require("chai");
const NFTMarketplace = artifacts.require("NFTMarketplace");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("NFTMarketplace", (accounts) => {
  let marketplace;

  before(async () => {
    marketplace = await NFTMarketplace.deployed();
  });

  describe("updateListingPrice", () => {
    it("should allow only owner to update listing price", async () => {
      await marketplace.updateListingPrice(10, { from: accounts[0] });
      const newListingPrice = await marketplace.getListingPrice();
      assert.equal(newListingPrice, 10);
    });

    it("should revert if not called by the owner", async () => {
      await marketplace.updateListingPrice(10, { from: accounts[1] }).should.be.rejected;
    });
  });

  describe("startAuction", () => {
    it("should start a new auction", async () => {
      const tokenId = 1;
      const startingBid = 100;
      const duration = 3600; // 1 hour
      await marketplace.startAuction(tokenId, startingBid, duration, accounts[0]);
      const auction = await marketplace.getAuctionListing(0);
      assert.equal(auction.collectionAddress, accounts[0]);
      assert.equal(auction.tokenId, tokenId);
      assert.equal(auction.highestBid, startingBid);
      assert.equal(auction.active, true);
    });

    it("should revert if the caller is not the owner of the token", async () => {
      const tokenId = 1;
      const startingBid = 100;
      const duration = 3600; // 1 hour
      await marketplace.startAuction(tokenId, startingBid, duration, accounts[1]).should.be.rejected;
    });
  });

  describe("endAuction", () => {
    it("should end an active auction", async () => {
      const auctionId = 0;
      const auction = await marketplace.getAuctionListing(auctionId);
      await marketplace.endAuction(auctionId);
      const endedAuction = await marketplace.getAuctionListing(auctionId);
      assert.equal(endedAuction.active, false);
    });

    it("should revert if called by a non-owner", async () => {
      const auctionId = 0;
      await marketplace.endAuction(auctionId, { from: accounts[1] }).should.be.rejected;
    });
  });

  describe("placeBid", () => {
    it("should allow a bid higher than the current highest bid", async () => {
      const auctionId = 0;
      const startingBid = 100;
      const newBid = startingBid + 50;
      await marketplace.placeBid(auctionId, { value: newBid });
      const auction = await marketplace.getAuctionListing(auctionId);
      assert.equal(auction.highestBid, newBid);
    });

    it("should revert if the bid is lower than or equal to the current highest bid", async () => {
      const auctionId = 0;
      const startingBid = 100;
      const newBid = startingBid - 50;
      await marketplace.placeBid(auctionId, { value: newBid }).should.be.rejected;
    });
  });

  describe("getAllBids", () => {
    it("should return all bids for a given auction", async () => {
      const auctionId = 0;
      const bids = await marketplace.getAllBids(auctionId);
      assert.isArray(bids);
      // Add more assertions as needed
    });
  });

  describe("getAuctionListing", () => {
    it("should return details of a specific auction listing", async () => {
      const auctionId = 0;
      const auction = await marketplace.getAuctionListing(auctionId);
      // Add assertions to verify the correctness of the returned auction details
    });
  });

  describe("getAllAuctionListings", () => {
    it("should return details of all active auction listings", async () => {
      const auctions = await marketplace.getAllAuctionListings();
      assert.isArray(auctions);
      // Add more assertions as needed
    });
  });

  describe("getListingPrice", () => {
    it("should return the current listing price", async () => {
      const listingPrice = await marketplace.getListingPrice();
      assert.isNumber(listingPrice);
      // Add more assertions as needed
    });
  });

  describe("listNFT", () => {
    it("should list an NFT for sale", async () => {
      const tokenId = 1;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId, price, collectionAddress);
      const marketItems = await marketplace.fetchMarketItems();
      assert.isArray(marketItems);
      // Add more assertions as needed
    });

    it("should revert if price is not greater than 0", async () => {
      const tokenId = 1;
      const price = 0;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId, price, collectionAddress).should.be.rejected;
    });

    it("should revert if sent value is not equal to listing price", async () => {
      const tokenId = 1;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId, price, collectionAddress, { value: 50 }).should.be.rejected;
    });
  });
  describe("buyFromListing", () => {
    it("should allow purchasing an NFT listed for sale", async () => {
      const tokenId = 1;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId, price, collectionAddress);
      const marketItemsBeforePurchase = await marketplace.fetchMarketItems();
      assert.equal(marketItemsBeforePurchase.length, 1);
  
      const listingId = 0;
      await marketplace.buyFromListing(listingId, { value: price });
  
      const marketItemsAfterPurchase = await marketplace.fetchMarketItems();
      assert.equal(marketItemsAfterPurchase.length, 0);
  
      const myNFTs = await marketplace.fetchMyNFTs();
      assert.equal(myNFTs.length, 1);
    });
  
    it("should revert if the sent value does not match the asking price", async () => {
      const tokenId = 2;
      const price = 200;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId, price, collectionAddress);
  
      const listingId = 1;
      const wrongPrice = 150;
      await marketplace.buyFromListing(listingId, { value: wrongPrice }).should.be.rejected;
    });
  });
  
  describe("fetchMarketItems", () => {
    it("should return all market items listed for sale", async () => {
      const tokenId1 = 3;
      const tokenId2 = 4;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId1, price, collectionAddress);
      await marketplace.listNFT(tokenId2, price, collectionAddress);
  
      const marketItems = await marketplace.fetchMarketItems();
      assert.equal(marketItems.length, 2);
    });
  });
  
  describe("fetchMyNFTs", () => {
    it("should return all NFTs owned by the caller", async () => {
      const tokenId1 = 5;
      const tokenId2 = 6;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId1, price, collectionAddress);
      await marketplace.listNFT(tokenId2, price, collectionAddress);
  
      const myNFTs = await marketplace.fetchMyNFTs();
      assert.equal(myNFTs.length, 2);
    });
  });
  
  describe("fetchItemsListed", () => {
    it("should return all items listed by the caller", async () => {
      const tokenId1 = 7;
      const tokenId2 = 8;
      const price = 100;
      const collectionAddress = accounts[0];
      await marketplace.listNFT(tokenId1, price, collectionAddress);
      await marketplace.listNFT(tokenId2, price, collectionAddress);
  
      const itemsListed = await marketplace.fetchItemsListed();
      assert.equal(itemsListed.length, 2);
    });
  });
});
