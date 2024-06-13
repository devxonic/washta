const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehiclesSchema = new Schema({

    Owner: { type: mongoose.Types.ObjectId, ref: "customer" },
    vehicleManufacturer: { type: String },
    vehiclePlateNumber: { type: String },
    vehicleName: { type: String },
    vehicleType: { type: String },
    vehicleModel: { type: String },
    isSelected: { type: Boolean, default: false },


})


const VehiclesModel = mongoose.model('vehicle', vehiclesSchema);
module.exports = VehiclesModel;
