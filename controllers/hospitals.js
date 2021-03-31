const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate("user", "name img");
  res.json({
    ok: true,
    hospitals,
  });
};

const createHospital = async (req, res = response) => {
  const { uid } = req;
  const hospital = new Hospital({ user: uid, ...req.body });

  try {
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateHospital = async (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;

  try {
    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital no encontrado por id",
      });
    }

    const modifiedHospital = {
      ...req.body,
      user: uid,
    };

    const hospital = await Hospital.findByIdAndUpdate(id, modifiedHospital, {
      new: true,
    });

    res.json({
      ok: true,
      hospital,
    });
  } catch (error) {
    console.warn(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const { id } = req.params;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital no encontrado por id",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({ ok: true, msg: "Hospital eliminado" });
  } catch (error) {
    console.warn(err);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
