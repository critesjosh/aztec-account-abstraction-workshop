import { CounterContract } from "../contracts/artifacts/Counter.js";
import {
  Fr,
  createPXEClient,
  generatePublicKey,
  GrumpkinScalar,
  SignerlessWallet,
} from "@aztec/aztec.js";

async function main() {
  const salt = Fr.random();
  const encryptionKey = GrumpkinScalar.random();
  const publicKey = await generatePublicKey(encryptionKey);

  const pxe = createPXEClient("http://localhost:8080");
  const nonContractAccountWallet = new SignerlessWallet(pxe);

  const headstart = 2n;

  const completeAddress = await pxe.registerAccount(encryptionKey, Fr.ZERO);
  console.log("completeAddress", completeAddress);

  const tx = await CounterContract.deployWithPublicKey(
    publicKey,
    nonContractAccountWallet,
    headstart,
    completeAddress.address
  ).send({ contractAddressSalt: salt });
  const contract = await tx.deployed();
  const receipt = await tx.getReceipt();

  console.log("deployed");

  let count = await contract.methods
    .get_counter(completeAddress.address)
    .view();

  console.log("count", count);

  await contract.methods.increment(completeAddress.address).send().wait();

  let newCount = await contract.methods
    .get_counter(completeAddress.address)
    .view();

  console.log("new count", newCount);
}

main();
