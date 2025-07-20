
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

const ENCRYPTION_KEY = '123455431qwertgfdswertyuiopkmn12'; 
const IV = '1234567890123456'; 

function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const encryptedSecrets = JSON.parse(fs.readFileSync('../student-process-service/encrypted-secrets.json', 'utf8'));

export const decryptedSecrets = {
  username: decrypt(encryptedSecrets.username),
  password: decrypt(encryptedSecrets.password),
  database: decrypt(encryptedSecrets.database),
};
