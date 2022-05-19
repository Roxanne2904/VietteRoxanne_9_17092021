import VerticalLayout from "./VerticalLayout.js";

export default (error) => {
  return `
    <div class='layout'>
      ${VerticalLayout()}
      <div class='content'>
        <div class='content-header'>
          <div data-testid="error-title" class='content-title'> Erreur </div>
        </div>
        <div data-testid="error-message">
          ${error ? error : ""}
        </div>
    </div>`;
};
