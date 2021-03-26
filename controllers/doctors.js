const { response } = require("express");

const Doctor = require("../models/doctor");

const getDoctors = async (req, res = response) => {
  const doctors = await Doctor.find()
    .populate("user", "name img")
    .populate("hospital", "name img");

  res.json({
    ok: true,
    doctors,
  });
};

const createDoctor = async (req, res = response) => {
  const { uid } = req;
  const doctor = new Doctor({ user: uid, ...req.body });
  console.log("***** uid ******", uid);

  try {
    const doctorDB = await doctor.save();
    console.log("***** doctorDB ******", doctorDB);

    res.json({
      ok: true,
      doctor: doctorDB,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateDoctor = (req, res = response) => {
  res.json({
    ok: true,
    msg: "updateDoctor",
  });
};

const deleteDoctor = (req, res = response) => {
  res.json({
    ok: true,
    msg: "deleteDoctor",
  });
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
