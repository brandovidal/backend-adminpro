const jwt = require("jsonwebtoken");

const generateJWT = (uid) => {
  const payload = { uid };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) {
          console.warn(err);
          reject("No se pudo generar el JWT");
          return;
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
