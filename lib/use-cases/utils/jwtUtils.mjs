import jwt    from 'jsonwebtoken';
import config from '../../config.cjs';

export function generateToken(object) {
    return jwt.sign({ id: object.id }, config.secret);
}

export function verifyToken(token) {
    return jwt.verify(token, config.secret);
}
