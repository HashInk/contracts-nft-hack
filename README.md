# Hashink Contracts

## Celebrity Contract

##### createCelebrity
```solidity
function createCelebrity(string memory name, uint price, uint responseTime) public

// Launches event CelebrityCreated
event CelebrityCreated(uint id, address indexed owner, string name, uint price, uint responseTime);
```

##### deleteCelebrity
```solidity
function deleteCelebrity() public

// Launches event CelebrityDeleted
event CelebrityDeleted(uint id, address indexed owner);
```

##### updateCelebrity
```solidity
function updateCelebrity(string memory name, uint price, uint responseTime) public

// Launches event CelebrityUpdated
event CelebrityUpdated(uint id, address indexed owner, string name, uint price, uint responseTime);
```

##### getCelebrity
```solidity
function getCelebrity(address addr) public view returns (string memory, uint, uint)
```

##### getTotalSupply
```solidity
function getTotalSupply() public view returns (uint)
```
