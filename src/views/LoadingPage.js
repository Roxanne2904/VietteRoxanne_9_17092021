import VerticalLayout from "./VerticalLayout.js";

export default () => {
  return `
    <div class='layout'>
      ${VerticalLayout()}
      <div data-testid="load" class='content' id='loading'>
        Loading...
      </div>
    </div>`;
};
