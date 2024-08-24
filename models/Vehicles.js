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
    isActive: { type: Boolean, default: true },
    deleteBy: {
        id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ['customer', 'admin'] }
    },
    isDeleted: { type: Boolean }


}, { timestamps: true })


const VehiclesModel = mongoose.model('vehicle', vehiclesSchema);
module.exports = VehiclesModel;
