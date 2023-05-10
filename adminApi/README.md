# Express API

## Quickstart

- A la racine du dossier, créer un fichier `.env` qui devra contenir 4 lignes :
(fournie dans le cadre du projet 4CITE pour vous simplifier la vie)

```
DB_ACCESS="string de connexion mongoDB"
TOKEN_KEY="clé de chiffrement JsonWebToken"

TESTADMINTOKEN_Key="token d'un user admin pour les test a générer en amont"
TESTADMINUSERID_KEY= "id d'un user admin pour les test a générer en amont"

```

_Pour générer la clé de chiffrement [voir ici](https://mkjwk.org/)_

- Dans le dossier racine ➡️ `npm install` , puis `npm start`.<br>(_le terminal doit confirmer le lancement du serveur sur le port 3000 et la connexion à MongoDB_)

#### Vous pouvez utiliser l'API 👍

## Endpoints
http://localhost:3000/api


#### /users
- "/:id" GET
- "/" GET
- "/signup" POST
- "/login" POST
- "/delete/:id" DELETE
- "/modify/:id

#### /hotel

- "/:id" POST 
- "/:id" GET  
- "/" GET 
- "/:id" POST
- "/:id" DELETE
- "/image/:id" POST
- "/image/:id" GET  

#### /booking

- "/:id" POST 
- "/:id" GET  
- "/user/:id" GET (à corrigé ,laissez :id vide)
- "/hotel/:id" POST
- "/:id" DELETE
- "/:id