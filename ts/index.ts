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

  console.log("Deployment receipt: ", receipt);

  let interactionTx = await contract.methods
    .getPublicKey(
      BigInt(
        "0x16efad912187aa8ef0dcc6ef4f3743ab327b06465d4d229943f2fe3f88b06ad9"
      )
    )
    .send()
    .wait();

  console.log("Interaction tx:", interactionTx);
}

main();
