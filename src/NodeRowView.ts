import { ITreeNode } from "./types";
import { FILE_ICON, FOLDER_CLOSED } from "./icons";

export class NodeRowView {
  node: ITreeNode;
  dom: DocumentFragment;

  constructor(node: ITreeNode) {
    this.node = node;
  }

  render() {
    const tbody = document.querySelector(".file-table tbody");
    if (!this.dom) {
      const template: HTMLTemplateElement = document.getElementById("node-row") as HTMLTemplateElement;
      this.dom = template.content.cloneNode(true) as DocumentFragment;
    }
    let td = this.dom.querySelectorAll("td");
    td[0].innerHTML = this.node.type === "folder" ? FOLDER_CLOSED : FILE_ICON;
    td[1].textContent = this.node.name;
    td[2].textContent = this.node.modified.toLocaleDateString();
    td[3].textContent = (this.node.type === "file") ? this.node.size.toString() + " KB" : "";
    tbody.appendChild(this.dom);
  }
}
