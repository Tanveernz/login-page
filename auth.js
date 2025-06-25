const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret"; // In production, move this to an environment variable

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if token is provided
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1]; // Expected format: Bearer <token>

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    auth,
    JWT_SECRET
};
