export function requireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || user.role !== role) {
            res.status(403).json({ error: "Permission denied." });
            return;
        }
        next();
    };
}
