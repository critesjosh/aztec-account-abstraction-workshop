contract Counter {

    /*
        Imports
    */
    use dep::aztec::protocol_types::address::AztecAddress;
    use dep::aztec::{
        context::{PrivateContext, Context},
        note::{
            note_header::NoteHeader,
            utils as note_utils,
        },
        state_vars::{
            map::Map,
            singleton::Singleton,
        },
        oracle::debug_log::{
            debug_log,
            debug_log_field,
            debug_log_format
        }
    };
    use dep::value_note::{
            balance_utils,
            value_note::{
                ValueNote,
                VALUE_NOTE_LEN,
            },
    };
    use dep::field_note::field_note::{FieldNote, FIELD_NOTE_LEN};
    use dep::easy_private_state::easy_private_state::EasyPrivateUint;
    use dep::std::option::Option;
    /*
        Storage declaration
    */
    struct Storage {
            // Whoever can produce this secret is able to 
            secret: Singleton<FieldNote>,
            counters: Map<AztecAddress, EasyPrivateUint>
        }
    #[aztec(private)]
        fn constructor(secret: Field) {
        let mut note = FieldNote::new(secret);
        storage.secret.initialize(&mut note, false);
    }
    #[aztec(private)]
        fn increment(owner: AztecAddress, secret: Field) {
        let secret_note = storage.secret.get_note(false);
        assert(secret_note.value == secret);
        let counters = storage.counters;
        counters.at(owner).add(1, owner);
    }
    #[aztec(private)]
        fn update_secret(secret: Field, new_secret: Field) {
        assert(storage.secret.get_note(false).value == secret);
        let mut note = FieldNote::new(new_secret);
        storage.secret.replace(&mut note, false);
        debug_log_format("secret: {0}, newSecret: {1}", [secret, new_secret]);
    }
    unconstrained fn get_secret() -> pub Field {
        let secret_note = storage.secret.view_note();
        debug_log_format("secret: {0}", [secret_note.value]);
        secret_note.value
    }
    unconstrained fn get_counter(owner: AztecAddress) -> pub Field {
        let counters = storage.counters;
        balance_utils::get_balance(counters.at(owner).set)
    }
    /*
            Required functions, only modified for custom note types
        */
    unconstrained fn compute_note_hash_and_nullifier(
        contract_address: AztecAddress,
        nonce: Field,
        storage_slot: Field,
        serialized_note: [Field; VALUE_NOTE_LEN]
    ) -> pub [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        if (storage_slot == storage.secret.get_storage_slot()) {
            note_utils::compute_note_hash_and_nullifier(FieldNote::deserialize_content, note_header, serialized_note)
        } else {
            note_utils::compute_note_hash_and_nullifier(ValueNote::deserialize_content, note_header, serialized_note)
        }
    }
}
