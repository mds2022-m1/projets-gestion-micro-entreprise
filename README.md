# 💼 Gestion micro-entreprise

## 📄 Description

Cette application permet de gérer sa micro-entreprise en créant des organisations pour lesquelles nous pouvons créer des missions pour facturer celles-ci et avoir un historique de notre activité.

## 🤖 Technos

Ce projet a été fait avec le framework Remix en TypeScript.

* [Documentation Remix](https://remix.run/docs/en/main)
* [Documentation TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

## ⚙️ Démarrage

### 🌱 Environnement

Il faut tout d'abord créer une base de données.

Ensuite, il faut créer le fichier d'environnement en tapant :

```
cp .env.example .env
```

Modifiez la variable `DATABASE_URL` de votre fichier `.env` et mettez l'URL de votre base de données. Par défaut, il faut une base de données POSTGRES, cependant, vous pouvez changer cela en modifiant la variable `DATABASE_PROVIDER` (Les providers possibles sont : `postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb`, `cockroachdb`)

Ensuite, il vous faut renseigner les secrets Github afin de faire fonctionner la connexion avec Github. Pour se faire allez dans les paramètres de Github pour enregistrer une nouvelle application OAuth (https://github.com/settings/developers). Une fois fait, récupérez le `Client ID` et générez un nouveau `Client secrets`. Copiez les valeurs et renseignez les dans le `.env` dans les champs `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`.

Pour finir, générez un token qui servira de secret pour l'authentification en session et renseignez le dans le `.env` dans la valeur `SECRET`.

⚠️ Si vous lancez le projet sur autre chose que votre localhost, pensez bien à modifier l'URL dans l'application OAUth sur Github (https://github.com/settings/developers) et dans la variable `APP_URL`, auquel cas la connexion Github ne pourra pas fonctionner.

### 🛠 Installation des dépendances

À la racine du projet :

```
yarn install
```

### 🔋 Lancement du projet

```
yarn dev
```

L'application tournera maintenant sur le port `3000`. 🎉
