const { response, request } = require("express");
const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const { updateImg } = require("../helpers/update-img");

const uploadFile = (req = request, res = response) => {
  const { type, id } = req.params;

  // Validar tipo
  const validTypes = ["doctors", "hospitals", "users"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un medico, hospital o usuario",
    });
  }

  // Validar existencia de archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  // Procesar la imagen
  const { img: file } = req.files;

  const nameSplited = file.name.split(".");
  const extension = nameSplited[nameSplited.length - 1];

  // Validar extensiones
  const validExtensions = ["png", "jpg", "jpeg", "gif"];
  if (!validExtensions.includes(extension)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extension permitida",
    });
  }

  // Generar el nombre del archivo
  const name = `${uuidv4()}.${extension}`;

  // Path para guardar la imagen
  const path = `./uploads/${type}/${name}`;

  // Mover la imagen
  file.mv(path, function (err) {
    if (err) {
      console.warn(err);
      return res.status(400).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    // Actualizar la BD
    updateImg(type, id, name);

    res.json({
      ok: true,
      msg: "Archivo subido",
      name,
    });
  });
};

const getFile = (req = request, res = response) => {
  const { type, img } = req.params;

  const pathImg = path.join(__dirname, `../uploads/${type}/${img}`);

  // Imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    res.sendFile(path.join(__dirname, `../uploads/not-found.png`));
  }
};

module.exports = {
  uploadFile,
  getFile,
};
