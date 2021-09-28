**Comment lancer l'application en local** :

Clonez le projet :

```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR.git
```

Allez au repo cloné :

```
$ cd Billed-app-FR
```

Installez les packages npm (décrits dans `package.json`) :

```
$ npm install
```

Installez live-server pour lancer un serveur local :

```
$ npm install -g live-server
```

Lancez l'application :

```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`

**Comment lancer tous les tests en local avec Jest :**

```
$ npm run test
```

**Comment lancer un seul test :**

Installez jest-cli :

```
$npm i -g jest-cli
$npm run test src/__tests__/your_test_file.js
```

**Comment voir la couverture de test :**

## `http://127.0.0.1:8080/coverage/lcov-report/`

---

## Project Recovered by Viette Roxanne :

---

Bug Report Bills. [^1]
[^1]: Priority High.

_Given I am connected as an employee > Then I am on Bills's pages > Then Bills should be ordered from earliest to latest_

- [x] Bills\_\_test: **PASS**
- [x] Bills\_\_Container (getBills()), Now, sort bills per dates from earliest to latest;

---
