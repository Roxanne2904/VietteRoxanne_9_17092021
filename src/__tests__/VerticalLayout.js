/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
//---
import { screen } from "@testing-library/dom";
import VerticalLayout from "../views/VerticalLayout";
import router from "../__mocks__/router_mock.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
// ----
window.location.hash = ROUTES_PATH.Bills;
// ----
describe("Given I am connected as Employee", () => {
  test("Then Icons should be rendered", () => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);
    const html = VerticalLayout(120);
    document.body.innerHTML = html;
    expect(screen.getByTestId("icon-window")).toBeTruthy();
    expect(screen.getByTestId("icon-mail")).toBeTruthy();
  });

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
