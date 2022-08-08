import { createVerifier, createSigner } from 'fast-jwt';
import config from '../../config.cjs';

const signer = createSigner({ key: config.secret });
const verifier = createVerifier({ key: config.secret });

export function generateToken(object) {
    return signer({ id: object.id });
}

export function verifyToken(token) {
    return verifier(token);
}
