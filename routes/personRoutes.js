const router = require("express").Router();
const Person = require("../models/Person");

// Middleware para verificar permissões
const checkAdmin = (req, res, next) => {
  const { name } = req.body; // Ou `req.query` ou `req.params` dependendo de como você está enviando o nome do usuário
  if (name !== "admin") {
    return res.status(403).json({ error: "Apenas o admin pode realizar esta ação." });
  }
  next();
};

// Create - Criação de dados
router.post("/", checkAdmin, async (req, res) => {
  const { name, salary, approved, trainee, dataInicio, dataFim } = req.body;

  if (!name) {
    return res.status(422).json({ error: "O nome é obrigatório." });
  }

  try {
    const existingPerson = await Person.findOne({ name });

    if (existingPerson) {
      return res.status(422).json({ message: "A pessoa já existe no sistema." });
    }

    const person = { name, salary, approved, trainee, dataInicio, dataFim };
    await Person.create(person);

    res.status(201).json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read - Leitura de Dados
router.get("/", async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const person = await Person.findOne({ name });
    if (!person) {
      return res.status(422).json({ message: "O Usuário não foi encontrado!" });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update - Atualização de dados
router.patch("/:name", async (req, res) => {
  const nameUser = req.params.name;
  const { name, salary, approved, trainee, dataInicio, dataFim } = req.body;

  try {
    const updatedPerson = await Person.updateOne({ name: nameUser }, { name, salary, approved, trainee, dataInicio, dataFim });
    if (updatedPerson.matchedCount === 0) {
      return res.status(422).json({ message: "O Usuário não foi encontrado!" });
    }
    res.status(200).json({ message: "Pessoa atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete - Deletar dados
router.delete("/:name", async (req, res) => {
  const name = req.params.name;
  const { deletedBy } = req.query;

  if (deletedBy !== "admin") {
    return res.status(403).json({ error: "Apenas o admin pode deletar usuários." });
  }

  try {
    const person = await Person.findOne({ name });
    if (!person) {
      return res.status(422).json({ message: "Usuário não foi encontrado!" });
    }

    await Person.deleteOne({ name });
    res.status(200).json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
