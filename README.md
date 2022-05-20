## I started this project on 17/09/2021
*Training begins on 23/12/2020*
## Le déploiement du projet sur Netlify
- [Billed](https://oc-rv-p9-billed.netlify.app/)
- [![Netlify Status](https://api.netlify.com/api/v1/badges/86ceaf9e-3b44-4bc1-bbff-c058100f3886/deploy-status)](https://app.netlify.com/sites/oc-rv-p9-billed/deploys)
## Comment lancer l'application en local ?
forker ce repository puis cloner le en local:
```
$ git clone https://github.com/Roxanne2904/VietteRoxanne_9_17092021.git
```
```
$ cd VietteRoxanne_9_17092021
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


## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Project Recovered by Viette Roxanne :
---
### [Bug Report] Bills.
- Priority High.

_Given I am connected as an employee > Then I am on Bills's pages > Then Bills should be ordered from earliest to latest_

- [x] Bills\_\_test: **PASS**
- [x] Bills\_\_Container (getBills()), Now, Bills are sorted per dates from earliest to latest;

- Notes:
- Le code rajouté pour trier les données est dans `getBills()`

---

### [Bug Report] Login.
- Priority High.

_Given I am a user on Login's page > When I do fill fields in correct format and I clicked on admin button Login in > Then I should be identified ans an RH admin in app_

- [x] Login\_\_test: **PASS**

_Given I am a user on Login's page > When i do fill fields in correct format and I clicked on admin button Login in > Then I should renders RH dashboard's page_

- [x] Login\_\_test: **PASS**

- Notes:
- La provenance du bug vient de `handleSubmitAdmin` dans le login/container;
- ERROR = `` le document.querySelector(`input[data-testid="employee-email-input"]`) ``
- VALID = `` le document.querySelector(`input[data-testid="admin-email-input"]`) ``

---

### [Bug Hunt] Bills.
- Priority High.

\_Je suis connecté en tant qu'employé, je saisis une note de frais avec un justificatif qui a une extension différente de jpg, jpeg ou png, j'envoie. J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.\_

-**TO DO**

- [x] modal is displaying the image;
- [x] Dashboard has to display name's file matching with the right form;

- Notes:
- Ajout d'une condition dans `handleChangeFile` dans NewBill/container;
- Dans la partie Admin, pour éviter de voir 'les bills' déjà envoyées avec des images null:
  > la liste valid ne s'ouvrait pas à cause d'une date non valid : Dashboard/container, `getBillsAllUsers()`
  > pour éviter d'avoir des images autre que jpg, jpeg ou png : Dashboard/container, `getBillsAllUsers()`

---

### [Bug Hunt] Bills and Dashboard
- Priority High.

\_Sur desktop large: Lorsque que l'on click sur l'image pour voir les factures, l'image dépasse de son conteneur\_

-**TO DO**

- [x] Image had to be inside his container;

---

### [Bug Hunt] Dashboard
- Priority High.

\_Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste. \_

-**TO DO**

- [x] To be able to expand several lists, and search for tickets on both of them;

- Notes:
- dans `handleShowTickets` dashboard/container, grâce à `.off()` on évite que `handleEditTickets` soit appelé x3 pour la première liste ouverte, si les trois ou deux sont ouvertes en même temps;
- changement de la condition pour ouvrir les listes: cela évite un pb lorsque que l'on ouvre toute les liste en même temps;

---
