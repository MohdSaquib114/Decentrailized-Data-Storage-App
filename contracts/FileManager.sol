// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FileManager {
    struct File {
        string cid;
        address owner;
        mapping(address => bool) accessList;
    }

    mapping(uint256 => File) private files;
    mapping(address => uint256[]) private userFiles;
    uint256 public fileCount;

    event FileUploaded(uint256 fileId, address indexed owner, string cid);
    event AccessGranted(uint256 fileId, address indexed grantee);
    event AccessRevoked(uint256 fileId, address indexed revoked);

    modifier onlyOwner(uint256 fileId) {
        require(msg.sender == files[fileId].owner, "Not file owner");
        _;
    }

    modifier fileExists(uint256 fileId) {
        require(fileId < fileCount, "File does not exist");
        _;
    }

    function uploadFile(string calldata cid) external {
        uint256 fileId = fileCount;

        File storage newFile = files[fileId];
        newFile.cid = cid;
        newFile.owner = msg.sender;
        newFile.accessList[msg.sender] = true;

        userFiles[msg.sender].push(fileId);
        fileCount++;

        emit FileUploaded(fileId, msg.sender, cid);
    }

    function grantAccess(uint256 fileId, address user)
        external
        onlyOwner(fileId)
        fileExists(fileId)
    {
        files[fileId].accessList[user] = true;
        emit AccessGranted(fileId, user);
    }

    function revokeAccess(uint256 fileId, address user)
        external
        onlyOwner(fileId)
        fileExists(fileId)
    {
        files[fileId].accessList[user] = false;
        emit AccessRevoked(fileId, user);
    }

    function canAccess(uint256 fileId, address user)
        external
        view
        fileExists(fileId)
        returns (bool)
    {
        return files[fileId].accessList[user];
    }

    function getMyFiles() external view returns (uint256[] memory) {
        return userFiles[msg.sender];
    }

    function getFile(uint256 fileId) external view fileExists(fileId) returns (string memory cid, address owner) {
    File storage file = files[fileId];
    return (file.cid, file.owner);
}


  function getFileCID(uint256 fileId, address requester)
    external
    view
    fileExists(fileId)
    returns (string memory)
{
    require(files[fileId].accessList[requester], "Access denied");
    return files[fileId].cid;
}
 
    function getFileOwner(uint256 fileId)
        external
        view
        fileExists(fileId)
        returns (address)
    {
        return files[fileId].owner;
    }
}
