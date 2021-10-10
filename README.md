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

[Bug Report] Bills. [^1]
[^1]: Priority High.

_Given I am connected as an employee > Then I am on Bills's pages > Then Bills should be ordered from earliest to latest_

- [x] Bills\_\_test: **PASS**
- [x] Bills\_\_Container (getBills()), Now, Bills are sorted per dates from earliest to latest;

- Notes:
- datas retrieved : getBills() > file: Bills.js\_\_containers
- datas displayed : rows(); et row(); files: BillsUI\_\_views

---

[Bug Report] Login. [^1]
[^1]: Priority High.

_Given I am a user on Login's page > When I do fill fields in correct format and I clicked on admin button Login in > Then I should be identified ans an RH admin in app_

- [x] Login\_\_test: **PASS**

_Given I am a user on Login's page > When i do fill fields in correct format and I clicked on admin button Login in > Then I should renders RH dashboard's page_

- [x] Login\_\_test: **PASS**

---

[Bug Hunt] Bills. [^1]
[^1]: Priority High.

\_Je suis connecté en tant qu'employé, je saisis une note de frais avec un justificatif qui a une extension différente de jpg, jpeg ou png, j'envoie. J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.\_

-**TO DO**

- [x] modal is displaying the image;
- [x] Dashboard has to display name's file matching with the right form;

---

[Bug Hunt] BillsView.

\_Sur desktop large: Lorsque que l'on click sur l'image pour voir les factures, l'image dépasse de son conteneur\_

-**TO DO**

- [x] Image had to be inside his container;

---

[Bug Hunt] Bills and Dashboard [^1]
[^1]: Priority High.

\_Sur desktop large: Lorsque que l'on click sur l'image pour voir les factures, l'image dépasse de son conteneur\_

\_Sur le Dashboard: les images qui ne sont pas en jpg, jpeg ou png ont été filtrées\_

-**TO DO**

- [x] Image had to be inside his container;
- [x] Dashboard: Image had to be on jpeg, jpg or png;

---

[Bug Hunt] Dashboard [^1]
[^1]: Priority High.

\_Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste. \_

-**TO DO**

- [x] To be able to expand several lists, and search for tickets on both of them;

---
