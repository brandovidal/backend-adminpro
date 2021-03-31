const { response } = require("express");

const User = require("../models/user");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

const getAll = async (req, res = response) => {
  const { term } = req.params;
  const regex = new RegExp(term, "i");

  const [users, doctors, hospitals] = await Promise.all([
    User.find({ name: regex }),
    Doctor.find({ name: regex }),
    Hospital.find({ name: regex }),
  ]);

  res.json({
    ok: true,
    term,
    users,
    doctors,
    hospitals,
  });
};

const getDocumentCollection = async (req, res = response) => {
  let { since = 0, size = 10 } = req.query;
  since = Number(since);
  size = Number(size);

  const { term, table } = req.params;
  const regex = new RegExp(term, "i");

  let data = [],
    total = 0;
  switch (table) {
    case "hospital":
      data = await Hospital.find({ name: regex }).populate("user", "name img");
      break;

    case "doctor":
      data = await Doctor.find({ name: regex })
        .populate("user", "name img")
        .populate("hospital", "name img");
      break;

    case "user":
      const [users, countUsers] = await Promise.all([
        User.find({ name: regex }, "name email role google img")
          .skip(since)
          .limit(size),
        User.countDocuments(),
      ]);
      data = users;
      total = countUsers;
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla tiene que ser user/doctor/hospital",
      });
  }
  res.json({
    ok: true,
    term,
    data,
    total,
  });
};

module.exports = { getAll, getDocumentCollection };
