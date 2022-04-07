# Potion Unlock Decrypt Tools

This repository contains the necessary tools to download and decrypt the Potion protocol using the recomposed genesis from the validation process. It contains 3 main scripts:

-   **downloadAndDecrypt.js** : Used to download the encrypted file from IPFS and decrypt it with the given genesis secret
-   **download.js** : It just downloads the file from IPFS and saves it to disk
-   **decrypt.js** : Decrypts a given file with the given genesis secret

The main script is **downloadAndDecrypt.js** and the other 2 are given just for convienence.

# How to Use

1. First install all the dependencies with:

    ```
    $ yarn install
    ```

2. We have set up a fast gateway to download the encrypted source from IPFS: `https://potion-unlock.mypinata.cloud/ipfs/QmTfDKkFaiYKp4Rsmt6im1fENAMpRyffgeXQLbRS8b4zWE`

3. Then Go to the Potion Unlock website and from the **Decrypt** page copy the final secret genesis once it has reached a 100% completion. Save it in a file called _genesis_ in the root folder.

4. Then execute the following command:

    ```
    $ node scripts/downloadAndDecrypt.js -u {IPFS_URL} -g {GENESIS_FILE}
    ```

    Where **IPFS_URL** is the url you got in step 2 and **GENESIS_FILE** is the name of the file you created in step 3

The script will download and decrypt the file and save the decrypted data to disk. The script will tell
you the file name of the newly created file.
