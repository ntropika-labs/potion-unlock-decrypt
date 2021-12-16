const yargs = require("yargs");
const { download } = require("./utils");
const { writeFileSync } = require("fs");

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
        .option("output", {
            alias: "o",
            description: "Output file name to save the downloaded data to",
            type: "string",
        })
        .demandOption(["url", "output"])
        .help()
        .alias("help", "h").argv;

    console.log(`* Downloading from ${argv.url}`);

    const data = await download(argv.url);

    console.log(`* Saving result to ${argv.output}`);

    writeFileSync(argv.output, data);

    console.log("* Done!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
