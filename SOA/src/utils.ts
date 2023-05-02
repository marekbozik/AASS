const passwordHash = require('password-hash');

export async function hashPassword(password: string) {
    return passwordHash.generate(password).toString();
}

export function comparePassword(password: string, hashedPassword: string) {
    return passwordHash.verify(password, hashedPassword);
}