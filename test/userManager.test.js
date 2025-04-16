const { expect } = require("chai");

describe("UserManager Contract", function () {
  let userManager, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const UserManager = await ethers.getContractFactory("UserManager");
    userManager = await UserManager.deploy(); // Automatically deployed here
  });

  it("should allow a user to register", async function () {
    await userManager.connect(owner).registerUser();

    const isRegistered = await userManager.isRegistered(owner.address);
    expect(isRegistered).to.equal(true);
  });

  it("should revert if user tries to register again", async function () {
    await userManager.connect(owner).registerUser();

    await expect(userManager.connect(owner).registerUser()).to.be.revertedWith("Already registered");
  });

  it("should return true if the user is registered", async function () {
    await userManager.connect(owner).registerUser();

    const isRegistered = await userManager.isRegistered(owner.address);
    expect(isRegistered).to.equal(true);
  });

  it("should return false if the user is not registered", async function () {
    const isRegistered = await userManager.isRegistered(owner.address);
    expect(isRegistered).to.equal(false);
  });
});
