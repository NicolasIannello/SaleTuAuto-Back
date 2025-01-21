const { Schema, model } = require('mongoose');

const MarcaModeloSchema = Schema({
    marca: { type: String, required: true },
    modelo: { type: String, require:true },
});

MarcaModeloSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports= model('MarcaModelo',MarcaModeloSchema);