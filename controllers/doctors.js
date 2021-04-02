const { response } = require("express");

const Doctor = require("../models/doctor");

const getDoctors = async (_req, res = response) => {
  const doctors = await Doctor.find()
    .populate("user", "name img")
    .populate("hospital", "name img");

  res.json({
    ok: true,
    doctors,
  });
};

const getDoctorById = async (req, res = response) => {
  const { uid } = req.params;

  try {
    const doctor = await Doctor.findById(uid)
      .populate("user", "name img")
      .populate("hospital", "name img");

    res.json({
      ok: true,
      doctor,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
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

const updateDoctor = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: "Doctor no encontrado por id",
      });
    }

    const modifiedDoctor = { ...req.body, user: uid };

    const updateDoctor = await Doctor.findByIdAndUpdate(id, modifiedDoctor, {
      new: true,
    });

    res.json({
      ok: true,
      doctor,
    });
  } catch (error) {
    console.warn(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: "Doctor no encontrado por id",
      });
    }

    await Doctor.findByIdAndDelete(id);
    res.json({ ok: true, msg: "Doctor eliminado" });
  } catch (error) {
    console.warn(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
