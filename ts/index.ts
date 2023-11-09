import { CounterContract } from "../contracts/artifacts/Counter.js";
import {
  Fr,
  createPXEClient,
  generatePublicKey,
  GrumpkinScalar,
  SignerlessWallet,
  CompleteAddress,
  computeMessageSecretHash,
  Note,
  AztecAddress,
  ExtendedNote,
  getSchnorrAccount,
  getUnsafeSchnorrWallet,
  getContractDeploymentInfo,
} from "@aztec/aztec.js";

async function main() {
  const salt = Fr.random();
  const encryptionKey = GrumpkinScalar.random();
  const publicKey = await generatePublicKey(encryptionKey);

  const pxe = createPXEClient("http://localhost:8080");
  const nonContractAccountWallet = new SignerlessWallet(pxe);

  const secret = Fr.random();
  const deploymentInfo = await getContractDeploymentInfo(
    CounterContract.artifact,
    [secret],
    salt,
    publicKey
  );

  await pxe.registerAccount(
    encryptionKey,
    deploymentInfo.completeAddress.partialAddress
  );

  const zeroAddress = Buffer.from(new Uint8Array(32).fill(0));
  const someAddress = AztecAddress.random();

  const tx = await CounterContract.deployWithPublicKey(
    publicKey,
    nonContractAccountWallet,
    secret,
  ).send({ contractAddressSalt: salt });
  const contract = await tx.deployed({
    debug: true
  });
  const receipt = await tx.wait({ debug: true });
  // const receipt = await tx.getReceipt();

  console.log("deployed", receipt.debugInfo);

  if (contract.address) {
    // const secretHash = await computeMessageSecretHash(secret);
    const note = new Note([secret]);
    const extendedNote = new ExtendedNote(note, contract.address, contract.address, new Fr(1), receipt.txHash);
    console.log("adding note manually to pxe");
    await pxe.addNote(extendedNote);
  }

  let constant = await contract.methods
    .get_constant()
    .view();
  console.log("constant", constant);

  await contract.methods.increment(contract.address, secret).send().wait();

  let newCount = await contract.methods
    .get_counter(contract.address)
    .view();

  console.log("new count", newCount);

  // this fails with tx already exists?
  // await contract.methods.increment(contract.address, secret).send().wait();

  // newCount = await contract.methods
  //   .get_counter(someAddress)
  //   .view();
  // console.log("new count", newCount);

  await contract.methods.increment(contract.address, Fr.random()).send().wait();

  newCount = await contract.methods
    .get_counter(someAddress)
    .view();
  console.log("new count", newCount);
}

main();
