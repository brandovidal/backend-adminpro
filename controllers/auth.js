const { response } = require("express");

const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const User = require("../models/user");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verify email
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Contraseña o email no encontrada",
      });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Contraseña o email no encontrada",
      });
    }

    // Generar token
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
