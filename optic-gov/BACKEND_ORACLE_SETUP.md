
# 📄 BACKEND ORACLE SETUP & HANDOFF DOCUMENTATION

**To:** Backend/AI Developer Team
**From:** Blockchain Developer Team
**Version:** 1.0 (Hackathon Final)

This document provides all necessary secrets, endpoints, and the contract address for the Python AI Oracle service to connect to the Sepolia Test Network and interact with the `OpticGov` smart contract.

-----

## 1\. ⚙️ Environment Variables (`.env` File)

The Python service **must** load the following three variables into its local environment (ideally via a `.env` file) to function.

| Variable Name | Value (Secret Key) | Purpose |
| :--- | :--- | :--- |
| `ORACLE_PRIVATE_KEY` | **`0x[Your Wallet B Private Key]`** | Used to sign the `releaseMilestone` transaction on-chain. **DO NOT EXPOSE THIS.** |
| `SEPOLIA_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/[Your Sepolia Key]` | Provides the connection point (`web3.py`) to the Sepolia Test Network. |
| `IPFS_PINATA_API_KEY` | `[Your Pinata API Key]` | Required by the frontend/backend to securely upload video evidence to IPFS. |

-----

## 2\. 🔗 Contract Address & ABI Handover

The Python script needs two pieces of contract information to successfully instantiate the contract object:

### A. Contract Address

The permanent address of the deployed `OpticGov` contract on the Sepolia network.

  * **Contract Address:**
    `[PASTE YOUR FINAL SEPOLIA CONTRACT ADDRESS HERE]`

### B. Contract ABI

The Application Binary Interface (ABI) is required by `web3.py` to know how to construct function calls.

  * **ABI Location:** You can find the full ABI array within the compiled artifact file:
    `packages/hardhat/artifacts/contracts/OpticGov.sol/OpticGov.json`

-----

## 3\. 🎯 Oracle Workflow and Key Usage

The AI Oracle (your Python script) uses the keys and address in a specific, crucial workflow:

1.  **Event Listening:** The script monitors the Sepolia network for the `EvidenceSubmitted` event emitted by the contract at the address provided in Section 2.A.
2.  **AI Analysis:** When an event is detected, the script extracts the `evidenceIpfsHash` and the `milestoneDescription` and sends them to Gemini 2.5 Flash for the verdict (`true` or `false`).
3.  **Transaction Signing (Key Usage):**
      * If the verdict is `true`, the script constructs a call to the `releaseMilestone(projectId, milestoneIndex, true)` function.
      * This transaction **must** be signed using the **`ORACLE_PRIVATE_KEY`** (Wallet B).
      * The blockchain validates the transaction against the contract's `onlyOracle` modifier, confirming the sender's address matches the stored `oracleAddress`.
4.  **Broadcast:** The signed transaction is sent to the Sepolia network via the `SEPOLIA_RPC_URL`.

## 4\. 📝 `web3.py` Pseudo-Code Example

This example shows the backend developer exactly how the key is used to sign and send the transaction.

```python
# Pseudo-code for web3.py transaction signing

from web3 import Web3, Account
import os

# 1. Setup Connection and Key
w3 = Web3(Web3.HTTPProvider(os.environ.get('SEPOLIA_RPC_URL')))
oracle_key = os.environ.get('ORACLE_PRIVATE_KEY')
oracle_account = Account.from_key(oracle_key) # This loads the signing key!

# 2. Instantiate Contract (ABI and Address loaded from file)
ContractAddress = "[YOUR SEPOLIA ADDRESS HERE]"
abi = [...] # Load the ABI JSON
contract = w3.eth.contract(address=ContractAddress, abi=abi)

# 3. Build Transaction
txn = contract.functions.releaseMilestone(
    projectId, 
    milestoneIndex, 
    True # AI verdict is True
).build_transaction({
    'from': oracle_account.address,
    'nonce': w3.eth.get_transaction_count(oracle_account.address),
    'gas': 500000, 
    'gasPrice': w3.eth.gas_price,
})

# 4. Sign and Send Transaction (using the ORACLE_PRIVATE_KEY)
signed_txn = oracle_account.sign_transaction(txn)
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

print(f"Milestone release transaction sent: {tx_hash.hex()}")
```