import { verifyToken } from "../utils/jwt.js";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Token missing.' });
        return; // apenas encerra, NÃO retorna res
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next(); // segue a execução
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
        return; // encerra
    }
}
