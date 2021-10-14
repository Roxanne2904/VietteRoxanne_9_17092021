/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
//  ---
import BillsUI from "../views/BillsUI.js";
import BillsContainer from "../containers/Bills.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills";

// -----
$.fn.modal = jest.fn();
// -----
describe("Given I am connected as an Employee", () => {
  describe("When I am on user page, there is only a button, and I click on it", () => {
    test("Then, it should redirect me to NewBills's page ", () => {
      //---
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      //--- On simule le localStorage
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const user = JSON.stringify({
        type: "Employee",
      });
      window.localStorage.setItem("user", user);
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
      //On ajoute le class qui vient mettre l'icon en surbrillance;
      const element = screen.getByTestId("btn-new-bill");
      // -------------------------------
      element.addEventListener("click", handleClickNewBillMock);
      expect(element).toHaveTextContent("Nouvelle note de frais");
      userEvent.click(element);
      expect(handleClickNewBillMock).toHaveBeenCalled();
    });
  });
  describe("When I am on user page, there are bills, I click on blue eyes to see one of them", () => {
    test("Then, the modal is open", () => {
      //---
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      //--- On simule le localStorage
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const user = JSON.stringify({
        type: "Employee",
      });
      window.localStorage.setItem("user", user);
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
      //faire le test sur chaque icons blue eyes
    });
  });
});
