// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserManager {
    mapping(address => bool) public registeredUsers;

    event UserRegistered(address indexed user);

    modifier onlyUnregistered() {
        require(!registeredUsers[msg.sender], "Already registered");
        _;
    }

    function registerUser() external onlyUnregistered {
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function isRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }
}
