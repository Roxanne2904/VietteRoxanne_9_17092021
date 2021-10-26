import { formatDate } from "../app/format.js";
import DashboardFormUI from "../views/DashboardFormUI.js";
import BigBilledIcon from "../assets/svg/big_billed.js";
import { ROUTES_PATH } from "../constants/routes.js";
import USERS_TEST from "../constants/usersTest.js";
import Logout from "./Logout.js";

export const filteredBills = (data, status, jest) => {
  return data && data.length
    ? data.filter((bill) => {
        let selectCondition;
        // in jest environment
        if (typeof jest !== "undefined") {
          selectCondition = bill.status === status;
        } else {
          // in prod environment
          const userEmail = JSON.parse(localStorage.getItem("user")).email;
          selectCondition =
            bill.status === status &&
            [...USERS_TEST, userEmail].includes(bill.email);
        }
        return selectCondition;
      })
    : [];
};

export const card = (bill) => {
  const firstAndLastNames = bill.email.split("@")[0];
  const firstName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[0]
    : "";
  const lastName = firstAndLastNames.includes(".")
    ? firstAndLastNames.split(".")[1]
    : firstAndLastNames;

  return `<div class='bill-card' id='open-bill${
    bill.id
  }' data-testid='open-bill${bill.id}'>
    <div class='bill-card-name-container'>
      <div class='bill-card-name' data-testid ="firstAndLastName"> ${firstName} ${lastName} </div>
      <span class='bill-card-grey'> ... </span>
    </div>
    <div class='name-price-container'>
      <span> ${bill.name} </span>
      <span> ${bill.amount} € </span>
    </div>
    <div class='date-type-container'>
      <span> ${formatDate(bill.date)} </span>
      <span> ${bill.type} </span>
    </div>
  </div>
`;
};

export const cards = (bills) => {
  return bills && bills.length ? bills.map((bill) => card(bill)).join("") : "";
};

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending";
    case 2:
      return "accepted";
    case 3:
      return "refused";
  }
};

export default class {
  constructor({ document, onNavigate, firestore, bills, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    $("#arrow-icon1").click((e) => this.handleShowTickets(e, bills, 1));
    $("#arrow-icon2").click((e) => this.handleShowTickets(e, bills, 2));
    $("#arrow-icon3").click((e) => this.handleShowTickets(e, bills, 3));
    this.getBillsAllUsers();
    new Logout({ localStorage, onNavigate });
  }

  handleClickIconEye = () => {
    const billUrl = $("#icon-eye-d").attr("data-bill-url");
    const imgWidth = Math.floor($("#modaleFileAdmin1").width() * 0.4);
    $("#modaleFileAdmin1")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} /></div>`
      );
    /* istanbul ignore else */ if (
      typeof $("#modaleFileAdmin1").modal === "function"
    )
      $("#modaleFileAdmin1").modal("show");
  };

  handleEditTicket(e, bill, bills) {
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0;
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id;
    console.log("--------------------");
    console.log("--------------------");
    console.log(`this counter % 2 = ${this.counter % 2}`);
    console.log(
      "{result: { 0: if path (open-bill), 1: else path (close-bill)}}"
    );
    if (this.counter % 2 === 0) {
      bills.forEach((b) => {
        $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
      });

      $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
      $(".dashboard-right-container div").html(DashboardFormUI(bill));
      $(".vertical-navbar").css({ height: "150vh" });
      this.counter++;
    } else {
      $(`#open-bill${bill.id}`).css({ background: "#0D5AE5" });

      $(".dashboard-right-container div").html(`
        <div id="big-billed-icon"> ${BigBilledIcon} </div>
      `);
      $(".vertical-navbar").css({ height: "120vh" });
      this.counter++;
    }
    $("#icon-eye-d").click(this.handleClickIconEye);
    $("#btn-accept-bill").click((e) => this.handleAcceptSubmit(e, bill));
    $("#btn-refuse-bill").click((e) => this.handleRefuseSubmit(e, bill));
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "accepted",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: "refused",
      commentAdmin: $("#commentary2").val(),
    };
    this.updateBill(newBill);
    this.onNavigate(ROUTES_PATH["Dashboard"]);
  };

  handleShowTickets(e, bills, index) {
    console.log(
      `1). le counter est à ${this.counter} et l'index est à ${this.index}`
    );
    console.log(`---------------------`);
    /* istanbul ignore else */ if (
      this.counter === undefined ||
      this.index !== index
    )
      this.counter = 0;
    /* istanbul ignore else */ if (
      this.index === undefined ||
      this.index !== index
    )
      this.index = index;
    console.log(
      `2). le counter est à ${this.counter} et l'index est à ${this.index}`
    );
    console.log(`---------------------`);
    console.log(`${this.counter} % 2 = ${this.counter % 2}`);
    console.log(`---------------------`);
    //---
    const element = document.getElementById(
      `status-bills-container${this.index}`
    );
    //au cas ou pour la condition : this.counter % 2 === 0
    // la condition : element.dataset.open === "false"
    if (element.dataset.open === "false") {
      element.dataset.open = "true";
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(0deg)" });
      $(`#status-bills-container${this.index}`).html(
        cards(filteredBills(bills, getStatus(this.index)))
      );
      this.counter++;
    } else {
      element.dataset.open = "false";
      $(`#arrow-icon${this.index}`).css({ transform: "rotate(90deg)" });
      $(`#status-bills-container${this.index}`).html("");
      this.counter++;
    }

    bills.forEach((bill) => {
      $(`#open-bill${bill.id}`)
        .off()
        .click((e) => {
          this.handleEditTicket(e, bill, bills);
        });
    });

    return bills;
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  getBillsAllUsers = () => {
    let errorDate; //RV:variable ajouté;
    let imageValid; //RV:variable ajouté;

    if (this.firestore) {
      return this.firestore
        .bills()
        .get()
        .then((snapshot) => {
          let bills = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date,
            status: doc.data().status,
          }));
          // -------------
          // RV : on évite les bills avec des erreurs de date; la liste Valide peut s'ouvrir;
          errorDate = bills
            .map((bill) => {
              if (bill.date === "") {
                return true;
              }
            })
            .find((date) => date === true);

          if (errorDate === true) {
            let indexOfError = bills.findIndex((ele) => {
              return ele.date === "";
            });
            bills.splice(indexOfError, 1);
          }
          // -------
          // RV: on évite les images autre que jpeg, jpg ou png;
          imageValid = bills
            .filter((bill) => {
              if (bill.fileUrl !== null) {
                return true;
              }
            })
            .filter((bill) => {
              let file = bill.fileUrl.split("?")[0];
              if (
                file.endsWith("png") ||
                file.endsWith("jpg") ||
                file.endsWith("jpeg")
              ) {
                return true;
              }
            });

          bills = imageValid;
          // -------
          return bills;
        })
        .catch(console.log);
    }
  };

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.firestore) {
      return this.firestore
        .bill(bill.id)
        .update(bill)
        .then((bill) => bill)
        .catch(console.log);
    }
  };
}
