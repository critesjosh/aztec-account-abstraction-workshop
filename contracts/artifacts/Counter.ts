
/* Autogenerated file, do not edit! */

/* eslint-disable */
import {
  AztecAddress,
  AztecAddressLike,
  CompleteAddress,
  Contract,
  ContractArtifact,
  ContractBase,
  ContractFunctionInteraction,
  ContractMethod,
  DeployMethod,
  EthAddress,
  EthAddressLike,
  FieldLike,
  Fr,
  Point,
  PublicKey,
  Wallet,
} from '@aztec/aztec.js';
import CounterContractArtifactJson from './Counter.json' assert { type: 'json' };
export const CounterContractArtifact = CounterContractArtifactJson as ContractArtifact;

/**
 * Type-safe interface for contract Counter;
 */
export class CounterContract extends ContractBase {
  
  private constructor(
    completeAddress: CompleteAddress,
    wallet: Wallet,
    portalContract = EthAddress.ZERO
  ) {
    super(completeAddress, CounterContractArtifact, wallet, portalContract);
  }
  

  
  /**
   * Creates a contract instance.
   * @param address - The deployed contract's address.
   * @param wallet - The wallet to use when interacting with the contract.
   * @returns A promise that resolves to a new Contract instance.
   */
  public static async at(
    address: AztecAddress,
    wallet: Wallet,
  ) {
    return Contract.at(address, CounterContract.artifact, wallet) as Promise<CounterContract>;
  }

  
  /**
   * Creates a tx to deploy a new instance of this contract.
   */
  public static deploy(wallet: Wallet, secret: FieldLike) {
    return new DeployMethod<CounterContract>(Point.ZERO, wallet, CounterContractArtifact, Array.from(arguments).slice(1));
  }

  /**
   * Creates a tx to deploy a new instance of this contract using the specified public key to derive the address.
   */
  public static deployWithPublicKey(publicKey: PublicKey, wallet: Wallet, secret: FieldLike) {
    return new DeployMethod<CounterContract>(publicKey, wallet, CounterContractArtifact, Array.from(arguments).slice(2));
  }
  

  
  /**
   * Returns this contract's artifact.
   */
  public static get artifact(): ContractArtifact {
    return CounterContractArtifact;
  }
  

  /** Type-safe wrappers for the public methods exposed by the contract. */
  public methods!: {
    
    /** compute_note_hash_and_nullifier(contract_address: field, nonce: field, storage_slot: field, preimage: array) */
    compute_note_hash_and_nullifier: ((contract_address: FieldLike, nonce: FieldLike, storage_slot: FieldLike, preimage: FieldLike[]) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** get_counter(owner: field) */
    get_counter: ((owner: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** get_secret() */
    get_secret: (() => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** increment(owner: field, secret: field) */
    increment: ((owner: FieldLike, secret: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;

    /** update_secret(secret: field, new_secret: field) */
    update_secret: ((secret: FieldLike, new_secret: FieldLike) => ContractFunctionInteraction) & Pick<ContractMethod, 'selector'>;
  };
}
