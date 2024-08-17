const crypto = require('crypto');

const hashPassword = (plain_text) => {
  // creating a unique salt for a particular user
  const salt = crypto.randomBytes(16).toString('hex');

  // hashing user's salt and password
  const hash = crypto.pbkdf2Sync(plain_text, salt, 1000, 64, 'sha512').toString('hex');

  return [hash, salt];
};

const hashPasswordWithSalt = (plain_text, salt) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
    return crypto.pbkdf2Sync(plain_text, salt, 1000, 64, 'sha512').toString('hex');
  }
  return crypto.pbkdf2Sync(plain_text, salt, 1000, 64, 'sha512').toString('hex');
};

const comparePassword = (pwd_req, pwd_hash, salt) => {
  const pwd_req_hash = hashPasswordWithSalt(pwd_req, salt);
  return pwd_req_hash === pwd_hash;
};

module.exports = { hashPassword, hashPasswordWithSalt, comparePassword };
