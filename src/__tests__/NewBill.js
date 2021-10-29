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
import { ROUTES_PATH } from "../constants/routes.js";
import firebasePost from "../__mocks__/firebasePost.js";
import { firestore_mock } from "../__mocks__/firestore_mock.js";
import Router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";
//---
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
window.location.hash = ROUTES_PATH.NewBill;
//---
//__________________________________________________________________________
//__________________________________________________________________________
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page ", () => {
    test("Then, newBill icon in vertical layout should be highlighted", () => {
      //--------------------------------
      document.body.innerHTML = `<div id="root"></div>`;
      //--------------------------------
      Router();
      //--------------------------------
      let element = screen.getByTestId("icon-mail");
      expect(element).toHaveClass("active-icon");
    });
    test("Then the NewBill's page should be displayed", () => {
      //----------------------
      const html = NewBillUI();
      document.body.innerHTML = html;
      //----------------------
      const title = screen.getByTestId("title");
      const inputType = screen.getByTestId("expense-type");
      const inputName = screen.getByTestId("expense-name");
      const inputDate = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByTestId("vat");
      const inputPct = screen.getByTestId("pct");
      const inputFile = screen.getByTestId("file");

      expect(title).toHaveTextContent("Envoyer une note de frais");
      expect(inputType).toHaveClass("form-control blue-border", {
        exact: true,
      });
      expect(inputName).toHaveAttribute("type", "text");
      expect(inputDate).toHaveAttribute("type", "date");
      expect(inputAmount).toHaveAttribute("type", "number");
      expect(inputVat).toHaveAttribute("type", "number");
      expect(inputPct).toHaveAttribute("type", "number");
      expect(inputFile).toHaveAttribute("type", "file");
    });

    // soutenance test
    describe("When I upload a correct file (jpeg,jpg or png)", () => {
      test("Then, it should render the file's name", () => {
        //----------------------
        const html = NewBillUI();
        document.body.innerHTML = html;
        //----------------------
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore: firestore_mock,
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
        expect(inputFile.files[0].name).toBe("test.jpeg");
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
          firestore: firestore_mock,
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
      describe("when, I chose a correct file (jpeg, jpg or png)", () => {
        test("Then, it should create a NewBill, and redirect me to Bill's page", () => {
          //----------------------
          const html = NewBillUI();
          document.body.innerHTML = html;
          //----------------------
          const newBill = new NewBill({
            document,
            onNavigate,
            firestore: firestore_mock,
            localStorage: window.localStorage,
          });
          //-----
          const submitBtn = screen.getByTestId("form-new-bill");
          const handleSubmitMock = jest.fn((e) => {
            newBill.handleSubmit(e);
          });
          //-----
          const inputFile = screen.getByTestId("file");
          const handleChangeFileMock = jest.fn((e) => {
            newBill.handleChangeFile(e);
          });

          inputFile.addEventListener("change", handleChangeFileMock);
          fireEvent.change(inputFile, {
            target: {
              files: [
                new File(["<(0.0)>"], "test.jpeg", { type: "image/jpeg" }),
              ],
            },
          });

          newBill.fileName = inputFile.files[0].name;

          submitBtn.addEventListener("submit", handleSubmitMock);
          fireEvent.submit(submitBtn);

          expect(handleSubmitMock).toHaveBeenCalledTimes(1);
          expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
        });
      });
      describe("when, I chose a incorrect file (.txt for example)", () => {
        test("Then, it should keep me at NewBill's Page", () => {
          //----------------------
          const html = NewBillUI();
          document.body.innerHTML = html;
          //----------------------
          const newBill = new NewBill({
            document,
            onNavigate,
            firestore: firestore_mock,
            localStorage: window.localStorage,
          });
          //-----
          const submitBtn = screen.getByTestId("form-new-bill");
          const handleSubmitMock = jest.fn((e) => {
            newBill.handleSubmit(e);
          });
          //-----
          const inputFile = screen.getByTestId("file");
          const handleChangeFileMock = jest.fn((e) => {
            newBill.handleChangeFile(e);
          });

          inputFile.addEventListener("change", handleChangeFileMock);
          fireEvent.change(inputFile, {
            target: {
              files: [new File(["<(0.0)>"], "test.txt", { type: "text/txt" })],
            },
          });

          const array = ["jpeg", "jpg", "png"];
          if (array.includes(inputFile.files[0].name)) {
            newBill.fileName = inputFile.files[0].name;
          } else {
            newBill.fileName = null;
          }

          submitBtn.addEventListener("submit", handleSubmitMock);
          fireEvent.submit(submitBtn);

          expect(handleSubmitMock).toHaveBeenCalledTimes(1);
          expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
        });
      });
    });
  });
});

// test d'intégration POST
//----
describe("Given I am a user connected as an Employee", () => {
  describe("When I have just created a newBill, and I Have been redirected to Bill's page", () => {
    test("Then, new bill is created, from mock API POST", async () => {
      //---
      const obj = {
        email: "test@mail.fr",
        type: "Transport",
        name: "Vol Paris-Brasilia",
        amount: 1000,
        vat: 70,
        pct: 20,
        commentary: "hello :D",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/bill-rox.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        fileName: "bill-rox.jpg",
        status: "pending",
      };
      //---
      const getSpy = jest.spyOn(firebasePost, "post");
      const bill = await firebasePost.post(obj);
      console.log(bill);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bill.newData.length).toBe(1);
    });
    test("Then, new bill is created, from an API and fails with 404 message error", async () => {
      firebasePost.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Then, new bill is created, from an API and fails with 500 message error", async () => {
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
