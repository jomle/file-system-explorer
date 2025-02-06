import { ITreeNode } from "./types";

import { CARET_DOWN, FOLDER_CLOSED, NO_CARET } from "./icons";

export class NodeFolderView {
  node: ITreeNode;
  dom: DocumentFragment;

  constructor(node: ITreeNode) {
    this.node = node;
  }

  render(depth: number, open: boolean = false) {
    if (!this.dom) {
      const listDiv = document.querySelector(".folder-list");
      this.dom = document.createDocumentFragment();
      const div = document.createElement("div");
      div.innerHTML = `${this.getSpace(depth)} ${this.getCaret()} ${FOLDER_CLOSED} ${this.node.name}`;
      this.dom.appendChild(div);
      listDiv.appendChild(this.dom);
    }
  }

  // TODO make this more robust, depth can't be infinite
  getSpace(depth: number): string {
    return depth > 0 ? `<i class="icon-space-${depth}"></i>` : "";
  }

  getCaret() {
    if (this.node.children?.find((c: ITreeNode) => c.type === "folder")) {
      return CARET_DOWN;
    }
    return NO_CARET;
  }
}
