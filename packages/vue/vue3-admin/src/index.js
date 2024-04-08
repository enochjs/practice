import {
 
  WidgetType,
} from "@codemirror/view";

export class PlaceholderWidget extends WidgetType {
  constructor(name) {
    super();
    this.name = name;
  }
  eq(other) {
    return this.name == other.name;
  }
  toDOM() {
    let elt = document.createElement("span");
    elt.style.cssText = `
      border: 1px solid blue;
      border-radius: 4px;
      padding: 0 3px;
      background: lightblue;`;
    elt.textContent = this.name;
    return elt;
  }
  ignoreEvent() {
    return false;
  }
}
