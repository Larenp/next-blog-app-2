import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_editorial_luxury_2025";

/**
 * Hash a password using PBKDF2
 * @param {string} password 
 * @returns {string} Combined format: pbkdf2$salt$hash
 */
export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `pbkdf2$${salt}$${hash}`;
}

/**
 * Verify a password against a stored PBKDF2 hash
 * @param {string} password 
 * @param {string} storedCombined 
 * @returns {boolean} True if matched
 */
export function verifyPassword(password, storedCombined) {
    if (!storedCombined || !storedCombined.startsWith('pbkdf2$')) {
        return false;
    }
    const [, salt, storedHash] = storedCombined.split('$');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    
    // Timing-safe comparison to prevent side-channel timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Sign a session payload to produce a signed stateless token
 * @param {object} payload 
 * @returns {string} The signed token
 */
export function signToken(payload) {
    // Add default expiration (7 days)
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const data = JSON.stringify({ ...payload, exp });
    
    const encodedPayload = Buffer.from(data).toString('base64url');
    
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(encodedPayload);
    const signature = hmac.digest('base64url');
    
    return `${encodedPayload}.${signature}`;
}

/**
 * Verify a signed stateless token
 * @param {string} token 
 * @returns {object|null} The payload if valid, null otherwise
 */
export function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [encodedPayload, signature] = parts;
    
    // Recompute signature
    const hmac = crypto.createHmac('sha256', JWT_SECRET);
    hmac.update(encodedPayload);
    const expectedSignature = hmac.digest('base64url');
    
    // Timing-safe signature match
    const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'base64url'),
        Buffer.from(expectedSignature, 'base64url')
    );
    
    if (!isSignatureValid) return null;
    
    try {
        const decodedString = Buffer.from(encodedPayload, 'base64url').toString('utf8');
        const payload = JSON.parse(decodedString);
        
        // Check expiration
        if (payload.exp && Date.now() > payload.exp) {
            return null;
        }
        
        return payload;
    } catch (e) {
        return null;
    }
}
