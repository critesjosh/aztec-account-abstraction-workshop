# Deploy the Counter contract

## Setup

1. Make sure the sandbox is running.
2. Install dependencies with `yarn`
3. Run with `yarn start`

This is a bit more complex than the Blank contract because this contract has state, and allows users to update state.

State is encrypted notes that are owned by accounts and can be decrypted with the account's public key.

These interactions are still not coming from an account contract. `msg_sender` is still the 0 address.

## Counter.nr

## index.ts
