import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: "Chris",
        email: "salv8steam@gmail.com",
        confirmado: 1,
        password: bcrypt.hashSync("password", 10),
    },
];

export default usuarios;
