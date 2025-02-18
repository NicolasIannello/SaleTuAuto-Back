const { Schema, model } = require('mongoose');

const FormSchema = Schema({
    nomapel: { type: String, required: true },
    fecha: { type: String, required: true },
    telefono: { type: String, required: true},
});

FormSchema.method('toJSON', function() {
    const { __v, _id,pass, ...object } = this.toObject();
    return object;
});

module.exports= model('Form',FormSchema);