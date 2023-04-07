import crypto from 'crypto'
import { writeFileSync } from 'fs'

function generateKeyPair() {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })

  writeFileSync('./config/public_key.pem', keyPair.publicKey)

  writeFileSync('./config/private_key.pem', keyPair.privateKey)
}

generateKeyPair()
