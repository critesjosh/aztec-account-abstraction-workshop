contract Blank {
    use dep::aztec::{
        abi,
        oracle::{
            get_public_key::get_public_key,
        },
    };

    #[aztec(private)]
    fn constructor() {}

    // Anyone can call this function to get the public key of the specified address, provided it 
    // is available from the PXE via the oracle call
    #[aztec(private)]
    fn getPublicKey(
        address: Field,
    ) -> pub [Field; 2]{
        // Uncomment this function to make this function only callable by signerless wallets (no aztec contracts)
        assert(context.msg_sender() == 0, "Only signerless wallets can call this function");
        let pub_key = get_public_key(address);
        
        [pub_key.x, pub_key.y]
    }
}