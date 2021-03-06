const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ "error": "Repository does not exists." });
  };

  request.repositoryIndex = repositoryIndex;

  return next();
};

function logRequests(request, response, next) {
  const { method, url } = request;

  console.log(`[${method}] - ${url}`);

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', checkRepositoryExists);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const { likes } = repositories.find(repository => repository.id === id);

  const repository = {
    id,
    title, 
    url, 
    techs, 
    likes 
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
