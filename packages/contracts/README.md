# PactRoots

Foundry package for the PACT Merkle-root contract (protocol spec §9).

- **Network (live):** Base Sepolia
- **Address:** [`0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee`](https://sepolia.basescan.org/address/0x873e76897BC3Fe8EBdfa67cb73404dA75B2d64ee)
- **Mainnet:** not deployed

`publishRoot` is permissioned (Ownable2Step). Roots attest inclusion; leaves stay off-chain.

```bash
forge test
```
