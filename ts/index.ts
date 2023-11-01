import {
  CounterContractArtifact,
  CounterContract,
} from "../contracts/artifacts/Counter.js";
import {
  Fr,
  createPXEClient,
  generatePublicKey,
  GrumpkinScalar,
  SignerlessWallet,
  computeMessageSecretHash,
  Note,
  ExtendedNote,
} from "@aztec/aztec.js";
import { getContractDeploymentInfo } from "@aztec/circuits.js";

async function main() {
  const secret = new Fr(100);
  const salt = Fr.random();
  const encryptionKey = GrumpkinScalar.random();
  const publicKey = await generatePublicKey(encryptionKey);

  const pxe = createPXEClient("http://localhost:8080");
  const nonContractAccountWallet = new SignerlessWallet(pxe);

  const deploymentInfo = await getContractDeploymentInfo(
    CounterContractArtifact,
    [secret],
    salt,
    publicKey
  );

  await pxe.registerAccount(
    encryptionKey,
    deploymentInfo.completeAddress.partialAddress
  );

  const zeroAddress = Buffer.from(new Uint8Array(32).fill(0));

  const tx = await CounterContract.deployWithPublicKey(
    publicKey,
    nonContractAccountWallet,
    1n,
    zeroAddress
  ).send({ contractAddressSalt: salt });
  const contract = await tx.deployed();
  const receipt = await tx.getReceipt();

  console.log("deployed");

  if (contract.address) {
    // const secretHash = await computeMessageSecretHash(secret);
    // const note = new Note([secretHash]);
    // const extendedNote = new ExtendedNote(note, contract.address, contract.address, new Fr(1), receipt.txHash);
    // await pxe.addNote(extendedNote);
    return contract.address;
  }
}

main();
