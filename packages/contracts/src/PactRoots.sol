// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Ownable2Step } from "openzeppelin-contracts/contracts/access/Ownable2Step.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";
import { Pausable } from "openzeppelin-contracts/contracts/utils/Pausable.sol";

/// @title PactRoots
/// @notice Permissioned publication of PACT sparse Merkle roots (protocol v0.2 §9).
///         Does not compute scores, store leaves, or maintain a domain registry.
///         `verifyProof` is a pure helper matching v0.2 §3.3.1
///         (32-level keccak256 sparse Merkle, left-then-right parent hash).
contract PactRoots is Ownable2Step, Pausable {
    uint256 public constant TREE_DEPTH = 32;

    struct MerkleRoot {
        bytes32 root;
        uint256 timestamp;
        uint256 leafCount;
    }

    MerkleRoot[] public roots;

    event RootPublished(
        uint256 indexed id,
        bytes32 root,
        uint256 leafCount,
        uint256 timestamp
    );

    error ZeroRoot();
    error NoRoots();
    error LeafCountDecreased();

    constructor() Ownable(msg.sender) {}

    /// @notice Append an immutable root. Timestamp is `block.timestamp`.
    ///         Publisher is the owner (v0.2: PBM Labs LLC reference keys).
    function publishRoot(bytes32 root, uint256 leafCount)
        external
        onlyOwner
        whenNotPaused
    {
        if (root == bytes32(0)) revert ZeroRoot();
        if (roots.length > 0 && leafCount < roots[roots.length - 1].leafCount) {
            revert LeafCountDecreased();
        }

        uint256 timestamp = block.timestamp;
        roots.push(MerkleRoot({ root: root, timestamp: timestamp, leafCount: leafCount }));
        emit RootPublished(roots.length - 1, root, leafCount, timestamp);
    }

    /// @notice Reconstruct the §3.3.1 path. Returns false if `proof.length != 32`
    ///         or the path does not match `root`. Does not check that `root`
    ///         was published — callers MUST supply a root from `getLatestRoot`
    ///         or `roots(i)`.
    function verifyProof(
        bytes32 leaf,
        uint32 index,
        bytes32[] calldata proof,
        bytes32 root
    ) external pure returns (bool) {
        if (proof.length != TREE_DEPTH) return false;

        bytes32 current = leaf;
        uint32 idx = index;

        for (uint256 level; level < TREE_DEPTH;) {
            bytes32 sibling = proof[level];
            if (idx & 1 == 1) {
                current = keccak256(abi.encodePacked(sibling, current));
            } else {
                current = keccak256(abi.encodePacked(current, sibling));
            }
            idx >>= 1;
            unchecked {
                ++level;
            }
        }

        return current == root;
    }

    function getLatestRoot()
        external
        view
        returns (bytes32 root, uint256 leafCount, uint256 timestamp)
    {
        if (roots.length == 0) revert NoRoots();
        MerkleRoot storage latest = roots[roots.length - 1];
        return (latest.root, latest.leafCount, latest.timestamp);
    }

    function rootCount() external view returns (uint256) {
        return roots.length;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
