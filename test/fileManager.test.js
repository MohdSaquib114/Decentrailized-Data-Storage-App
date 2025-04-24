const { expect } = require("chai");

describe("FileManager Contract", function () {
  let fileManager, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const FileManager = await ethers.getContractFactory("FileManager");
    fileManager = await FileManager.deploy();
    // await fileManager.deployed();
  });

  it("should allow file upload", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    const [fileCID, fileOwner] = await fileManager.getFile(0);
    expect(fileCID).to.equal(cid);
    expect(fileOwner).to.equal(owner.address);
  });

  it("should allow the owner to grant access", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await fileManager.connect(owner).grantAccess(0, user1.address);
    const canAccess = await fileManager.canAccess(0, user1.address);
    expect(canAccess).to.equal(true);
  });

  it("should allow the owner to revoke access", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await fileManager.connect(owner).grantAccess(0, user1.address);
    await fileManager.connect(owner).revokeAccess(0, user1.address);
    const canAccess = await fileManager.canAccess(0, user1.address);
    expect(canAccess).to.equal(false);
  });

  it("should revert if non-owner tries to grant access", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await expect(
      fileManager.connect(user1).grantAccess(0, user2.address)
    ).to.be.revertedWith("Not file owner");
  });

  it("should revert if non-owner tries to revoke access", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await expect(
      fileManager.connect(user1).revokeAccess(0, user2.address)
    ).to.be.revertedWith("Not file owner");
  });

  it("should allow access to file CID if granted", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await fileManager.connect(owner).grantAccess(0, user1.address);
    const fileCID = await fileManager.getFileCID(0, user1.address);
    expect(fileCID).to.equal(cid);
  });

  it("should revert if user tries to access file CID without access", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    await expect(
      fileManager.getFileCID(0, user1.address)
    ).to.be.revertedWith("Access denied");
  });

  it("should return the file owner", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    const fileOwner = await fileManager.getFileOwner(0);
    expect(fileOwner).to.equal(owner.address);
  });

  it("should return the user's uploaded files", async function () {
    const cid = "Qm...";
    await fileManager.connect(owner).uploadFile(cid);
    const files = await fileManager.getMyFiles();
    expect(files.length).to.equal(1);
    expect(files[0]).to.equal(0);
  });
});
