"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var crypto = require("crypto");
var ENCRYPTION_KEY = '123455431qwertgfdswertyuiopkmn12';
var IV = '1234567890123456';
function encrypt(text) {
    var cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
var secretsPath = './src/secrets122.json';
var secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
var encryptedSecrets = {
    username: encrypt(secrets.username),
    password: encrypt(secrets.password),
    database: encrypt(secrets.database),
};
fs.writeFileSync('./encrypted-secrets.json', JSON.stringify(encryptedSecrets, null, 2));
