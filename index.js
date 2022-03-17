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

const RSAKey = require('rsa-key'),
	NodeRSA = require('node-rsa'),
	crypto = require('crypto');

class EasyRSA {
	#nodeRSAKey;

	constructor() {
		this.#nodeRSAKey = new NodeRSA();
	}

	key_pair(opts, passPhrase = null) {
		// validate arguments
		opts && this.#validate_type(opts, 'object', 'Options');

		passPhrase && this.#validate_type(passPhrase, 'string', 'PassPhrase');

		let defaultOpts = {
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

		// If we have a passPhrase
		if (passPhrase) {
			defaultOpts.privateKeyEncoding.cipher = 'aes-256-cbc';
			defaultOpts.privateKeyEncoding.passphrase = passPhrase;
		}

		let options = Object.assign(defaultOpts, opts);

		return new Promise((resolve, reject) => {
			let myCallback = (err, publicKey, privateKey) => {
				if (!err) {
					// console.log('\n');
					// console.log(publicKey);
					// console.log(privateKey);
					resolve({
						public_key: publicKey.trim(),
						private_key: privateKey.trim(),
					});
				} else {
					throw err;
				}
			};

			crypto.generateKeyPair('rsa', options, myCallback);
		});
	}

	import_key(key) {
		// validate key
		this.#validate_type(key, 'string', 'Key');
		this.#nodeRSAKey.importKey(key);
	}

	encrypt(plainText, base = 'base64') {
		// validate arguments
		this.#validate_type(plainText, 'string', 'plainText');
		base && this.#validate_type(base, 'string', 'Base');

		return this.#nodeRSAKey.encrypt(plainText, base);
	}

	decrypt(encryptedText, base = 'utf8') {
		// validate arguments
		this.#validate_type(encryptedText, 'string', 'encryptedText');
		base && this.#validate_type(base, 'string', 'Base');
		return this.#nodeRSAKey.decrypt(encryptedText, base);
	}

	convert_public(key, format, output) {
		return this.#convert_key(key, 'public', format, output);
	}

	convert_private(key, format, output) {
		return this.#convert_key(key, 'private', format, output);
	}

	#convert_key(key, type = 'public', format, output) {
		// validate params
		let argNames = ['Key', 'Type', 'Format', 'OutputFormat'];
		[...arguments].forEach((arg, i) => {
			this.#validate_type(arg, 'string', argNames[i]);
		});

		//format can only be pem && der
		let allowed = ['pem', 'der'];
		this.#validate_allowed_vals(format, allowed, 'Format');

		//output can only be pem && der
		allowed = ['pkcs1', 'pkcs8'];
		this.#validate_allowed_vals(output, allowed, 'Output');

		// /* Import the key */
		let keyConv = new RSAKey(key);
		/* Export key in default format (PEM PKCS8) */
		return keyConv.exportKey(type, format, output);
	}

    // validation private methods
	#validate_allowed_vals(val, allowed, valName) {
		val = val.toLowerCase();
		allowed = allowed.map((s) => s.toLowerCase());

		if (allowed.indexOf(val) == -1) {
			throw new Error(
				`${valName} can only be ${allowed
					.map((s) => `"${s}"`)
					.join(' or ')}`
			);
		}
	}
	#validate_type(val, type, param) {
		if (typeof val !== type) {
			throw new Error(param + ' parameter expects a valid ' + type);
		}
	}
}

module.exports = new EasyRSA();
