const { Schema, model } = require("mongoose");

const DoctorSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  hospital: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Hospital'
  },
}, { collection: 'doctors' });

DoctorSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Doctor", DoctorSchema);
