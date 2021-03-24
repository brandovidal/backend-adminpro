const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitals = (req, res = response) => {
  res.json({
    ok: true,
    msg: "getHospitals",
  });
};

const createHospital = async (req, res = response) => {
  const { uid } = req;
  const hospital = new Hospital({ user: uid, ...req.body });
  console.log("***** uid ******", uid);

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

const updateHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "updateHospital",
  });
};

const deleteHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "deleteHospital",
  });
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
