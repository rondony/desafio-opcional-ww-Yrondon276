//importación de módulos
import express from 'express';
import moment from 'moment';
import fs from "node:fs/promises";

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


//crear la instancia de express (la cual tiene los métodos para crear el servidor.)
const app = express();

app.listen(3000, () => {
    console.log("Viiiiveeee... Está Viiivooooo http://localhost:3000");
});

//middlewares

app.use(express.json());
// permite que los datos que lleguen en formato json
//queden guardados en req.body


app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public/index.html"))
});


//RUTAS -> ENDPOINTS

//RUTA PARA CREAR NUEVOS DOCUMENTOS
app.post("/api/documentos", async (req, res) => {
    try {
        let { archivo, contenido } = req.body;

        if (!archivo || !contenido) {
            return res.status(400).json({
                message: "Debe proporcionar todos los datos necesarios para crear el archivo.",
            })
        }

        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}.txt`);
        await fs.writeFile(rutaArchivo, contenido, "utf8");

        res.status(201).json({
            message: "Archivo creado con éxito",
            nombreArchivo: archivo + ".txt"
        })

    } catch (error) {
        res.status(500).json({
            message: "No se puedo crear el archivo.",
        })
    }
});


//RUTA LEER ARCHIVOS
app.get("/api/documentos/:archivo", async (req, res) => {
    try {
        let { archivo } = req.params;

        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}`);
        let contenido = await fs.readFile(rutaArchivo, "utf8");

        res.json({
            message: "Se ha leído correctamente el archivo: " + archivo,
            archivo,
            contenido
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "No se puedo leer el archivo.",
        })
    }
});


//RUTA PARA CAMBIAR NOMBRE AL DOCUMENTO
app.put("/api/documentos", async (req, res) => {
    try {
        let { nombre, nuevoNombre } = req.body;

        if (!nombre || !nuevoNombre) {
            return res.status(400).json({
                message: "Debe proporcionar todos los datos necesarios para renombrar el archivo.",
            })
        }

        let rutaOrigen = path.resolve(__dirname, `./public/files/${nombre}.txt`);
        let rutaDestino = path.resolve(__dirname, `./public/files/${nuevoNombre}.txt`);


        await fs.rename(rutaOrigen, rutaDestino);


        res.status(201).json({
            message: "Archivo renombrado con éxito",
            nuevoNombre: nuevoNombre + ".txt"
        })

    } catch (error) {
        res.status(500).json({
            message: "No se puedo renombrar el archivo.",
        })
    }
});

//RUTA ELIMINAR ARCHIVOS
app.delete("/api/documentos", async (req, res) => {
    try {
        let { archivo } = req.query;

        if (!archivo) {
            return res.status(400).json({
                message: "Debe proporcionar el nombre del archivo.",
            })
        }

        let rutaArchivo = path.resolve(__dirname, `./public/files/${archivo}`);

        await fs.unlink(rutaArchivo);

        res.json({
            message: "Se ha eliminado correctamente el archivo  " + archivo,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "No se puedo eliminar el archivo.",
        })
    }
});