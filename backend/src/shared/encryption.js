import MD5 from 'crypto-js/md5.js';
import jwt from 'jsonwebtoken';

const md5 = (string) => MD5(string).toString();

const generateToken = (data) =>
  jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '21600s' });

export default { md5, generateToken };
