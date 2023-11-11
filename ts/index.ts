import { CounterContract } from "../contracts/artifacts/Counter.js";
import {
  Fr,
  createPXEClient,
  generatePublicKey,
  GrumpkinScalar,
  SignerlessWallet,
  Note,
  AztecAddress,
  ExtendedNote,
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
    secret
  ).send({ contractAddressSalt: salt });
  const contract = await tx.deployed({
    debug: false,
  });
  const receipt = await tx.wait({ debug: false });
  // const receipt = await tx.getReceipt();

  console.log("deployed", receipt.debugInfo);

  const note = new Note([secret]);
  const extendedNote = new ExtendedNote(
    note,
    contract.address,
    contract.address,
    new Fr(1),
    receipt.txHash
  );
  console.log("adding note manually to pxe");
  await pxe.addNote(extendedNote);

  let constantSecret = await contract.methods.get_secret().view();
  console.log("secret from contract: ", constantSecret);

  let incrementReceipt = await contract.methods
    .increment(contract.address, secret)
    .send()
    .wait();

  let newCount = await contract.methods.get_counter(contract.address).view();

  console.log("new count", newCount);

  const ns = new Note([secret]);
  const nsen = new ExtendedNote(
    ns,
    contract.address,
    contract.address,
    new Fr(1),
    incrementReceipt.txHash
  );
  console.log("adding note manually to pxe");
  await pxe.addNote(nsen);

  // this fails with tx already exists?
  // need to program a nonce into the tx entrypoint to make a unique hash
  // await contract.methods.increment(contract.address, secret).send().wait();

  // newCount = await contract.methods
  //   .get_counter(someAddress)
  //   .view();
  // console.log("new count", newCount);

  // This will fail with incorrect secret provided
  // await contract.methods.increment(contract.address, Fr.random()).send().wait();

  const newSecret = Fr.random();

  const upstateSecretReceipt = await contract.methods
    .update_secret(secret, newSecret)
    .send()
    .wait({ debug: true });

  const newSecretNote = new Note([newSecret]);
  const newSecretExtendedNote = new ExtendedNote(
    newSecretNote,
    contract.address,
    contract.address,
    new Fr(1),
    upstateSecretReceipt.txHash
  );
  console.log("adding note manually to pxe");
  await pxe.addNote(newSecretExtendedNote);

  let newConstantSecret = await contract.methods.get_secret().view();

  console.log("New constant secret: ", newConstantSecret);

  let finalCount = await contract.methods.get_counter(contract.address).view();
  console.log("final count", finalCount);

  let randomCount = await contract.methods.get_counter(someAddress).view();
  console.log("random account count", randomCount);
}

main();
