// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";



contract ArtAlleyMarketplace {
    
    address private _owner;
    address private _cron;

    modifier only_owner {
        require(msg.sender == _owner, "Only the owner can call this function");
        _;
    }
    
    modifier only_croner {
        require(msg.sender == _cron, "Only the cron can call this function");
        _;
    }
    
 constructor(){
     _owner = msg.sender;
 }

    //item structure of makrketplace
    struct s_Marketpalceitem {
        uint256 Price;
        bool approval;
    }
    struct s_Marketpalceoffer{
        uint256 Price;
        uint256 Endtime;
        }
      

    //@dev here owner of NFT is the address parameter
    //@mapping from owner address to the total number of items related to the owner on marketplace
    
    mapping(address => mapping(address =>mapping(uint => s_Marketpalceitem)))
        private _s_marketplaceItem;
  //1st address is of the user 
    // second address is of collection contract
    //uint is for tokenId of the NFT mapped to the struct of offer
    mapping(address => mapping(address => mapping( uint256 => s_Marketpalceoffer)))
        private _s_marketplaceItemoffer;
    
  

    //@dev: event will occur when item will be created on the marketplace
    event itemCreation(
        address indexed owner,
        address indexed collectionAddress,
        uint256 tokenId,
        uint256 Price,
        bool aproval
    );
    //@dev event occurs when new item is listed to be sold on marketplace
    event newListingCreated(
        address indexed owner,
        address indexed collectionAddress,
        uint256 tokenId,
        uint256 listingPrice
    );
    event updatedListing(
        address indexed owner,
        address indexed collectionAddress,
        uint256 tokenId,
        uint256 listingPrice
    );
    event listingCancled(
        address indexed owner,
        address indexed collectionAddress,
        uint256 tokenId
    );
    //@dev event occurs when item is sold
    event listingSold(
        address indexed owner,
        address indexed collectionAddress,
        uint256 tokenId,
        uint256 Price
    );

    // @dev: this function is will initialise a new item on Marketplace
 
    event offerCreated(
        address indexed offerer,
        address indexed owner,

        address indexed collectionAddress,
        uint256 tokenId,
        uint256 Price,
        uint256 Endtime
    );
     event offerUpdated(
        address indexed offerer,
                address indexed owner,

        address indexed collectionAddress,
        
        uint256 tokenId,
        uint256 Price,
        uint256 Endtime
    );
      event offerAccepted(
        address indexed offerer,
        address indexed collectionAddress,
                address indexed owner,

        uint256 tokenId,
        uint256 Price,
        uint256 Endtime
    );
      event offerDeleted(
        address indexed offerer,
        address indexed collectionAddress,
        uint256 tokenId,
        uint256 Price,
        uint256 Endtime
    );

    function createListing(
        address collectionAddress,
        uint256 tokenId,
        uint256 listingPrice
    ) public  {
        address owner = IERC721(collectionAddress).ownerOf(tokenId); 
        require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
        require(owner == msg.sender, "User is not the owner of the tokken");       
        require(
            IERC721(collectionAddress).isApprovedForAll(
                msg.sender,
                address(this)
            )|| (IERC721(collectionAddress).getApproved(tokenId) == address(this)              
            ),
            "Marketplace is not approved to list items"
        );

        s_Marketpalceitem memory item = _s_marketplaceItem[msg.sender][collectionAddress][tokenId];

        if (item.Price== (0)) {
            
            _makeItem(collectionAddress, tokenId, listingPrice, true);
        } else {
            _s_marketplaceItem[msg.sender][collectionAddress][tokenId].approval = true;
        }
        emit newListingCreated(
            msg.sender,
            collectionAddress,
            tokenId,
            listingPrice
        );
    }
    //update Listing
    function updateListing(
        address collectionAddress,
        uint256 tokenId,
        uint256 listingPrice
    ) public {
        address owner = IERC721(collectionAddress).ownerOf(tokenId); 
        require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
        require(owner == msg.sender, "User is not the owner of the tokken");      
        s_Marketpalceitem memory item = _s_marketplaceItem[msg.sender][collectionAddress][tokenId];

        require(
            item.approval== true                         
            ,
            "Marketplace is not approved to list items"
        );
        require (item.Price!= listingPrice,"Listing Price cannot be same");    
        
          
        _s_marketplaceItem[msg.sender][collectionAddress][tokenId].Price = listingPrice;
        
        emit updatedListing(
            msg.sender,
            collectionAddress,
            tokenId,
            listingPrice
        );
    }


    //buy available listings on the marketplace
    function buyListing(
        address collectionAddress,
        uint256 tokenId
    ) public payable {
        address owner = IERC721(collectionAddress).ownerOf(tokenId);
        s_Marketpalceitem memory item = _s_marketplaceItem[owner][collectionAddress][tokenId];
        require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
        require(
            item.Price != (0),
            "Item is not listed on Marketplace"
        );
        require(
            item.approval == true,
            "Marketplace is not allowed to sell this tokken first createlisting on marketplace"
        );

        require(
            msg.value >= item.Price,
            "Amount send is less then the Price of the item."
        );

        //transfer tokken to msg.sender
        IERC721(collectionAddress).transferFrom(owner, msg.sender, tokenId);
        //transfer value to the owner of NFT
        payable(owner).transfer(msg.value);
        _s_marketplaceItem[msg.sender][collectionAddress][tokenId].approval = false;
        emit listingSold(msg.sender, collectionAddress, tokenId, msg.value);
    }

function cancleListing(
        address collectionAddress,
        uint256 tokenId
)public {
     address owner = IERC721(collectionAddress).ownerOf(tokenId);

        require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
        require(owner == msg.sender, "User is not the owner of the tokken");
        _s_marketplaceItem[msg.sender][collectionAddress][tokenId].approval = false;

        emit listingCancled(msg.sender,collectionAddress,tokenId);
}

 function createOffer(
        address collectionAddress,
        uint256 tokenId,
        uint256 Price,
        uint256 duration
    ) public payable{
        require(msg.value==(Price ),"Amount send must be equal to the Price of Offer");
        address owner = IERC721(collectionAddress).ownerOf(tokenId); 
       
        
        require (duration> 86400,"Duration cannot be less than 1 Day!");

        require(msg.sender!=owner,"Owner cannot create Offer");
        s_Marketpalceoffer memory itemoffer = _s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId];
        
        require ( itemoffer.Price == (0),"Offer already made must delete preious Offer");
        
        uint256 Endtime = block.timestamp + duration;
        
        _s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId] =s_Marketpalceoffer(Price,Endtime);
   
        emit offerCreated(msg.sender,owner, collectionAddress,tokenId,Price,Endtime);

        }
function updateOffer(
        address collectionAddress,
        uint256 tokenId,
        uint256 Price,
        uint256 duration
    ) public payable{
        require(msg.value== (Price ),"Amount send must be equal to the Price of Offer");
        address owner = IERC721(collectionAddress).ownerOf(tokenId); 
              
        require (duration> 86400,"Duration cannot be less than 1 Day!");

        require(msg.sender!=owner,"Owner cannot create Offer");
       
        s_Marketpalceoffer memory itemoffer = _s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId];
        require ( itemoffer.Price != 0,"create offer first");
        
        require ( itemoffer.Price != Price,"Offer already made with same price");

   
        
           payable(msg.sender).transfer((itemoffer.Price)); 
        
       
        
        uint256 Endtime = block.timestamp + duration;
        
        _s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId] =s_Marketpalceoffer(Price,Endtime);
   
        emit offerUpdated(msg.sender,owner ,collectionAddress,tokenId,Price,Endtime);

        }


function acceptOffer(address offerer, address collectionAddress,uint256 tokenId)

public payable{
        //No need check for end time since Item will not exit if time experired due to automation system
        address owner = IERC721(collectionAddress).ownerOf(tokenId); 
        require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
        require(owner == msg.sender, "User is not the owner of the tokken");       
        require(
            IERC721(collectionAddress).isApprovedForAll(
                msg.sender,
                address(this)
            )|| (IERC721(collectionAddress).getApproved(tokenId) == address(this)              
            ),
            "Marketplace is not approved to Transfer items"
        );
        //msg.sender is the owner of NFT
        IERC721(collectionAddress).transferFrom(msg.sender,offerer,tokenId);

        s_Marketpalceoffer memory itemoffer =_s_marketplaceItemoffer[offerer][collectionAddress][tokenId];

        payable(owner).transfer(itemoffer.Price);
        emit offerAccepted(offerer,owner,collectionAddress,tokenId,itemoffer.Price,itemoffer.Endtime);
        delete(_s_marketplaceItemoffer[offerer][collectionAddress][tokenId]);
       

}
function cronJobOfferGarbageClean (address offerer,address collectionAddress,uint256 tokenId)public payable only_croner{
    require(_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId].Endtime > block.timestamp,"Time has not ended");
    
    s_Marketpalceoffer memory itemoffer =_s_marketplaceItemoffer[offerer][collectionAddress][tokenId];
    
    payable(offerer).transfer(itemoffer.Price); 
    emit offerDeleted(msg.sender,collectionAddress,tokenId,itemoffer.Price,itemoffer.Endtime);
    delete(_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId]);

}
function declineOffer(
   address offerer,address collectionAddress,uint256 tokenId
)
public payable {
   address owner = IERC721(collectionAddress).ownerOf(tokenId); 
    require(
            owner != address(0),
            "NFT doesn't exits in the Collection or on Blockchain"
        );
    require(owner == msg.sender, "User is not the owner of the tokken"); 
      s_Marketpalceoffer memory itemoffer =_s_marketplaceItemoffer[offerer][collectionAddress][tokenId];

    payable(offerer).transfer(itemoffer.Price);

  

    emit offerDeleted(offerer,collectionAddress,tokenId,itemoffer.Price,itemoffer.Endtime);
    delete(_s_marketplaceItemoffer[offerer][collectionAddress][tokenId]);
}
function cancleOffer(address collectionAddress, uint256 tokenId) public payable{

    require(_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId].Price!= 0,"The item does not exit");
    payable(msg.sender).transfer(_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId].Price); 
    s_Marketpalceoffer memory itemoffer =_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId];
    
    emit offerDeleted(msg.sender,collectionAddress,tokenId,itemoffer.Price,itemoffer.Endtime);

    delete(_s_marketplaceItemoffer[msg.sender][collectionAddress][tokenId]);
}   

//Private functions

   function _makeItem(
        address collectionAddress,
        uint256 tokenId,
        uint256 Price,
        bool approval
    ) private {
        require(Price > 0, "Price must be greater than zero");
        // New item is maped to the address of the owner
        _s_marketplaceItem[msg.sender][collectionAddress][tokenId] = s_Marketpalceitem(
            Price,
            approval
        );
        emit itemCreation(
            msg.sender,
            collectionAddress,
            tokenId,
            Price,
            approval
        );
    }
function setcron(address newcron) public only_owner{
    _cron =newcron;
    }
function getcron() public only_owner returns(address){
    return _cron;
    }
}

    