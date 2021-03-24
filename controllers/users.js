const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const getUsers = async (_req, res) => {
  const users = await User.find({}, "name email role google");

  res.json({
    ok: true,
    users,
  });
};

const createUser = async (req, res = response) => {
  console.log(req.body);

  const { email, password } = req.body;

  try {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const user = new User(req.body);

    // Encrypting password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const updateUser = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto
  const { id: uid } = req.params;
  console.log("updateUser ", uid);

  try {
    const userBD = await User.findById(uid);

    if (!userBD) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese ID",
      });
    }

    const fields = req.body;
    const { email } = req.body;

    if (userBD.email === email) {
      delete fields.email;
    } else {
      const existsEmail = await User.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya esta registrado",
        });
      }
    }

    delete fields.password;
    delete fields.google;

    const userUpdate = await User.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      uid,
      user: userUpdate,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
