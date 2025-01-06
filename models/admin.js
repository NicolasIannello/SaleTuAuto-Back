const { Schema, model } = require('mongoose');

const AdminSchema = Schema({
    usuario: { type: String, required: true },
    pass: { type: String, required: true },
    usuarios: { type: Boolean, required: true},
    autos: { type: Boolean, required: true},
    uuid: { type: String, required: true },
});

AdminSchema.method('toJSON', function() {
    const { __v, _id,pass, ...object } = this.toObject();
    return object;
});

module.exports= model('Admin',AdminSchema);