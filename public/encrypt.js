class Crypt {
    #CRYPT_ALGORITHM = "AES-GCM"
    #encoder = new TextEncoder()
    #decoder = new TextDecoder()
    #key
    
    async setKey(key){
        const rawKey = window.crypto.getRandomValues(this.#encoder.encode(this.#makeKeyLength32(key)));
        this.#key = await window.crypto.subtle.importKey("raw", rawKey, this.#CRYPT_ALGORITHM, true, [
            "encrypt",
            "decrypt",
        ]);
    }

    async encrypt(obj) {
        const encoded = this.#encoder.encode(JSON.stringify(obj))
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const data  = await window.crypto.subtle.encrypt(
            { name: this.#CRYPT_ALGORITHM, iv: iv },
            this.#key,
            encoded
        )
        return { data: this.#decoder.decode(data), iv }
    }

    async decrypt(ciphertext, iv) {
        const encoded_data = await window.crypto.subtle.decrypt(
            { name: this.#CRYPT_ALGORITHM, iv }, 
            this.#key, 
            ciphertext
        )
        return JSON.parse(this.#decoder.decode(encoded_data))
    }

    /**
     * Ensures the key length is 32 charectars (bytes)
     * @throws if the key length is greater than 32
     * @throws if the key length is less than 5 (because it would not be strong enough)
     * @param {string} key 
     */
    #makeKeyLength32(key){
        if (key.length > 32) {
            throw "key is to big"
        } else if (key.length < 5) {
            throw "key is to small"
        }
        while (key.length < 32) {
            key += "a"
        }
        return key
    }
}
