// Copyright 2022 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(async function () {
	const SimplifiedRSA = require('.');

	// Generate Key Pair
	const keyPair = await SimplifiedRSA.key_pair();
	console.log(keyPair);

	// - You can save generated pair as files for later use
	// - Using Saved keys is easy. JUst Import the Keys

	// Import Public Key...
	SimplifiedRSA.import_key(keyPair.public_key);

	// - Now we are ready to encrypt some content
	const text = 'Hello RSA!';
	// Encrypt
	const encrypted = SimplifiedRSA.encrypt(text);
	console.log('encrypted: ', encrypted);

	// - To Decrypt encrypted content, we need too import our private key

	// Decrypt
	SimplifiedRSA.import_key(keyPair.private_key);
	const decrypted = SimplifiedRSA.decrypt(encrypted);
	console.log('decrypted: ', decrypted);

	// - You can also convert keys from one format to another. Check out https://www.npmjs.com/package/rsa-key

	// Convert Public Key o pkcs1
	let pkcs1_public_key = SimplifiedRSA.convert_public(
		keyPair.public_key,
		'pem',
		'pkcs1'
	);

	console.log(pkcs1_public_key);

	// Convert Private Key o pkcs1
	let pkcs1_private_key = SimplifiedRSA.convert_private(
		keyPair.private_key,
		'pem',
		'pkcs1'
	);

	console.log(pkcs1_private_key);
})();
