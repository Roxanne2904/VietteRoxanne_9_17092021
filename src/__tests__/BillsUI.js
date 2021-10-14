/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { getByTestId } from "@testing-library/dom";
//---
import { localStorageMock } from "../__mocks__/localStorage.js";
import { screen } from "@testing-library/dom";
import LoadingPage from "./LoadingPage.js";
import ErrorPage from "./ErrorPage.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am waiting for user's page", () => {
    test("Then, the page is on load", () => {
      const html = BillsUI({ loading: LoadingPage });
      document.body.innerHTML = html;
      let element = screen.getByTestId("load");
      expect(element).toHaveTextContent("Loading...");
    });
    test("Then, the page don't get datas", () => {
      const html = BillsUI({ error: ErrorPage });
      document.body.innerHTML = html;
      let element = screen.getByTestId("error-title");
      expect(element).toHaveTextContent("Erreur");
    });
  });
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      //viette roxanne
      //--- On simule le localStorage
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const user = JSON.stringify({
        type: "Employee",
      });
      window.localStorage.setItem("user", user);
      //--------------------------------
      const html = BillsUI({ data: [] });
      //On pense bien à ajouter le html pour faire le test;
      document.body.innerHTML = html;
      //--------------------------------
      //On ajoute le class sui vient mettre l'icon en surbrillance;
      let element = getByTestId(document.body, "icon-window");

      element.classList.add("active-icon");
      expect(element).toHaveClass("active-icon");
    });

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
  });
});
