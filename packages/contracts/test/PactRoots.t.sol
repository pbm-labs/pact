// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { PactRoots } from "../src/PactRoots.sol";

contract PactRootsTest is Test {
    PactRoots roots;

    address alice = makeAddr("alice");

    bytes32 constant LEAF0 = 0xda88faf89b518eb4774583fa174f46d7714a1097c24c6bd5357a594d62eec21e;
    bytes32 constant LEAF1 = 0x350bb3dca2efdb96db44fe0ad0417cf25bfe6be8ef4c46499b2585bd7001b9f2;
    bytes32 constant LEAF2 = 0x10a9efebd232336dd0f7ce1952e6b764c03ab6fc7f81abd938fe95db2a31aaae;
    bytes32 constant CORE_ROOT = 0x6a6a3cc9413fbb5a631dcf08c0990b67401558764a4155c9233ccc0787beb1d2;

    function setUp() public {
        roots = new PactRoots();
    }

    function test_publishRoot_stores_and_getLatestRoot() public {
        vm.warp(1_700_000_000);
        vm.expectEmit(true, false, false, true);
        emit PactRoots.RootPublished(0, CORE_ROOT, 3, 1_700_000_000);

        roots.publishRoot(CORE_ROOT, 3);

        (bytes32 root, uint256 leafCount, uint256 timestamp) = roots.getLatestRoot();
        assertEq(root, CORE_ROOT);
        assertEq(leafCount, 3);
        assertEq(timestamp, 1_700_000_000);
        assertEq(roots.rootCount(), 1);
    }

    function test_publishRoot_appends_second_root() public {
        roots.publishRoot(CORE_ROOT, 3);
        bytes32 next = keccak256("next-root");
        roots.publishRoot(next, 8);

        (bytes32 root, uint256 leafCount,) = roots.getLatestRoot();
        assertEq(root, next);
        assertEq(leafCount, 8);
        assertEq(roots.rootCount(), 2);

        (bytes32 first,,) = roots.roots(0);
        assertEq(first, CORE_ROOT);
    }

    function test_revert_publishRoot_notOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        roots.publishRoot(CORE_ROOT, 3);
    }

    function test_revert_publishRoot_zeroRoot() public {
        vm.expectRevert(PactRoots.ZeroRoot.selector);
        roots.publishRoot(bytes32(0), 0);
    }

    function test_revert_publishRoot_leafCountDecreased() public {
        roots.publishRoot(CORE_ROOT, 3);
        vm.expectRevert(PactRoots.LeafCountDecreased.selector);
        roots.publishRoot(keccak256("smaller"), 2);
    }

    function test_publishRoot_same_leafCount_allowed() public {
        roots.publishRoot(CORE_ROOT, 3);
        roots.publishRoot(keccak256("same-count"), 3);
        assertEq(roots.rootCount(), 2);
    }

    function test_revert_getLatestRoot_when_empty() public {
        vm.expectRevert(PactRoots.NoRoots.selector);
        roots.getLatestRoot();
    }

    function test_pause_blocks_publish() public {
        roots.pause();
        vm.expectRevert();
        roots.publishRoot(CORE_ROOT, 3);

        roots.unpause();
        roots.publishRoot(CORE_ROOT, 3);
        assertEq(roots.rootCount(), 1);
    }

    function test_revert_pause_notOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        roots.pause();
    }

    function test_verifyProof_matches_pact_core_fixture() public {
        SparseTree tree = new SparseTree();
        tree.insert(LEAF0);
        tree.insert(LEAF1);
        tree.insert(LEAF2);

        assertEq(tree.root(), CORE_ROOT);

        for (uint32 i; i < 3; ++i) {
            bytes32 leaf = i == 0 ? LEAF0 : i == 1 ? LEAF1 : LEAF2;
            bytes32[] memory proof = tree.getProof(i);
            assertTrue(roots.verifyProof(leaf, i, proof, CORE_ROOT));
        }
    }

    function test_verifyProof_rejects_wrong_root() public {
        SparseTree tree = new SparseTree();
        tree.insert(LEAF0);
        bytes32[] memory proof = tree.getProof(0);
        assertFalse(roots.verifyProof(LEAF0, 0, proof, bytes32(uint256(1))));
    }

    function test_verifyProof_rejects_wrong_length() public view {
        bytes32[] memory proof = new bytes32[](31);
        assertFalse(roots.verifyProof(LEAF0, 0, proof, CORE_ROOT));
    }

    function test_verifyProof_rejects_wrong_index() public {
        SparseTree tree = new SparseTree();
        tree.insert(LEAF0);
        tree.insert(LEAF1);
        bytes32[] memory proof = tree.getProof(0);
        assertFalse(roots.verifyProof(LEAF0, 1, proof, tree.root()));
    }

    function testFuzz_verifyProof_random_leaves(bytes32 a, bytes32 b, bytes32 c) public {
        vm.assume(a != bytes32(0) && b != bytes32(0) && c != bytes32(0));
        vm.assume(a != b && b != c && a != c);

        SparseTree tree = new SparseTree();
        tree.insert(a);
        tree.insert(b);
        tree.insert(c);
        bytes32 root = tree.root();

        assertTrue(roots.verifyProof(a, 0, tree.getProof(0), root));
        assertTrue(roots.verifyProof(b, 1, tree.getProof(1), root));
        assertTrue(roots.verifyProof(c, 2, tree.getProof(2), root));
    }

    function test_ownership_transfer_is_two_step() public {
        roots.transferOwnership(alice);
        assertEq(roots.owner(), address(this));

        vm.prank(alice);
        roots.acceptOwnership();
        assertEq(roots.owner(), alice);
    }
}

/// @dev Mirrors packages/pact-core SparseMerkleTree (v0.2 §3.3.1).
contract SparseTree {
    uint256 internal constant DEPTH = 32;

    mapping(uint256 => mapping(uint256 => bytes32)) internal nodes;
    mapping(uint256 => mapping(uint256 => bool)) internal has;
    bytes32[33] internal zeros;
    uint32 public leafCount;
    bytes32 public root;

    constructor() {
        zeros[0] = bytes32(0);
        for (uint256 i = 1; i <= DEPTH; ++i) {
            zeros[i] = keccak256(abi.encodePacked(zeros[i - 1], zeros[i - 1]));
        }
        root = zeros[DEPTH];
    }

    function insert(bytes32 leafHash) external returns (uint32 index) {
        index = leafCount;
        bytes32 current = leafHash;
        uint32 idx = index;

        for (uint256 level; level < DEPTH; ++level) {
            nodes[level][idx] = current;
            has[level][idx] = true;
            uint32 siblingIdx = (idx & 1 == 1) ? idx - 1 : idx + 1;
            bytes32 sibling = _node(level, siblingIdx);
            current = (idx & 1 == 1)
                ? keccak256(abi.encodePacked(sibling, current))
                : keccak256(abi.encodePacked(current, sibling));
            idx >>= 1;
        }

        nodes[DEPTH][0] = current;
        has[DEPTH][0] = true;
        root = current;
        unchecked {
            ++leafCount;
        }
    }

    function getProof(uint32 leafIndex) external view returns (bytes32[] memory proof) {
        require(leafIndex < leafCount, "index");
        proof = new bytes32[](DEPTH);
        uint32 idx = leafIndex;
        for (uint256 level; level < DEPTH; ++level) {
            uint32 siblingIdx = (idx & 1 == 1) ? idx - 1 : idx + 1;
            proof[level] = _node(level, siblingIdx);
            idx >>= 1;
        }
    }

    function _node(uint256 level, uint256 index) internal view returns (bytes32) {
        if (has[level][index]) return nodes[level][index];
        return zeros[level];
    }
}
