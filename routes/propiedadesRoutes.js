import express from "express";
import { body } from "express-validator";
import {
    admin,
    crear,
    guardar,
    agregarImagen,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, crear);
router.post(
    "/propiedades/crear",
    protegerRuta,
    body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
    body("descripcion")
        .notEmpty()
        .withMessage("La descripcion es obligatoria")
        .isLength({ max: 200 })
        .withMessage("La descripcion debe tener maximo 200 caracteres"),
    body("categoria").isNumeric().withMessage("La categoria es obligatoria"),
    body("precio").isNumeric().withMessage("El precio es obligatorio"),
    body("habitaciones")
        .isNumeric()
        .withMessage("Las habitaciones son obligatorias"),
    body("wc").isNumeric().withMessage("Los baños son obligatorios"),
    body("estacionamiento")
        .isNumeric()
        .withMessage("los estacionamientos son obligatorios"),
    body("lat").notEmpty().withMessage("Ubica la prxsopiedad en el mapa"),
    guardar
);
router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);
router.post("/propiedades/agregar-imagen/:id", upload.single("imagen"));

export default router;
