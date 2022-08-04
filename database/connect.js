import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log('Conexion a la base de datos correcta.');
} catch (error) {
    console.error('Conexion a la base de datos incorrecta.', error);
}