This is a [HardHat](https://hardhat.org/) project.

# Getting Started

First run this command to install dependencies:

```
npm install
```
Then you can execute the tests:

```
npx hardhat test
```

## Celebrity Contract

### createCelebrity
Function used to request a new NFT (autograph) to a celeb.
```solidity
function createCelebrity(string memory name, uint price, uint responseTime) public

// Launches event CelebrityCreated
event CelebrityCreated(uint id, address indexed owner, string name, uint price, uint responseTime);
```

### deleteCelebrity
Delete a celebrity. Only the owner can delete it.
```solidity
function deleteCelebrity() public

// Launches event CelebrityDeleted
event CelebrityDeleted(uint id, address indexed owner);
```

### updateCelebrity
Update celebrity information.
```solidity
function updateCelebrity(string memory name, uint price, uint responseTime) public

// Launches event CelebrityUpdated
event CelebrityUpdated(uint id, address indexed owner, string name, uint price, uint responseTime);
```

### getCelebrity
Gets celebrity information by address.
```solidity
function getCelebrity(address addr) public view returns (string memory, uint, uint)
```

### getTotalSupply
Gets number of celebrities.
```solidity
function getTotalSupply() public view returns (uint)
```

## Autograph Request Contract

### createRequest
Function used to request a new NFT (autograph) to a celeb.
```solidity
function createRequest(address to) public payable

// Launches event RequestCreated
event RequestCreated(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created);
```

### deleteRequest
Method used to remove a request after the locking period expired.
```solidity
function deleteRequest(uint id) public

// Launches event RequestDeleted
event RequestDeleted(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created);
```

### signRequest
Method used to sign a pending request.
```solidity
function signRequest(uint id, string memory nftHash, string memory metadata) public

// Launches event RequestSigned
event RequestSigned(uint id, address indexed from, address indexed to, uint price, uint responseTime, uint created, string nftHash, string metadata);
```

## Autograph Contract (ERC-721)

### mint
Function used to mint a new NFT.
```solidity
function mint(address to, string memory hash, string memory metadata) public returns (uint)

// Launches event Minted
event Minted(uint id, address owner);
```

### balanceOf
Count all NFTs assigned to an owner.
```solidity
function balanceOf(address owner) public view virtual override returns (uint256)
```

### ownerOf
Find the owner of an NFT.
```solidity
function ownerOf(uint256 tokenId) public view virtual override returns (address)
```

### name
A descriptive name for a collection of NFTs in this contract.
```solidity
function name() public view virtual override returns (string memory)
```

### symbol
An abbreviated name for NFTs in this contract.
```solidity
function symbol() public view virtual override returns (string memory)
```

### tokenURI
A distinct Uniform Resource Identifier (URI) for a given asset.
```solidity
function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
```

### baseURI
Returns the base URI set via {_setBaseURI}. This will be automatically added as a prefix in {tokenURI} to each token's URI, or to the token ID if no specific URI is set for that token ID.
```solidity
function baseURI() public view virtual returns (string memory)
```

### tokenOfOwnerByIndex
Enumerate NFTs assigned to an owner.
```solidity
function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256)
```

### totalSupply
See {IERC721Enumerable-totalSupply}.
```solidity
function totalSupply() public view virtual override returns (uint256)
```

### tokenByIndex
See {IERC721Enumerable-tokenByIndex}.
```solidity
function tokenByIndex(uint256 index) public view virtual override returns (uint256)
```

### approve
Change or reaffirm the approved address for an NFT.
```solidity
function approve(address to, uint256 tokenId) public virtual override
```

### transferFrom
Transfer ownership of an NFT.
```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual override
```
