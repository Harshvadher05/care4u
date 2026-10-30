const jwt = require('jsonwebtoken');
require("dotenv").config();

const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (token) {
        try {
            const secret = process.env.ACCESS_JWT_SECRET;
            if (secret) {
                const decoded = jwt.verify(token, secret);
                if (decoded && decoded.role) {
                    switch(decoded.role) {
                        case 'PATIENT': return res.redirect('/patient/dashboard');
                        case 'DOCTOR': return res.redirect('/doctor/dashboard');
                        case 'STAFF': return res.redirect('/staff/dashboard');
                        case 'ADMIN': return res.redirect('/admin/dashboard');
                        case 'SUPER_ADMIN': return res.redirect('/superadmin/dashboard');
                    }
                }
            }
        } catch (error) {
            res.clearCookie('accessToken', { path: '/' });
        }
    }
    next();
};

module.exports = redirectIfLoggedIn;
