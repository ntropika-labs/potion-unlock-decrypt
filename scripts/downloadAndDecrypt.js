const yargs = require("yargs");
const { download, decrypt } = require("./utils");
const { readFileSync, writeFileSync } = require("fs");

/**
 * Main program
 */
async function main() {
    const argv = await yargs
        .option("url", {
            alias: "u",
            description: "URL of the encrypted file to be decrypted",
            type: "string",
        })
        .option("genesis", {
            alias: "g",
            description: "File containing the Genesis in hex string format (eg 0ad56bc348cd)",
            type: "string",
        })
        .demandOption(["url", "genesis"])
        .help()
        .alias("help", "h").argv;

    // Read the genesis file and generate the symmetric key
    const genesis = readFileSync(argv.genesis).toString();

    // Read the encrypted data
    const blob = await download(argv.url);

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
