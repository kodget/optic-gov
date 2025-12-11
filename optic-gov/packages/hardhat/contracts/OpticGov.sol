// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OpticGov {
    // --- Custom Errors (Gas efficient and best practice) ---
    error Unauthorized(address caller);
    error InvalidLength();
    error InvalidAmount();
    error InvalidMilestone(uint256 projectId, uint256 milestoneIndex);
    error AlreadyCompleted();
    error TransferFailed();
    error OnlyContractor(address contractor);

    // --- 1. STATE VARIABLES & STRUCTS ---

    address public immutable oracleAddress;
    address public immutable funder; 

    struct Milestone {
        string description;
        uint256 amount; 
        bool isCompleted;
        bool isReleased;
        string evidenceIpfsHash; 
    }

    struct Project {
        address contractor;
        uint256 totalBudget;
        uint256 fundsReleased;
        uint256 milestoneCount;
        Milestone[] milestones;
    }

    uint256 public nextProjectId; 
    mapping(uint256 => Project) public projects;

    // --- 2. MODIFIERS & EVENTS ---

    modifier onlyOracle() {
        if (msg.sender != oracleAddress) {
            revert Unauthorized(msg.sender); // Using custom error
        }
        _;
    }

    modifier onlyFunder() {
        if (msg.sender != funder) {
            revert Unauthorized(msg.sender);
        }
        _;
    }
    
    event ProjectCreated(uint256 indexed projectId, address indexed contractor, uint256 budget);
    event MilestoneReleased(uint256 indexed projectId, uint256 indexed milestoneIndex, uint256 amount);
    event EvidenceSubmitted(uint256 indexed projectId, uint256 indexed milestoneIndex, string ipfsHash);


    // --- 3. CONSTRUCTOR ---

    constructor(address _oracleAddress) payable {
        oracleAddress = _oracleAddress;
        funder = msg.sender;
    }


    // --- 4. FUNDER FUNCTION (Create Project) ---

    function createProject(
        address _contractor,
        uint256[] memory _milestoneAmounts,
        string[] memory _milestoneDescriptions
    ) external onlyFunder payable returns (uint256) {
        if (_milestoneAmounts.length != _milestoneDescriptions.length) {
            revert InvalidLength();
        }
        
        uint256 totalProjectCost;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            totalProjectCost += _milestoneAmounts[i];
        }

        if (msg.value != totalProjectCost) {
            revert InvalidAmount();
        }

        Project storage newProject = projects[nextProjectId];
        newProject.contractor = _contractor;
        newProject.totalBudget = totalProjectCost;
        newProject.milestoneCount = _milestoneAmounts.length;
        
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            newProject.milestones.push(Milestone({
                description: _milestoneDescriptions[i],
                amount: _milestoneAmounts[i],
                isCompleted: false,
                isReleased: false,
                evidenceIpfsHash: ""
            }));
        }

        emit ProjectCreated(nextProjectId, _contractor, totalProjectCost);
        return nextProjectId++;
    }


    // --- 5. CONTRACTOR FUNCTION (Submit Evidence) ---

    function submitEvidence(
        uint256 _projectId, 
        uint256 _milestoneIndex, 
        string memory _ipfsHash
    ) external {
        Project storage project = projects[_projectId];
        if (msg.sender != project.contractor) {
            revert OnlyContractor(project.contractor);
        }
        if (_milestoneIndex >= project.milestoneCount) {
            revert InvalidMilestone(_projectId, _milestoneIndex);
        }
        if (project.milestones[_milestoneIndex].isCompleted) {
            revert AlreadyCompleted();
        }

        project.milestones[_milestoneIndex].evidenceIpfsHash = _ipfsHash;
        
        emit EvidenceSubmitted(_projectId, _milestoneIndex, _ipfsHash);
    }


    // --- 6. ORACLE FUNCTION (The Pay Function) ---

    function releaseMilestone(
        uint256 _projectId, 
        uint256 _milestoneIndex, 
        bool _verdict
    ) external onlyOracle {
        Project storage project = projects[_projectId];
        Milestone storage milestone = project.milestones[_milestoneIndex];

        if (_milestoneIndex >= project.milestoneCount) {
            revert InvalidMilestone(_projectId, _milestoneIndex);
        }
        if (milestone.isCompleted) {
            revert AlreadyCompleted();
        }
        
        if (_verdict == true) {
            milestone.isCompleted = true;
            milestone.isReleased = true; 
            project.fundsReleased += milestone.amount;

            (bool success, ) = payable(project.contractor).call{value: milestone.amount}("");
            if (!success) {
                revert TransferFailed();
            }
            
            emit MilestoneReleased(_projectId, _milestoneIndex, milestone.amount);
        }
    }

    receive() external payable {}
}