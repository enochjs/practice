import { createDecipheriv, createCipheriv, createHash } from 'crypto';

export default class DingTalkEncryptor {
  static RANDOM_LENGTH = 16;
  static AES_ENCODE_KEY_LENGTH = 43;

  private aesKey: Buffer;
  constructor(
    private token: string,
    aesKey: string,
    private appKey: string,
  ) {
    this.aesKey = Buffer.from(aesKey + '=', 'base64');
  }

  encrypt(random: string, plaintext: string): string {
    const randomBytes = Buffer.from(random, 'utf8');
    const plainTextBytes = Buffer.from(plaintext, 'utf8');
    const lengthBytes = Buffer.alloc(4);
    lengthBytes.writeInt32BE(plainTextBytes.length);
    const corpidBytes = Buffer.from(this.appKey, 'utf8');

    const bytes = Buffer.concat([
      randomBytes,
      lengthBytes,
      plainTextBytes,
      corpidBytes,
    ]);
    const cipher = createCipheriv(
      'aes-256-cbc',
      this.aesKey,
      this.aesKey.slice(0, 16),
    );
    cipher.setAutoPadding(true);
    let encryptedData = cipher.update(bytes);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return encryptedData.toString('base64');
  }

  getSignature(
    token: string,
    timestamp: string,
    nonce: string,
    encrypt: string,
  ): string {
    const array = [token, timestamp, nonce, encrypt];
    array.sort();
    const str = array.join('');
    const hash = createHash('sha1');
    hash.update(str);
    const digest = hash.digest();
    let hexStr = '';
    for (let i = 0; i < digest.length; i++) {
      const shaHex = (digest[i] & 0xff).toString(16);
      if (shaHex.length < 2) {
        hexStr += '0';
      }
      hexStr += shaHex;
    }
    return hexStr;
  }

  decrypt(text: string) {
    const deCipher = createDecipheriv(
      'aes-256-cbc',
      this.aesKey,
      this.aesKey.slice(0, 16),
    );
    deCipher.setAutoPadding();
    let bytes = deCipher.update(Buffer.from(text, 'base64'));
    bytes = Buffer.concat([bytes, deCipher.final()]);
    console.log(text, bytes.length, bytes.toString());
    const plainTextLength = bytes.readInt32BE(16);
    const plainText = bytes.slice(20, 20 + plainTextLength).toString('utf8');
    const appKey = bytes
      .slice(20 + plainTextLength, bytes.length)
      .toString('utf8');
    console.log('appkey', appKey);
    return plainText;
  }

  getEncryptedMap(plaintext: string, timeStamp: number, nonce: string) {
    // 加密
    const encrypt = this.encrypt(
      this.getRandomStr(DingTalkEncryptor.RANDOM_LENGTH),
      plaintext,
    );
    const signature = this.getSignature(
      this.token,
      timeStamp.toString(),
      nonce,
      encrypt,
    );

    return {
      msg_signature: signature,
      encrypt,
      timeStamp: timeStamp.toString(),
      nonce,
    };
  }

  getDecryptedMap(
    msgSignature: string,
    timeStamp: string,
    nonce: string,
    encrypt: string,
  ) {
    const signature = this.getSignature(this.token, timeStamp, nonce, encrypt);

    console.log('signature', msgSignature, signature);

    return this.decrypt(encrypt);
  }

  getRandomStr(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
