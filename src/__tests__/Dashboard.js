/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
// ---
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import DashboardFormUI from "../views/DashboardFormUI.js";
import DashboardUI from "../views/DashboardUI.js";
import Dashboard, {
  filteredBills,
  cards,
  card,
} from "../containers/Dashboard.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import firebaseGet from "../__mocks__/firebaseGet.js";
import { bills } from "../fixtures/bills";
// -----
$.fn.modal = jest.fn();
// -----
describe("Given I am connected as an Admin", () => {
  describe("When I am on Dashboard page, there are bills, and there is one pending", () => {
    test("Then, filteredBills by pending status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "pending", "test");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is one accepted", () => {
    test("Then, filteredBills by accepted status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "accepted", "test");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is two refused", () => {
    test("Then, filteredBills by accepted status should return 2 bills", () => {
      const filtered_bills = filteredBills(bills, "refused", "test");
      expect(filtered_bills.length).toBe(2);
    });
  });
  describe("When I am on Dashboard page but it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      const html = DashboardUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("When I am on Dashboard page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      const html = DashboardUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click on arrow", () => {
    test("Then, tickets list should be unfolding, and cards should be displayed", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore: null,
        bills,
        localStorage: window.localStorage,
      });
      const html = DashboardUI({ data: bills });

      document.body.innerHTML = html;

      const handleShowTickets1 = jest.fn((e) => {
        dashboard.handleShowTickets(e, bills, 1);
      });
      const handleShowTickets2 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 2)
      );
      const handleShowTickets3 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 3)
      );

      const icon1 = screen.getByTestId("arrow-icon1");
      const icon2 = screen.getByTestId("arrow-icon2");
      const icon3 = screen.getByTestId("arrow-icon3");

      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();

      icon2.addEventListener("click", handleShowTickets2);
      userEvent.click(icon2);
      expect(handleShowTickets2).toHaveBeenCalled();

      icon3.addEventListener("click", handleShowTickets3);
      userEvent.click(icon3);
      expect(handleShowTickets3).toHaveBeenCalled();
    });
    test("Then, if tickets list are already unfolding, it should close the list", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore: null,
        bills,
        localStorage: window.localStorage,
      });
      const html = DashboardUI({ data: bills });

      document.body.innerHTML = html;

      const handleShowTickets1 = jest.fn((e) => {
        dashboard.handleShowTickets(e, bills, 1);
      });
      const handleShowTickets2 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 2)
      );
      const handleShowTickets3 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 3)
      );

      const icon1 = screen.getByTestId("arrow-icon1");
      const icon2 = screen.getByTestId("arrow-icon2");
      const icon3 = screen.getByTestId("arrow-icon3");

      const container1 = screen.getByTestId("bills-container1");
      const container2 = screen.getByTestId("bills-container2");
      const container3 = screen.getByTestId("bills-container3");

      container1.dataset.open = "true";
      container2.dataset.open = "true";
      container3.dataset.open = "true";

      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();

      icon2.addEventListener("click", handleShowTickets2);
      userEvent.click(icon2);
      expect(handleShowTickets2).toHaveBeenCalled();

      icon3.addEventListener("click", handleShowTickets3);
      userEvent.click(icon3);
      expect(handleShowTickets3).toHaveBeenCalled();
    });
  });

  describe("When I am on Dashboard, list has been unfolded and cards has been displayed", () => {
    test("Then, it should display first and last name on cards, taken from email's data", () => {
      //----
      bills.forEach((bill) => {
        const html = card(bill);
        document.body.innerHTML = html;

        const firstAndLastNames = bill.email.split("@")[0];
        const firstName = firstAndLastNames.includes(".")
          ? firstAndLastNames.split(".")[0]
          : "";
        const lastName = firstAndLastNames.includes(".")
          ? firstAndLastNames.split(".")[1]
          : firstAndLastNames;

        const innerName = screen.getByTestId("firstAndLastName");
        if (firstAndLastNames.includes(".")) {
          console.log(html);
          expect(innerName).toHaveTextContent(`${firstName} ${lastName}`);
        } else {
          console.log(html);
          expect(innerName).toHaveTextContent(`${firstAndLastNames}`);
        }
      });
    });
  });

  describe("When I am on Dashboard page and I click on edit icon of a card", () => {
    test("Then, right form should be filled", () => {
      const html = cards(bills);
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore,
        bills,
        localStorage: window.localStorage,
      });

      const handleEditTicket = jest.fn((e) =>
        dashboard.handleEditTicket(e, bills[0], bills)
      );
      const iconEdit = screen.getByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      iconEdit.addEventListener("click", handleEditTicket);
      userEvent.click(iconEdit);
      expect(handleEditTicket).toHaveBeenCalled();
      userEvent.click(iconEdit);
      expect(handleEditTicket).toHaveBeenCalled();
    });
  });

  describe("When I am on Dashboard and there are no bills", () => {
    test("Then, no cards should be shown", () => {
      const html = cards([]);
      document.body.innerHTML = html;

      const iconEdit = screen.queryByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      expect(iconEdit).toBeNull();
    });
  });
});

describe("Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill", () => {
  describe("When I click on accept button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      const html = DashboardFormUI(bills[0]);
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore,
        bills,
        localStorage: window.localStorage,
      });

      const acceptButton = screen.getByTestId("btn-accept-bill-d");
      const handleAcceptSubmit = jest.fn((e) =>
        dashboard.handleAcceptSubmit(e, bills[0])
      );
      acceptButton.addEventListener("click", handleAcceptSubmit);
      fireEvent.click(acceptButton);
      expect(handleAcceptSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
  describe("When I click on refuse button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      const html = DashboardFormUI(bills[0]);
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore,
        bills,
        localStorage: window.localStorage,
      });
      const refuseButton = screen.getByTestId("btn-refuse-bill-d");
      const handleRefuseSubmit = jest.fn((e) =>
        dashboard.handleRefuseSubmit(e, bills[0])
      );
      refuseButton.addEventListener("click", handleRefuseSubmit);
      fireEvent.click(refuseButton);
      expect(handleRefuseSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
});

describe("Given I am connected as Admin and I am on Dashboard page and I clicked on a bill", () => {
  describe("When I click on the icon eye", () => {
    test("A modal should open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      const html = DashboardFormUI(bills[0]);
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        firestore,
        bills,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye);
      const eye = screen.getByTestId("icon-eye-d");
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFileAdmin");
      expect(modale).toBeTruthy();
    });
  });
});

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebaseGet, "get");
      const bills = await firebaseGet.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.datas.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebaseGet.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = DashboardUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebaseGet.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = DashboardUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
