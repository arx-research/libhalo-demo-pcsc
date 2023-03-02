const {NFC} = require('nfc-pcsc');
const {execHaloCmdPCSC} = require('@arx-research/libhalo');

const nfc = new NFC();

// list of HaLo commands that will be executed
// once the tag is detected by the reader
let commands = [
    {
        "name": "sign",
        "message": "010203",
        "keyNo": 1
    },
    {
        "name": "sign",
        "message": "05050505",
        "keyNo": 1
    }
];

nfc.on('reader', reader => {
    reader.autoProcessing = false;

    reader.on('card', card => {
        (async () => {
            // the card was detected, we can execute some HaLo commands
            // please note you can call execHaloCmdPCSC() multiple times
            // in order to execute multiple operations in a single tap

            for (let command of commands) {
                try {
                    let res = await execHaloCmdPCSC(command, reader);
                    // display the result
                    console.log(res);
                } catch (e) {
                    // display the error
                    console.error(e);
                }
            }
        })();
    });

    reader.on('error', err => {
        console.log(`${reader.reader.name} an error occurred`, err);
    });
});

nfc.on('error', err => {
    console.log('An error occurred', err);
});

console.log('Tap the tag...');
