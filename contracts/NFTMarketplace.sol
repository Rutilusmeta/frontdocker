// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

contract NFTMarketplace is OwnableUpgradeable, ReentrancyGuardUpgradeable, ERC721URIStorageUpgradeable {
    uint256 private _tokenIds;
    uint256 private _itemsSold;
    uint256 public _auctions;
    uint256 public _fixedListings;
    uint256 public _allBids;
    uint256 public listingPrice;

    struct MarketItem {
        uint256 tokenId;
        string tokenURI;
        address collectionAddress;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => AuctionListing) public auctionListings;
    mapping(uint256 => Bid) internal auctionBids;

    struct AuctionListing {
        address collectionAddress;
        uint tokenId;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        address owner;
        bool active;
        uint256[] bids;
        uint256 totalBids;
    }

    struct Bid {
        address bidder;
        uint256 amount;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        string tokenURI,
        address collectionAddress,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
    event NFTAuctionListed(
        uint256 indexed tokenId,
        uint256 startingBid,
        uint256 endTime
    );

    function initialize() public initializer {
        //__Ownable_init();
        //__ReentrancyGuard_init();
        listingPrice = 0 ether;
    }

    event TokenCreated(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI,
        address collectionAddress
    );

    function createToken(
        string memory _tokenURI,
        uint256 _price,
        address collectionAddress
    ) public payable returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(msg.sender, newTokenId);
        //_setTokenURI(newTokenId, _tokenURI);
        createMarketItem(newTokenId, _price, collectionAddress, _tokenURI);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price, address collectionAddress, string memory tokenURI) private {
        require(price > 0, "Price must be at least 1 wei");
        //require(
        //    msg.value == listingPrice,
        //    "Price must be equal to listing price"
        //);

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            tokenURI,
            collectionAddress,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            tokenURI,
            collectionAddress,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function updateListingPrice(
        uint256 _listingPrice
    ) public payable onlyOwner {
        listingPrice = _listingPrice;
    }

    function getMarketItem(uint256 tokenId) public view returns (MarketItem memory) {
        return idToMarketItem[tokenId];
    }

function getMarketItems(address owner) public view returns (MarketItem[] memory) {
    uint256 itemCount = 0;
    for (uint256 i = 1; i <= _tokenIds; i++) {
        if (owner == address(0) || idToMarketItem[i].owner == owner) {
            itemCount++;
        }
    }
    
    MarketItem[] memory items = new MarketItem[](itemCount);
    uint256 currentIndex = 0;
    for (uint256 i = 1; i <= _tokenIds; i++) {
        if (owner == address(0) || idToMarketItem[i].owner == owner) {
            items[currentIndex] = idToMarketItem[i];
            currentIndex++;
        }
    }
    
    return items;
}

    // Other functions...
}
