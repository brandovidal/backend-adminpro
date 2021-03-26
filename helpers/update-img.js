const fs = require("fs");

const User = require("../models/user");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Borrar imagen anterior
const deleteImg = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const updateImg = async (type, id, name) => {
  switch (type) {
    case "doctors":
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        console.warn("No es un medico por id");
        return false;
      }
      deleteImg(`./uploads/${type}/${doctor.img}`);

      doctor.img = name;
      await doctor.save();
      return true;

    case "hospitals":
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.warn("No es un hospital por id");
        return false;
      }
      deleteImg(`./uploads/${type}/${hospital.img}`);

      hospital.img = name;
      await hospital.save();
      return true;

    case "users":
      const user = await User.findById(id);
      if (!user) {
        console.warn("No es un usuario por id");
        return false;
      }

      deleteImg(`./uploads/${type}/${user.img}`);

      user.img = name;
      await user.save();
      return true;

    default:
      break;
  }
};

module.exports = {
  updateImg,
};
