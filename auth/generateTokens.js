const jwt = require("jsonwebtoken");

function sing(payload, isAccesToken) {
  return jwt.sign(
    payload,
    isAccesToken
      ? process.env.ACCES_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: 3600,
    }
  );
}

function generateAccessToken(user) {
  return sing({ user }, true);
}

function generateRefreshToken(user) {
  return sing({ user }, false);
}

module.exports = {generateAccessToken, generateRefreshToken}
