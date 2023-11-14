# Deploy the Counter contract

## Setup

1. Make sure the sandbox is running.
2. Install dependencies with `yarn`
3. Run with `yarn start`

This is a bit more complex than the Blank contract because this contract has state, and allows users to update state.

State is encrypted notes that are owned by accounts and can be decrypted with the account's public key.

These interactions are still not coming from an account contract. `msg_sender` is still the 0 address.

## Counter.nr

### Imports

#### [Aztec core](https://github.com/AztecProtocol/aztec-nr/tree/master/aztec)

- Context
- Note header and utils
- Mapping

#### [Value notes](https://github.com/AztecProtocol/aztec-nr/tree/master/value-note)

- balance utils
- ValueNote methods

#### [Easy private state](https://github.com/AztecProtocol/aztec-nr/tree/master/easy-private-state)

- utilities for managing values
- this library assumes the input is an Aztec Address (for managing encrypted state)

### Storage

- Counters
  - mapping of number (address), to number

### Functions

All functions in the contract are private, meaning they execute client side.

#### Constructor

Allows the deployer to give a certain note owner a headstart.

#### Increment

Adds 1 to the provided number. This function updates private state by adding a ValueNote to the account's Set.

A Set is an unbounded number of private notes. The total value of the Set is the sum of all of the notes in the Set (in the case of ValueNotes).

#### Get count

This is an unconstrained function, similar to a `view` function in Solidity. It does not send a transaction to the network, merely reads the value from the local state. The PXE decrypts the state and returns it.

The `get_balance` function sums the values of all of the included notes.

## index.ts

1. Setup PXE
2. Register the encryption key for the new account with the PXE
3. Deploy the Counter contract from the signerless wallet
4. Read the deployed contract state
5. Increment the count in the contract, from the registered account
6. Read the new count
