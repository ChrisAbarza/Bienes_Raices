import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { nombre, email, token } = datos;
    //enviar email
    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Confirma tu cuenta en BienesRaices.com",
        text: "Confirma tu cuenta en BienesRaices.com",
        html: `
            <p> hola ${nombre}, comprueba tu cuenta en BienesRaices.com </p>
            <p> confirmala en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${
            process.env.BACKEND_PORT ?? 3000
        }/auth/confirmar/${token}">Confirmar cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `,
    });
};

const emailRecuperarPass = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { nombre, email, token } = datos;
    //enviar email
    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Reestablece tu password en BienesRaices.com",
        text: "Reestablece tu password en BienesRaices.com",
        html: `
            <p> hola ${nombre}, haz solicitado reestablecer tu password en BienesRaices.com </p>
            <p> Sigue el siguente enlace para completar el proceso:
            <a href="${process.env.BACKEND_URL}:${
            process.env.BACKEND_PORT ?? 3000
        }/auth/recuperar-password/${token}">Reestablecer password</a></p>
        `,
    });
};

export { emailRegistro, emailRecuperarPass };
