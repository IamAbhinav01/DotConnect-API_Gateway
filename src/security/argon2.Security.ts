interface Argon2 {
  Hashpassword: void
  VerifyPassword: void
}

interface Argon2Config {
  hashRaw: Uint8Array // Equivelant to []byte
  salt: Uint8Array // Equivelant to []byte
  timeCost: number // Equivelant to uint32 (iterations)
  memoryCost: number // Equivelant to uint32 (in KiB)
  threads: number // Equivelant to uint8 (parallelism)
  keyLength: number // Equivelant to uint32 (hash length)
}

async function hashPasssword(): void {}
async function verifyPassword(): void {}
