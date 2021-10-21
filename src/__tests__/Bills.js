/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
//---
import { localStorageMock } from "../__mocks__/localStorage.js";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import LoadingPage from "./LoadingPage.js";
import ErrorPage from "./ErrorPage.js";
import BillsUI from "../views/BillsUI.js";
import BillsContainer from "../containers/Bills.js";
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
// window.
// localStorage et location.hash
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

describe("Given I am connected as an employee", () => {
  describe("When I'm onload, waiting for employee's page", () => {
    test("Then, it should display 'Loading...'", () => {
      const html = BillsUI({ loading: LoadingPage });
      document.body.innerHTML = html;
      let element = screen.getByTestId("load");
      expect(element).toHaveTextContent("Loading...");
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When, there's an error", () => {
    test("Then, instead of displayed bills, it should display an error's message", () => {
      const html = BillsUI({ error: ErrorPage });
      document.body.innerHTML = html;
      let element = screen.getByTestId("error-title");
      expect(element).toHaveTextContent("Erreur");
    });
  });
  //__________________________________________________________________________
  //__________________________________________________________________________
  describe("When I am on Bills Page, there are NOT bills", () => {
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
    describe("When, I click on blue eyes to see one of them", () => {
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
        const icons = screen.getAllByTestId("icon-eye");
        const modal = screen.getByTestId("modal-open");
        expect(icons).toHaveLength(4);
        icons.forEach((icon) => {
          icon.addEventListener("click", (e) => {
            handleClickIconEyeMock(icon);
          });
          userEvent.click(icon);
          expect(handleClickIconEyeMock).toHaveBeenCalled();
        });
      });
    });
  });
});
