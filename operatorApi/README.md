# Express API

## Quickstart SANS DOCKER

- A la racine du dossier, créer un fichier `.env` qui devra contenir 2 lignes :
(fournie dans le cadre du projet 4WEBD pour vous simplifier la vie)

```
DB_ACCESS="string de connexion mongoDB"
TOKEN_KEY="clé de chiffrement JsonWebToken"

```

_Pour générer la clé de chiffrement [voir ici](https://mkjwk.org/)_

- Dans le dossier racine ➡️ `npm install` , puis `npm start`.<br>(_le terminal doit confirmer le lancement du serveur sur le port 3000 et la connexion à MongoDB_)

## Quickstart AVEC DOCKER

-normalement nous vous avons déjà tous mis à disposition il vous suffit de lancer le docker compose.

#### Vous pouvez utiliser l'API 👍

## Endpoints
http://localhost:3001/api/


#### /operators
- "/login" POST
- "/delete/:id" DELETE
- "/modify/:id