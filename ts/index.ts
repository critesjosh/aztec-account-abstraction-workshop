import { CounterContract } from "../contracts/artifacts/Counter.js";
import {
  Fr,
  createPXEClient,
  generatePublicKey,
  GrumpkinScalar,
  SignerlessWallet,
  CompleteAddress,
} from "@aztec/aztec.js";

async function main() {
  /*

  Setup

  */
  const encryptionKey = GrumpkinScalar.random();
  const publicKey = await generatePublicKey(encryptionKey);

  const pxe = createPXEClient("http://localhost:8080");
  const nonContractAccountWallet = new SignerlessWallet(pxe);

  const headstart = 2n;

  // Register the account with the PXE, so the PXE can decrypt its notes
  const completeAddress = await pxe.registerAccount(encryptionKey, Fr.ZERO);
  console.log("completeAddress", completeAddress);

  /*

  Deploy the Counter from the Signerless wallet

  */

  const salt = Fr.random();
  const tx = await CounterContract.deployWithPublicKey(
    publicKey,
    nonContractAccountWallet,
    headstart,
    completeAddress.address
  ).send({ contractAddressSalt: salt });
  const contract = await tx.deployed();
  const receipt = await tx.getReceipt();

  console.log("deployed");

  /*

    Read the counter value

  */

  let count = await contract.methods
    .get_counter(completeAddress.address)
    .view();

  console.log("count", count);

  /*

    Increment the counter for the registered account

  */

  let incrementRx = await contract.methods
    .increment(completeAddress.address)
    .send()
    .wait();

  console.log("increment receipt", incrementRx);

  // This call will fail because the PXE does not have a registered public key
  // for the account to create encrypted notes for it.
  // const randomAddress = await CompleteAddress.random();
  // await contract.methods.increment(randomAddress.address).send().wait();

  /*

    Read the new count
  
  */

  let newCount = await contract.methods
    .get_counter(completeAddress.address)
    .view();

  console.log("new count", newCount);
}

main();
