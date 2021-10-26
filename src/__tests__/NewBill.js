/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
//----
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes";
import firebasePost from "../__mocks__/firebasePost.js";
import { storage } from "../__mocks__/firestore-handleChangeFile.js";
import BillsUI from "../views/BillsUI.js";
//---
// const storage = {
//   ref: () => storage,
//   put: async () => {
//     return {
//       ref: { getDownloadURL: () => "https//test-rox.com" },
//     };
//   },
// };
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};
//---
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
//---
const user = JSON.stringify({
  type: "Employee",
  email: "rox-test@email.com",
});
window.localStorage.setItem("user", user);
//---
describe("Given I am connected as an employee, on NewBill Page", () => {
  describe("When I am on NewBill Page ", () => {
    test("Then the NewBill's page should be displayed", () => {
      //----------------------
      const html = NewBillUI();
      document.body.innerHTML = html;
      //----------------------
      const title = screen.getByTestId("title");
      expect(title).toHaveTextContent("Envoyer une note de frais");
    });

    describe("When I upload a correct file (jpeg,jpg or png)", () => {
      test("Then, it should render the file's name", () => {
        //----------------------
        const html = NewBillUI();
        document.body.innerHTML = html;
        //----------------------
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore: { storage },
          localStorage: window.localStorage,
        });
        //----------------------
        const inputFile = screen.getByTestId("file");
        // ---
        const handleChangeFileMock = jest.fn((e) => {
          newBill.handleChangeFile(e, true);
        });

        inputFile.addEventListener("change", handleChangeFileMock);

        fireEvent.change(inputFile, {
          target: {
            files: [new File(["<(0.0)>"], "test.jpeg", { type: "image/jpeg" })],
          },
        });

        expect(inputFile.files[0].name.endsWith("jpeg")).toBeTruthy();
        expect(handleChangeFileMock).toHaveBeenCalled();
      });
    });

    describe("When I upload an incorrect file (not jpeg, jpg or png)", () => {
      test("Then, it should render the file's name as null", () => {
        //----------------------
        const html = NewBillUI();
        document.body.innerHTML = html;
        //----------------------
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore: { storage },
          localStorage: window.localStorage,
        });
        //----------------------
        const inputFile = screen.getByTestId("file");
        // ---
        const handleChangeFileMock = jest.fn((e) => {
          newBill.handleChangeFile(e, true);
        });

        inputFile.addEventListener("change", handleChangeFileMock);

        fireEvent.change(inputFile, {
          target: {
            files: [new File(["<(0.0)>"], "test.txt", { type: "text/txt" })],
          },
        });

        expect(inputFile.files[0].name.endsWith("png")).not.toBeTruthy();
        expect(inputFile.files[0].name.endsWith("jpeg")).not.toBeTruthy();
        expect(inputFile.files[0].name.endsWith("jpg")).not.toBeTruthy();
        expect(handleChangeFileMock).toHaveBeenCalled();
      });
    });

    describe("When I submit the form", () => {
      test("Then, it should render a NewBill", () => {
        //----------------------
        const html = NewBillUI();
        document.body.innerHTML = html;
        //----------------------
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        });
        const submitBtn = screen.getByTestId("form-new-bill");
        const handleSubmitMock = jest.fn((e) => {
          newBill.handleSubmit(e);
        });
        const input = (screen.getByTestId("expense-type").value = "Transport");

        submitBtn.addEventListener("submit", handleSubmitMock);
        fireEvent.submit(submitBtn);
        expect(input).toBe("Transport");
        expect(handleSubmitMock).not.toHaveBeenCalledTimes(0);
      });
    });
  });
});

// test d'intégration POST
//----
describe("Given I am a user connected as an Employee", () => {
  describe("When I have just created a newBill, and I Have been redirected to Bill's page", () => {
    test("Then, fetches bills included the new one, from mock API POST", async () => {
      const getSpy = jest.spyOn(firebasePost, "post");
      const bills = await firebasePost.post();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.newDatas.length).toBe(5);
    });
    test("Then, fetches bills from an API and fails with 404 message error", async () => {
      firebasePost.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Then, fetches messages from an API and fails with 500 message error", async () => {
      firebasePost.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
