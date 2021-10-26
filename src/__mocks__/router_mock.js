import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import { storage } from "..//__mocks__/firestore-getBills.js";
// const storage = {
//   bills: () => storage,
//   get: async () => {
//     return {
//       docs: bills,
//     };
//   },
// };
//
export default () => {
  const rootDiv = document.getElementById("root");
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });

  window.onNavigate = (pathname) => {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    if (pathname === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.add("active-icon");
      divIcon2.classList.remove("active-icon");
      //---
      const bills = new Bills({
        document,
        onNavigate,
        firestore,
        localStorage,
      });
      bills
        .getBills()
        .then((data) => {
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById("layout-icon1");
          const divIcon2 = document.getElementById("layout-icon2");
          divIcon1.classList.add("active-icon");
          divIcon2.classList.remove("active-icon");
          new Bills({ document, onNavigate, firestore, localStorage });
        })
        .catch((error) => {
          rootDiv.innerHTML = ROUTES({ pathname, error });
        });
    }
  };

  window.onpopstate = (e) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.location.pathname === "/" && !user) {
      document.body.style.backgroundColor = "#0E5AE5";
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname });
    } else if (user) {
      onNavigate(PREVIOUS_LOCATION);
    }
  };

  if (window.location.hash !== "") {
    if (window.location.hash === ROUTES_PATH["Bills"]) {
      rootDiv.innerHTML = ROUTES({
        pathname: window.location.hash,
        loading: true,
      });
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.add("active-icon");
      divIcon2.classList.remove("active-icon");
      //---
      const bills = new Bills({
        document,
        onNavigate,
        firestore: storage,
        localStorage,
      });
      bills
        .getBills()
        .then((data) => {
          rootDiv.innerHTML = BillsUI({ data });
          const divIcon1 = document.getElementById("layout-icon1");
          const divIcon2 = document.getElementById("layout-icon2");
          divIcon1.classList.add("active-icon");
          divIcon2.classList.remove("active-icon");
          new Bills({ document, onNavigate, firestore, localStorage: storage });
        })
        .catch((error) => {
          rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, error });
        });
    }
  }
  return null;
};
