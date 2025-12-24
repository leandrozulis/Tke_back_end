import app from "./app.js";
const PORTA = Number(process.env.PORTA) || 3000;
app.listen(PORTA, '0.0.0.0', () => {
    console.log(`Servidor executando em http://localhost:${PORTA}`);
});
