// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FileManager {
    struct File {
        string filename;
        string cid;
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
        address[] grantedAddresses;  // List of addresses granted access
    }

    mapping(uint256 => File) private files;
    mapping(address => uint256[]) private userFiles;
    uint256 public fileCount;

    event FileUploaded(uint256 fileId, address indexed owner, string cid, string filename, uint256 createdAt);
    event AccessGranted(uint256 fileId, address indexed grantee);
    event AccessRevoked(uint256 fileId, address indexed revoked);
    event FileUpdated(uint256 fileId, uint256 updatedAt);

    modifier onlyOwner(uint256 fileId) {
        require(msg.sender == files[fileId].owner, "Not file owner");
        _;
    }

    modifier fileExists(uint256 fileId) {
        require(fileId < fileCount, "File does not exist");
        _;
    }

    function uploadFile(
        string calldata cid,
        string calldata filename
    ) external {
        uint256 fileId = fileCount;

        // Only store essential file data to avoid too many variables
        File storage newFile = files[fileId];
        newFile.filename = filename;
        newFile.cid = cid;
        newFile.createdAt = block.timestamp;
        newFile.updatedAt = block.timestamp;
        newFile.owner = msg.sender;

        userFiles[msg.sender].push(fileId);
        fileCount++;

        // Emit event with reduced variables
        emit FileUploaded(fileId, msg.sender, cid, filename, newFile.createdAt);
    }

    function updateFile(
        uint256 fileId,
        string calldata filename
    ) external onlyOwner(fileId) fileExists(fileId) {
        File storage file = files[fileId];
        file.filename = filename;
        file.updatedAt = block.timestamp;

        emit FileUpdated(fileId, file.updatedAt);
    }

    function grantAccess(uint256 fileId, address user)
        external
        onlyOwner(fileId)
        fileExists(fileId)
    {
        files[fileId].grantedAddresses.push(user);
        emit AccessGranted(fileId, user);
    }

    function revokeAccess(uint256 fileId, address user)
        external
        onlyOwner(fileId)
        fileExists(fileId)
    {
        address[] storage grantedAddresses = files[fileId].grantedAddresses;
        for (uint256 i = 0; i < grantedAddresses.length; i++) {
            if (grantedAddresses[i] == user) {
                grantedAddresses[i] = grantedAddresses[grantedAddresses.length - 1];
                grantedAddresses.pop();
                break;
            }
        }
        emit AccessRevoked(fileId, user);
    }

    function getMyFiles() external view returns (uint256[] memory) {
        return userFiles[msg.sender];
    }

    function getFile(uint256 fileId)
    external
    view
    fileExists(fileId)
    returns (
        string memory filename,
        string memory cid,
        uint256 createdAt,
        uint256 updatedAt,
        address owner,
        address[] memory grantedAddresses
    )
{
    File storage file = files[fileId];
    return (
        file.filename,
        file.cid,
        file.createdAt,
        file.updatedAt,
        file.owner,
        file.grantedAddresses
    );
}
}
