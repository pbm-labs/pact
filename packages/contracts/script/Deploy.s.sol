// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console } from "forge-std/Script.sol";
import { VmSafe } from "forge-std/Vm.sol";
import { PactRoots } from "../src/PactRoots.sol";

/// @notice Deploys PactRoots (v0.2 §9). Owner is the broadcasting address.
///
/// Dry run (no on-chain tx):
///   forge script script/Deploy.s.sol --rpc-url base_sepolia -vvvv
///
/// Broadcast to Base Sepolia (Foundry keystore — no private key in .env):
///   forge script script/Deploy.s.sol \
///     --rpc-url base_sepolia \
///     --account <keystore-name> \
///     --broadcast \
///     --verify \
///     -vvvv
///
/// Writes ./deployments/<network>.json only when --broadcast is set.
/// NETWORK defaults to base_sepolia.
contract DeployPactRoots is Script {
    function run() external {
        string memory network = vm.envOr("NETWORK", string("base_sepolia"));

        vm.startBroadcast();
        PactRoots pactRoots = new PactRoots();
        vm.stopBroadcast();

        console.log("PactRoots:", address(pactRoots));
        console.log("Owner:    ", pactRoots.owner());

        if (!vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            console.log("Dry run - not writing deployments JSON");
            return;
        }

        string memory obj = "pact_roots_deployment";
        vm.serializeAddress(obj, "PactRoots", address(pactRoots));
        string memory json = vm.serializeAddress(obj, "owner", pactRoots.owner());

        string memory outPath = string.concat("./deployments/", network, ".json");
        vm.writeJson(json, outPath);
        console.log("Addresses written to", outPath);
    }
}
