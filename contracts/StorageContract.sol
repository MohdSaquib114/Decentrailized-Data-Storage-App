// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract StorageContract {
    struct File {
        string cid;
        address owner;
    }

    mapping(string => File) private files; // CID → File metadata
    mapping(string => mapping(address => bool)) private accessList; // CID → (User → Access)
    mapping(address => string[]) private userFiles; // User → List of CIDs
    mapping(string => address[]) private accessHistory; // CID → List of users who accessed the file
    mapping(string => mapping(address => uint256)) private accessTimestamps; // CID → (User → Timestamp)

    event FileUploaded(string indexed cid, address indexed owner);
    event AccessGranted(string indexed cid, address indexed user);
    event AccessRevoked(string indexed cid, address indexed user);
    event FileAccessed(string indexed cid, address indexed user, uint256 timestamp);
    event FileDeleted(string indexed cid, address indexed owner);

    modifier onlyOwner(string memory cid) {
        require(files[cid].owner == msg.sender, "Not the owner");
        _;
    }

    ///  Uploads a new file and stores CID on-chain
    function uploadFile(string memory cid) external {
        require(bytes(files[cid].cid).length == 0, "File already exists");

        files[cid] = File(cid, msg.sender);
        userFiles[msg.sender].push(cid); // Track user files

        emit FileUploaded(cid, msg.sender);
    }

    ///  Retrieves file metadata
    function getFile(string memory cid) external view returns (string memory fileCID, address owner) {
        require(files[cid].owner != address(0), "File not found");
        return (files[cid].cid, files[cid].owner);
    }

    ///  Grants access to a file
    function grantAccess(string memory cid, address user) external onlyOwner(cid) {
        require(!accessList[cid][user], "User already has access");
        accessList[cid][user] = true;
        emit AccessGranted(cid, user);
    }

    ///  Revokes access from a file
    function revokeAccess(string memory cid, address user) external onlyOwner(cid) {
        require(accessList[cid][user], "User does not have access");
        delete accessList[cid][user];
        emit AccessRevoked(cid, user);
    }

    ///  Checks if a user has access to a file
    function hasAccess(string memory cid, address user) external view returns (bool) {
        return accessList[cid][user] || files[cid].owner == user;
    }

    ///  Retrieves the list of files uploaded by a user
    function getUserFiles(address user) external view returns (string[] memory) {
        return userFiles[user];
    }

    ///  Tracks file access and logs the event
    function trackFileAccess(string memory cid, address user) external {
        require(files[cid].owner != address(0), "File not found");
        require(accessList[cid][user] || files[cid].owner == user, "Access denied");

        if (accessTimestamps[cid][user] == 0) {
            accessHistory[cid].push(user); // Add user to access history if not already logged
        }
        accessTimestamps[cid][user] = block.timestamp;

        emit FileAccessed(cid, user, block.timestamp);
    }

    ///  Retrieves the access history of a file
    function getAccessHistory(string memory cid) external view onlyOwner(cid) returns (address[] memory users, uint256[] memory timestamps) {
        uint256 length = accessHistory[cid].length;
        uint256[] memory times = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            times[i] = accessTimestamps[cid][accessHistory[cid][i]];
        }
        
        return (accessHistory[cid], times);
    }

   function deleteFile(string memory cid) external onlyOwner(cid) {
    require(files[cid].owner != address(0), "File not found");

    //Remove file from user's list
    string[] storage userFilesList = userFiles[msg.sender];
    for (uint256 i = 0; i < userFilesList.length; i++) {
        if (keccak256(abi.encodePacked(userFilesList[i])) == keccak256(abi.encodePacked(cid))) {
            userFilesList[i] = userFilesList[userFilesList.length - 1]; // Move last element to index
            userFilesList.pop(); // Remove last element
            break;
        }
    }

    // Remove access permissions (Manually clear access list)
    address[] memory grantedUsers = accessHistory[cid];
    for (uint256 i = 0; i < grantedUsers.length; i++) {
        address user = grantedUsers[i];
        accessList[cid][user] = false; // Instead of delete, set to false
        accessTimestamps[cid][user] = 0; // Reset timestamp
    }

    // Remove file metadata
    delete files[cid];

    //  Clear the access history array (reset the length)
    delete accessHistory[cid];

    emit FileDeleted(cid, msg.sender);
}

}
