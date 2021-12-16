const yargs = require("yargs");
const { decrypt } = require("./utils");
const { readFileSync, writeFileSync } = require("fs");

/**
 * Main program
 */
async function main() {
    const argv = await yargs
        .option("file", {
            alias: "f",
            description: "Name of the file to be decrypted",
            type: "string",
        })
        .option("genesis", {
            alias: "g",
            description: "File containing the Genesis in hex string format (eg 0ad56bc348cd)",
            type: "string",
        })
        .demandOption(["file", "genesis"])
        .help()
        .alias("help", "h").argv;

    // Read the genesis file and generate the symmetric key
    const genesis = readFileSync(argv.genesis).toString();

    // Read the encrypted data
    const blob = readFileSync(argv.file);

    console.log(`* Decrypting file`);

    const { filename, decryptedData } = decrypt(genesis, blob);

    console.log(`* Saving result to ${filename}`);

    writeFileSync(filename, decryptedData);

    console.log("* Done!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
