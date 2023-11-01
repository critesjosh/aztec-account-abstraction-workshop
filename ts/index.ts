import { BlankContract } from "../contracts/artifacts/Blank.js";
import { Fr, createPXEClient, SignerlessWallet } from "@aztec/aztec.js";

async function main() {
  const salt = Fr.random();

  const pxe = createPXEClient("http://localhost:8080");
  const nonContractAccountWallet = new SignerlessWallet(pxe);

  const tx = await BlankContract.deploy(nonContractAccountWallet).send({
    contractAddressSalt: salt,
  });
  const contract = await tx.deployed();
  const receipt = await tx.getReceipt();

  console.log(receipt);

  let interactionTx = await contract.methods
    .getPublicKey(
      BigInt(
        "0x15701f0b6cf4d273aa0b4ecf2abbb028c1c0286ba7309a2f20b253f297e1908e"
      )
    )
    .send()
    .wait();

  console.log("interaction tx", interactionTx);
}

main();
