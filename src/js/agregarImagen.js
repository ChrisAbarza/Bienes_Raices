import { Dropzone } from "dropzone";

//obtener token csrf del tag meta
const token = document.querySelector('meta[name="csrf-token"]').content;

// "imagen" is the id of the dropzone element
Dropzone.options.imagen = {
    dictDefaultMessage: "Arrastra una imagen o haz click para subirla",
    acceptedFiles: ".jpg, .jpeg, .png",
    maxFilesize: 5,
    maxFiles: 1,
    paralellUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Eliminar Imagen",
    dictMaxFilesExceeded: "Solo puedes subir una imagen",
    dictFileTooBig: "La imagen es muy pesada",
    dictInvalidFileType: "Solo puedes subir imagenes",
    headers: {
        "CSRF-Token": token,
    },
    paramName: "imagen",
};
