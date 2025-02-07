import { ITreeNode } from "./types";
import { FILE_ICON, FOLDER_CLOSED } from "./icons";

type NodeRowViewArgs = {
  node: ITreeNode;
  onClick: (nrv: NodeRowView) => void;
}

export class NodeRowView {
  node: ITreeNode;
  dom: DocumentFragment;
  onClick: (nrv: NodeRowView) => void;

  constructor({node, onClick}: NodeRowViewArgs) {
    this.node = node;
    this.onClick = onClick;
  }

  handleClick() {
    this.onClick(this);
  }

  render() {
    const tbody = document.querySelector(".file-table tbody");
    if (!this.dom) {
      const template: HTMLTemplateElement = document.getElementById("node-row") as HTMLTemplateElement;
      this.dom = template.content.cloneNode(true) as DocumentFragment;
      this.dom.querySelector("tr").addEventListener("click", this.handleClick.bind(this));
    }
    let td = this.dom.querySelectorAll("td");
    td[0].innerHTML = this.node.type === "folder" ? FOLDER_CLOSED : FILE_ICON;
    td[1].textContent = this.node.name;
    td[2].textContent = this.node.modified?.toLocaleDateString();
    // assuming these are in KB, ideally they are bytes and the label is formatted accordingly (e.g. KB, MB, GB)
    td[3].textContent = (this.node.type === "file") ? this.node.size.toString() + " KB" : "";
    tbody.appendChild(this.dom);
  }
}
