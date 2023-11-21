const express = require('express');
const axios = require('axios');
const router = express.Router();

const SWAPI_BASE_URL = 'https://swapi.dev/api/planets/';
let planetasAdicionais = [];
let qtdePlanetasAPI = 10;
let proximoId = qtdePlanetasAPI + 1;

// Listar planetas
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(SWAPI_BASE_URL);
        const planetas = response.data.results.concat(planetasAdicionais);
        res.json(planetas);
    } catch (erro) {
        res.status(500).send('Erro ao listar planetas');
    }
});

// Buscar pelo ID/Nome
router.get('/busca/:parametro', async (req, res) => {
  const parametro = req.params.parametro;
  let planeta;

  // Verifica se o parâmetro é um número
  if (!isNaN(parametro)) {
      const id = parseInt(parametro);
      planeta = planetasAdicionais.find(p => p.id === id);
      if (!planeta && id <= 10) {
          try {
              const response = await axios.get(`${SWAPI_BASE_URL}${id}`);
              planeta = response.data;
          } catch (erro) {
              return res.status(404).send('Planeta não encontrado');
          }
      }
  } else { // Busca por nome
      planeta = planetasAdicionais.find(p => p.nome.toLowerCase() === parametro.toLowerCase());
      if (!planeta) {
        try {
            const response = await axios.get(`${SWAPI_BASE_URL}?search=${parametro}`);
            const resultados = response.data.results;
            planeta = resultados.length > 0 ? resultados[0] : null;
        } catch (erro) {
            return res.status(404).send('Planeta não encontrado');
        }
      }
  }

  if (planeta) {
      res.json(planeta);
  } else {
      res.status(404).send('Planeta não encontrado');
  }
});


// Adicionar planeta
router.post('/', (req, res) => {
    const nome = req.body.nome;
    const novoPlaneta = { 
      id: proximoId++, 
      nome: nome, 
      climate: ["temperate", "murky", "tropical", "arid"][Math.floor(Math.random() * 4)],
      gravity: ["1 standard", "1.1 standard", "0.85 standard"][Math.floor(Math.random() * 3)],
      terrain: ["rainforests", "desert", "ice caves", "tundra", "jungle", "mountainous", "cityscape", "ocean"][Math.floor(Math.random() * 7)],};
    planetasAdicionais.push(novoPlaneta);
    res.status(201).json(novoPlaneta);
});

// Remover planeta
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = planetasAdicionais.findIndex(p => p.id === id);
  if (index !== -1) {
      const planetaRemovido = planetasAdicionais.splice(index, 1)[0];
      res.json({ mensagem: `Planeta ${planetaRemovido.nome} (ID: ${planetaRemovido.id}) removido` });
  }
  else {
      res.status(404).send('Planeta não encontrado ou não pode ser removido.');
  }
});

module.exports = router;
