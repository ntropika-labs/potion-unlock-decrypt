const wget = require("wget-improved");
const nacl = require("tweetnacl");
const keccak256 = require("keccak256");

/**
 * Utility functions
 */
function isNullish(value) {
    return value === null || value === undefined;
}

/**
 * Symmetric key functions
 */
function getSymmetricKey(genesis) {
    if (genesis.startsWith("0x")) {
        genesis = genesis.slice(2);
    }
    return keccak256(keccak256(keccak256(Buffer.from(genesis, "hex"))));
}

function decryptSymmetric(symmetricKey, encryptedData) {
    if (isNullish(encryptedData)) {
        throw new Error("Missing encryptedData parameter");
    } else if (isNullish(symmetricKey)) {
        throw new Error("Missing symmetricKey parameter");
    }

    // assemble decryption parameters
    const nonce = encryptedData.subarray(0, nacl.box.nonceLength);
    const ciphertext = encryptedData.subarray(nacl.box.nonceLength);

    // decrypt
    return nacl.secretbox.open(ciphertext, nonce, symmetricKey);
}

/**
 * Downloads a blob from a URL and returns it as a Buffer
 */
async function download(url) {
    return new Promise((resolve, reject) => {
        // Download the encrypted file
        const urlDecoded = new URL(url);
        const options = {
            protocol: urlDecoded.protocol,
            host: urlDecoded.host,
            path: urlDecoded.pathname,
            method: "GET",
        };

        let encryptedData = [];
        let request = wget.request(options);

        request.on("response", function (response) {
            if (response.statusCode !== 200) {
                reject("Error downloading file: status=" + response.statusCode);
            }

            response.on("data", function (chunk) {
                encryptedData.push(chunk);
            });
            response.on("error", function (err) {
                reject(err);
            });

            response.on("end", function () {
                resolve(Buffer.concat(encryptedData));
            });
        });

        request.on("error", function (err) {
            reject(err);
        });

        request.on("close", function () {
            resolve(encryptedData);
        });

        request.end();
    });
}

/**
 * Decrypts the given blob and returns it as a Buffer
 */
function decrypt(genesis, blob) {
    // Read the input blob and extract the original filename and the encrypted data
    const filenameLength = blob.readInt32LE(0);
    const filename = blob.slice(4, 4 + filenameLength).toString();
    const encryptedData = blob.slice(4 + filenameLength);

    // Decrypt the file
    const symmetricKey = getSymmetricKey(genesis);
    const decryptedData = decryptSymmetric(symmetricKey, encryptedData);
    if (decryptedData === null) {
        console.log("Decryption failed: wrong genesis");
        process.exit(1);
    }

    return { filename, decryptedData };
}

module.exports = {
    download,
    decrypt,
};
