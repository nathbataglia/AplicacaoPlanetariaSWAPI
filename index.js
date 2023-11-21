const express = require('express');
const bodyParser = require('body-parser');
const planetasRouter = require('./controllers/controller');

const app = express();
app.use(bodyParser.json());
app.use(express.static('view'));
app.use('/planetas', planetasRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
