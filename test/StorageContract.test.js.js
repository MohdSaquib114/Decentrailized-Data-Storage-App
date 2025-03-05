const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StorageContract", function () {
    let StorageContract, contract, owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        StorageContract = await ethers.getContractFactory("StorageContract");
        contract = await StorageContract.deploy();
        await contract.waitForDeployment();
    });

    it("should upload a file", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");

        const file = await contract.getFile("Qm12345EXAMPLE");
        expect(file[0]).to.equal("Qm12345EXAMPLE");
        expect(file[1]).to.equal(owner.address);
    });

    it("should allow owner to grant access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await contract.connect(owner).grantAccess("Qm12345EXAMPLE", user1.address);
        const hasAccess = await contract.hasAccess("Qm12345EXAMPLE", user1.address);
        expect(hasAccess).to.be.true;
    });

    it("should prevent non-owners from granting access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await expect(contract.connect(user1).grantAccess("Qm12345EXAMPLE", user2.address))
            .to.be.revertedWith("Not the owner");
    });

    it("should allow owner to revoke access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await contract.connect(owner).grantAccess("Qm12345EXAMPLE", user1.address);
        await contract.connect(owner).revokeAccess("Qm12345EXAMPLE", user1.address);
        const hasAccess = await contract.hasAccess("Qm12345EXAMPLE", user1.address);
        expect(hasAccess).to.be.false;
    });

    it("should prevent non-owners from revoking access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await contract.connect(owner).grantAccess("Qm12345EXAMPLE", user1.address);
        await expect(contract.connect(user1).revokeAccess("Qm12345EXAMPLE", user2.address))
            .to.be.revertedWith("Not the owner");
    });

    it("should track file access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await contract.connect(owner).grantAccess("Qm12345EXAMPLE", user1.address);

        await contract.connect(user1).trackFileAccess("Qm12345EXAMPLE", user1.address);
        await contract.connect(owner).trackFileAccess("Qm12345EXAMPLE", owner.address);

        const [users, timestamps] = await contract.getAccessHistory("Qm12345EXAMPLE");
        expect(users).to.deep.equal([user1.address, owner.address]);
        expect(timestamps.length).to.equal(2);
    });

    it("should prevent unauthorized users from tracking file access", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await expect(contract.connect(user1).trackFileAccess("Qm12345EXAMPLE", user1.address))
            .to.be.revertedWith("Access denied");
    });

    it("should prevent unauthorized users from viewing access history", async function () {
        await contract.connect(owner).uploadFile("Qm12345EXAMPLE");
        await expect(contract.connect(user1).getAccessHistory("Qm12345EXAMPLE"))
            .to.be.revertedWith("Not the owner");
    });
});
