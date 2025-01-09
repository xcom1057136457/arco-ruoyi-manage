import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import {
  PRIVATE_KEY as privateKey,
  PUBLIC_KEY as publicKey,
} from '@/constant/jsencrypt.constant'

/**
 * 加密
 */
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(txt)
}

/**
 * 解密
 */
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
