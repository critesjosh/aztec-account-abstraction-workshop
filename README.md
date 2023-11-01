# Deploy the Counter contract

## Setup

1. Make sure the sandbox is running.
2. Install dependencies with `yarn`
3. Run with `yarn start`

This is a bit more complex than the Blank contract because there are encrypted notes that are owned by a specific public key.

These interactions are still not coming from an account contract. `msg_sender` is still the 0 address.
