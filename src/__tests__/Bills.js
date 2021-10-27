/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
//---
import { localStorageMock } from "../__mocks__/localStorage.js";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import BillsContainer from "../containers/Bills.js";
import firebaseGet from "../__mocks__/firebaseGet.js";
import router from "../__mocks__/router_mock.js";
import { ROUTES } from "../constants/routes";
import { ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
// -----
$.fn.modal = jest.fn();
// -----
// onNavigate
// -----
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};
// -----
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
const user = JSON.stringify({
  type: "Employee",
  email: "rox-test@email.com",
});
window.localStorage.setItem("user", user);
window.location.hash = ROUTES_PATH.Bills;
// -----
//__________________________________________________________________________
//__________________________________________________________________________
describe("Given I am connected as an employee", () => {
  describe("When I am on Bill's page but it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When I am on Dashboard page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      const html = BillsUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //--------------------------------
      document.body.innerHTML = `<div id="root"></div>`;
      //--------------------------------
      router();
      //--------------------------------
      let element = screen.getByTestId("icon-window");
      expect(element).toHaveClass("active-icon");
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When I am on Bills Page, there are NO bills", () => {
    describe("When, there is a button, and I click on it", () => {
      test("Then, it should redirect me to NewBills's page ", () => {
        //--------------------------------
        const billsContainer = new BillsContainer({
          document,
          onNavigate,
          firestore: null,
          bills,
          localStorage: window.localStorage,
        });
        //--------------------------------
        const html = BillsUI({ data: [] });
        document.body.innerHTML = html;
        //--------------------------------
        const handleClickNewBillMock = jest.fn((e) =>
          billsContainer.handleClickNewBill(e)
        );
        //--------------------------------
        const element = screen.getByTestId("btn-new-bill");
        // -------------------------------
        element.addEventListener("click", handleClickNewBillMock);
        expect(element).toHaveTextContent("Nouvelle note de frais");
        userEvent.click(element);
        expect(handleClickNewBillMock).toHaveBeenCalled();
      });
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When I am on Bills Page, there are bills", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      let dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      let datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    //__________________________________________________________________________
    //__________________________________________________________________________
    describe("When, I click on one of the eyes to have a preview", () => {
      test("Then, it should open the modal", () => {
        //--------------------------------
        const billsContainer = new BillsContainer({
          document,
          onNavigate,
          firestore: null,
          bills,
          localStorage: window.localStorage,
        });
        //--------------------------------
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html;
        //--------------------------------
        const handleClickIconEyeMock = jest.fn((icon) => {
          billsContainer.handleClickIconEye(icon);
        });
        //--------------------------------
        const iconEye = screen.getAllByTestId("icon-eye");
        expect(iconEye).toHaveLength(4);
        const modaleFile = screen.getByTestId("modaleFile");

        iconEye.forEach((icon) => {
          icon.addEventListener("click", (e) => {
            handleClickIconEyeMock(icon);
          });
          //---
          userEvent.click(icon);
          const billUrl = icon.getAttribute("data-bill-url").split("?")[0];
          console.log(modaleFile.className);
          expect(modaleFile.innerHTML.includes(billUrl)).toBeTruthy();
          expect(handleClickIconEyeMock).toHaveBeenCalled();
        });
      });
    });
  });
});

// test d'intégration GET
//----
describe("Given I am a user connected as an Employee", () => {
  describe("When I navigate to Bill's page", () => {
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
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebaseGet.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
