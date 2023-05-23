const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken })

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //--> Forbidden
                console.log(decoded);
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.email !== decoded.UserInfo.email) return res.sendStatus(403);
            // console.log(decoded.UserInfo)
            // Refresh token was still valid
            const roles = Object.values(decoded.UserInfo.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                      "email": decoded.UserInfo.email,
                      "roles": roles
                    }
                  },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }
