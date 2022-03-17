# Why

Generating and using RSA PEM Keys can be a headache. And what about the moments you want to convert keys from one format to the other, crazy.

I spent a lot of time figuring this out to enable end-to-end encryption from a NodeJS server and RUST websocket clients.

Finally figured it out so you wont have to shed premium tears!

# What it does

This module helps with the **Generation** of RSA PEM Keys as well as **Encoding/Decoding** data and even **Converting** PEM Keys from one format to the other Like a Boss!

# Modules You Need to Check Out

This module leverages on the amazing [RSA-Key](https://www.npmjs.com/package/rsa-key) for key conversions and [Node-Rsa](https://www.npmjs.com/package/node-rsa) to load keys, encrypt and decrypt data and of course the inbuilt [Crypto](https://nodejs.org/api/crypto.html) to generate keys.

It is important to check these modules when you have the time!

# Is it really that **Easy**?

Well, I named it **easy-rsa** for a reason, and here is proof.

```javascript
;(async function () {
	const EasyRSA = require('easy-rsa');

	// Generate Key Pair
	const keyPair = await EasyRSA.key_pair();
	console.log(keyPair);

	// - You can save generated pair as files for later use
	// - Using Saved keys is easy. JUst Import the Keys

	// Import Public Key...
	EasyRSA.import_key(keyPair.public_key);

	// - Now we are ready to encrypt some content
	const text = 'Hello RSA!';
	// Encrypt
	const encrypted = EasyRSA.encrypt(text);
	console.log('encrypted: ', encrypted);

	// - To Decrypt encrypted content, we need too import our private key

	// Decrypt
	EasyRSA.import_key(keyPair.private_key);
	const decrypted = EasyRSA.decrypt(encrypted);
	console.log('decrypted: ', decrypted);

	// - You can also convert keys from one format to another. Check out https://www.npmjs.com/package/rsa-key

	// Convert Public Key o pkcs1
	let pkcs1_public_key = EasyRSA.convert_public(
		keyPair.public_key,
		'pem',
		'pkcs1'
	);

	console.log(pkcs1_public_key);

	// Convert Private Key o pkcs1
	let pkcs1_private_key = EasyRSA.convert_private(
		keyPair.private_key,
		'pem',
		'pkcs1'
	);

	console.log(pkcs1_private_key);
})()
```

# API

### `key_pair([opts:Object, passPhrase:String])`

**Note:**

**passPhrase:** is null by default. Note that private Keys generated using a pass phrase will fail to import!
**Default Options ** are:

```javascript
defaultOpts = {
	modulusLength: 1024 * 2,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem',
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
	},
};
```

### ```import_key(key:String)```

---

### ```encrypt(plainText:String [, base:String])```

Default ```base``` is **"base64"**

---

### ```decrypt(encryptedText:String [, base:String])```
Default ```base``` is **"utf8"**

---

### ```convert_public(key:String, format:String, output:String) ```

---

### ```convert_private(key:String, format:String, output:String) ```

---

**Note:**

For both ```convert_public``` and ```convert_private```, you can only pass the following values as the```format``` and ```output``` arguments:

- **format** : ```pem``` and ```der```;
- **output** : ```pkcs1``` and ```pkcs8```;
