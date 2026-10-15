const express = require("express");
const { usuarioSchema } = require("./schema");

const router = express.Router();

const usuarios = [];

// GET — opcional, útil para testar no navegador
router.get("/", (req, res) => {
    res.json(usuarios);
});

router.post("/", (req, res) => {
    const resultado = usuarioSchema.safeParse(req.body);

    if (!resultado.success) {
        const errors = {};

        resultado.error.issues.forEach((error) => {
            const campo = error.path.length > 0 ? error.path.join(".") : "corpo";

            if (!errors[campo]) {
                errors[campo] = [];
            }

            errors[campo].push(error.message);
        });

        return res.status(422).json({
            status: 422,
            message: "Erro de validação",
            errors,
        });
    }

    const dados = resultado.data;

    const emailExiste = usuarios.some((usuario) => usuario.email === dados.email);

    if (emailExiste) {
        return res.status(422).json({
            status: 422,
            message: "Erro de validação",
            errors: {
                email: ["O email já está em uso"],
            },
        });
    }

    const novoUsuario = {
        id: usuarios.length + 1,
        ...dados,   // ✅ espalha apenas os dados validados
    };

    usuarios.push(novoUsuario);

    return res.status(201).json({
        message: "Usuário criado com sucesso",
        usuario: novoUsuario,
    });
});

module.exports = router;