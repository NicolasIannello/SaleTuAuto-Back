const { Schema, model } = require('mongoose');

const TycSchema = Schema({
    tyc: { type: String, required: true },
});

TycSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports= model('Tyc',TycSchema);