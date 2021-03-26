const { response, request } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  let { since = 0, size = 10 } = req.query;
  since = Number(since);
  size = Number(size);
  console.log("size ", since, size);

  const [users, total] = await Promise.all([
    User.find({}, "name email role google img").skip(since).limit(size),
    User.countDocuments(),
  ]);

  res.json({
    ok: true,
    users,
    uid: req.uid,
    total,
  });
};

const createUser = async (req, res = response) => {
  // console.log(req.body);
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

    // Generar token
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
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
  // console.log("updateUser ", uid);

  try {
    const userBD = await User.findById(uid);
    if (!userBD) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese ID",
      });
    }

    const { password, google, email, ...fields } = req.body;
    if (userBD.email !== email) {
      const existsEmail = await User.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({
          ok: false,
          msg: "El correo ya esta registrado",
        });
      }
    }

    fields.email = email;
    const userUpdate = await User.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
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

const deleteUser = async (req = request, res = response) => {
  const { id: uid } = req.params;
  console.log("deleteUser ", uid);

  try {
    const userBD = await User.findById(uid);
    if (!userBD) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese ID",
      });
    }

    const { name } = await User.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: `Usuario ${name} borrado correctamente`,
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
  deleteUser,
};
