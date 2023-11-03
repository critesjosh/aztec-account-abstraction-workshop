# Aztec Account Abstraction Workshop

This branch uses the basic Blank contract and shows how to deploy and interact with it from a Signerless Wallet.

A Signerless wallet sends a raw TxExecutionRequest to the network. There is no validation on where this information is coming from. The `msg_sender` is 0x00.

The Signerless wallet exists on the PXE (Private execution environment), which runs client side, and communicates with the network.

## Blank.nr

This is a useless contract. It doesn't even have any state. But you can deploy it and interact with it and it is the most basic thing that does something.

You can see by the annotation `#[aztec(private)]` that it is a private function, meaning that the logic is executed in the PXE, client side. Only a proof, commitments and nullifiers are sent to the network.

Compile the Aztec contract in ``./contracts/blank/src/main.nr` by running:

```bash
yarn compile
```

This runs `aztec-cli` which generates the contract artifacts and the Typescript interface for the contract.

## index.ts

You must have the sandbox running to run the script. Run it with:

```bash
yarn start
```

It is getting the public key associated with the one of the pre loaded accounts in the PXE. If you modify the public key, you see an error.

## Modify the contract

We can modify the contract to start adding basic access control.

```rust
assert(context.msg_sender() == 0, "Only signerless wallets can call this function");
```
