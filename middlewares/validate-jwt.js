const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = (req, res, next) => {
  // Read token
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};

const validateAdminRole = async (req, res, next) => {
  const { uid } = req;

  try {
    const userDB = await User.findById(uid);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (!userDB.role.includes("ADMIN_ROLE")) {
      return res.status(403).json({
        ok: false,
        msg: "No cuenta con privilegios de administrador",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validateAdminRoleOrOwnUser = async (req, res, next) => {
  const { uid } = req;
  const { id } = req.params;

  try {
    const userDB = await User.findById(uid);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (userDB.role.includes("ADMIN_ROLE") || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "No cuenta con privilegios de administrador",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validateJWT,
  validateAdminRole,
  validateAdminRoleOrOwnUser,
};
