const { response, request } = require("express");

const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const User = require("../models/user");
const { getMenu } = require("../helpers/menu");

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
        msg: "Contraseña o email incorrectos",
      });
    }

    // Generar token
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      token,
      menu: getMenu(userDB.role),
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const googleSigIn = async (req = request, res = response) => {
  const { token: googleToken } = req.body;
  console.log("googleToken ", googleToken);

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const userDB = await User.findOne({ email });
    console.log("userDB ", userDB);
    let user;

    if (!userDB) {
      // Si no existe el usuario
      user = new User({
        name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      // Existe el usuario
      user = userDB;
      user.google = true;
      // user.password = "@@@"
    }
    console.log("user ", user);

    // guardar usuario
    await user.save();

    // generar token
    const token = await generateJWT(user.id);
    console.log("token ", token);

    res.json({
      ok: true,
      token,
      menu: getMenu(user.role),
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token no es correcto",
    });
  }
};

const renewToken = async (req = request, res = response) => {
  const { uid } = req;

  try {
    // Generar token
    const token = await generateJWT(uid);

    // Retornar usuario
    const user = await User.findById(uid);

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "Token no enviado",
      });
    }

    res.json({
      ok: true,
      token,
      user,
      menu: getMenu(user.role),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
  googleSigIn,
  renewToken,
};
