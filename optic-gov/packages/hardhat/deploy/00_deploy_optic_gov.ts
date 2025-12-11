import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployOpticGov: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, getChainId } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    let oracleAddress: string;

    if (chainId === "31337") { 
        // Hardhat Local Dev Chain: Setting the Oracle Address to Account #4
        // The Deployer (from: deployer) is Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // The Oracle is Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
        oracleAddress = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"; 
        console.log(`[Local Dev] Oracle Address set to: ${oracleAddress}`);
    } else {
        // Sepolia (Testnet) -> The production path
        // For Sepolia, the Deployer and Oracle MUST be different funded accounts.
        // We temporarily default the Oracle to the Deployer address ('deployer') 
        // but you MUST update this to a separate, funded account for real testing.
        oracleAddress = process.env.ORACLE_WALLET_ADDRESS || deployer; 
        console.warn(`[${chainId}] WARNING: Oracle Address defaulted to Deployer: ${oracleAddress}. Update ORACLE_WALLET_ADDRESS in .env.`);
    }

    await deploy("OpticGov", {
        from: deployer,
        // The constructor argument for OpticGov(address _oracleAddress)
        args: [oracleAddress], 
        log: true, 
        waitConfirmations: 5, 
    });
};

export default deployOpticGov;
deployOpticGov.tags = ["OpticGov"];