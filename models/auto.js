const { Schema, model } = require('mongoose');

const AutoSchema = Schema({
    uuid: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    version: { type: String, required: true },
    ano: { type: Number, required: true },
    kms: { type: Number, required: true },
    ubicacion: { type: String, required: true },
    transmision: { type: String, required: true },
    traccion: { type: String, required: true },
    precio: { type: Number, required: true },
    moneda: { type: String, required: true },
    estado: { type: String, required: true },

    cilindros: { type: Number, required: false },
    caballos: { type: Number, required: false },
    peso_bruto_kg: { type: Number, required: false },
    combined_km: { type: Number, required: false },
    combined_l_100: { type: Number, required: false },
    numero_velocidades: { type: Number, required: false },
    aceleración_0_100: { type: Number, required: false },
    litros: { type: Number, required: false },
    motor: { type: String, required: false },
    combustible: { type: String, required: false },

    puertas: { type: Number, required: false },
    rin_dia: { type: Number, required: false },
    rin: { type: String, required: false },
    carroceria: { type: String, required: false },
    luz_baja: { type: String, required: false },

    gps: { type: Boolean, required: false },
    aire_acondicionado: { type: Boolean, required: false },
    sensor_distancia: { type: Boolean, required: false },
    asistencia_estacionamiento: { type: String, required: false },

    airbags: { type: Number, required: false },
    sensor_lluvia: { type: Boolean, required: false },
    bolsas_frontales: { type: Boolean, required: false },
    discos_freno: { type: Number, required: false },
    freno_abs: { type: Boolean, required: false },

    pasajeros: { type: Number, required: false },
    asientos: { type: String, required: false },

    bluetooth: { type: Boolean, required: false },
    radio: { type: String, required: false },
    android_auto: { type: Boolean , required: false },
});

AutoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports= model('Auto',AutoSchema);