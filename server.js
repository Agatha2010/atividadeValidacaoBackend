const express = require("express");
const router = express.Router();
const usuariosRouter = require("./usuarios");
const app = express();
const PORTA = 3000;

app.use(express.json());
app.use("/api/v1/usuarios", usuariosRouter);

app.use((erro,  req, res, next) => {
    if (erro instanceof SyntaxError && erro.status === 400 && "body" in erro) {
        return res.status(400).json({
            status: 400,
            message: "JSON inválido",
            errors: {
                body: ["O corpo da requisição contém JSON inválido."]
            }
        });
    }

    console.error(erro);
    return res.status(500).json({
        status: 500,
        message: "Erro interno do servidor"
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});