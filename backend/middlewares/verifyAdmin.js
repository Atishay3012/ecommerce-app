const verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json('Access denied: Admins only');
    next();
};

module.exports = verifyAdmin;
