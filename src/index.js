import express, { json } from "express";

const app = express();
app.use(json());

const items = [];

app.listen(5000, () => {
  console.log("O servidor está rodando na porta 5000");
});

app.get("/items", (req, res) => {
  const { type } = req.query;

  if (type) {
    const filteredItems = items.filter((item) => item.type === type);
    return res.status(200).send(filteredItems);
  }

  res.status(200).send(items);
});

app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send({ error: "O ID deve ser um número inteiro positivo." });
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    return res.status(404).send({ error: "Item não encontrado" });
  }

  res.status(200).send(item);
});

app.post("/items", (req, res) => {
  const { name, quantity, type } = req.body;

  if (!name || !quantity || !type) {
    return res.status(422).send({ error: "Preencha todos os campos." });
  }

  if (typeof name !== "string" || typeof quantity !== "number" || typeof type !== "string") {
    return res.status(400).send({ error: "Os dados fornecidos têm tipos inválidos." });
  }

  const itemExists = items.some((item) => item.name.toLowerCase() === name.toLowerCase());
  if (itemExists) {
    return res.status(409).send({ error: "Já existe um item com este nome na lista." });
  }

  const newItem = { id: items.length + 1, name, quantity, type };
  items.push(newItem);

  res.status(201).send(newItem);
});
