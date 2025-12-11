// packages/hardhat/test/OpticGov.test.ts

import { expect } from "chai";
import { ethers } from "hardhat";
import { OpticGov } from "../typechain-types"; 

describe("OpticGov", function () {
    let opticGov: OpticGov;
    let deployer: any;
    let funder: any; // We still need this account, even if deployer acts as funder
    let oracle: any;
    let unauthorized: any;
    let contractorAddress: string;

    const ORACLE_ADDRESS = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"; 

    async function deployOpticGovFixture() {
        const [deployer, funder, unauthorized, , oracle] = await ethers.getSigners();
        const OpticGovFactory = await ethers.getContractFactory("OpticGov");
        const deployedContract = await OpticGovFactory.deploy(oracle.address);
        
        return { deployedContract, deployer, funder, oracle, unauthorized };
    }

    beforeEach(async function () {
        const { deployedContract, deployer: d, funder: f, oracle: o, unauthorized: u } = await deployOpticGovFixture();
        opticGov = deployedContract;
        deployer = d;
        funder = f;
        oracle = o;
        unauthorized = u;
        contractorAddress = unauthorized.address; 
        
        // FIX 1: Funder/Governor is the Deployer (Account #0) in this test setup
        await opticGov.connect(deployer).createProject( // <--- CORRECTED CALLER HERE
            contractorAddress, 
            [ethers.parseEther("0.5"), ethers.parseEther("0.5")], 
            ["Milestone 1 Description", "Milestone 2 Description"],
            { value: ethers.parseEther("1") } 
        );
    });

    describe("Deployment", function () {
        it("Should set the correct oracle address", async function () {
            expect(await opticGov.oracleAddress()).to.equal(oracle.address);
        });
        
        it("Should set the correct funder address (the deployer)", async function () {
            expect(await opticGov.funder()).to.equal(deployer.address);
        });
    });

    describe("Access Control: onlyOracle", function () {
        const PROJECT_ID = 0;
        const MILESTONE_ID = 0; 

        it("Should allow the designated oracle to release a milestone", async function () {
            // Check that the contractor's balance increases after payment
            await expect(() => 
                opticGov.connect(oracle).releaseMilestone(PROJECT_ID, MILESTONE_ID, true)
            ).to.changeEtherBalance(unauthorized, ethers.parseEther("0.5")); 
        });

        it("Should revert if an unauthorized account tries to release a milestone", async function () {
            await expect(
                opticGov.connect(unauthorized).releaseMilestone(PROJECT_ID, MILESTONE_ID, true)
            ).to.be.revertedWithCustomError(opticGov, "Unauthorized");
        });
        
        it("Should revert if the contract deployer tries to release a milestone", async function () {
            await expect(
                opticGov.connect(deployer).releaseMilestone(PROJECT_ID, MILESTONE_ID, true)
            ).to.be.revertedWithCustomError(opticGov, "Unauthorized");
        });
    });

    describe("Project State Management", function () {
        const PROJECT_ID = 0;
        const MILESTONE_ID = 0; 
        const IPFS_HASH = "QmTestHash12345";
        
        it("Should prevent releasing an already completed milestone", async function () {
            await opticGov.connect(oracle).releaseMilestone(PROJECT_ID, MILESTONE_ID, true);

            await expect(
                opticGov.connect(oracle).releaseMilestone(PROJECT_ID, MILESTONE_ID, true)
            ).to.be.revertedWithCustomError(opticGov, "AlreadyCompleted");
        });
        
        // FIX 2: Check for event emission instead of direct nested struct access
        it("Should emit EvidenceSubmitted event upon submission", async function () {
            await expect(opticGov.connect(unauthorized).submitEvidence(PROJECT_ID, MILESTONE_ID, IPFS_HASH))
                .to.emit(opticGov, "EvidenceSubmitted")
                .withArgs(PROJECT_ID, MILESTONE_ID, IPFS_HASH);
        });
    });
});