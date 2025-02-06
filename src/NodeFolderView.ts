import { ITreeNode } from "./types";

import { CARET_DOWN, CARET_RIGHT, FOLDER_CLOSED, FOLDER_OPEN, NO_CARET } from "./icons";

type NodeFolderViewArgs = {
  node: ITreeNode;
  open?: boolean;
  depth?: number;
  onClick: () => void;
}

export class NodeFolderView {
  node: ITreeNode;
  dom: HTMLLIElement;
  open: boolean;
  depth: number;
  children: NodeFolderView[] = [];
  onClick: (el: NodeFolderView) => void;

  constructor({node, open = false, depth = 0, onClick}: NodeFolderViewArgs) {
    this.node = node;
    this.open = open;
    this.depth = depth;
    this.onClick = onClick;
    if (this.node.children?.length > 0) {
      this.node.children.forEach((child) => {
        if (child.type === "folder") {
          this.children.push(new NodeFolderView({node: child, depth: depth + 1, onClick}));
        }
      });
    }
  }

  clickHandler() {
    this.onClick(this);

    if (this.open) {
      this.hideChildren();
      this.open = false;
    } else {
      this.show();
      this.open = true;
    }
    this.render();
  }

  show() {
    if (this.dom) {
      this.dom.classList?.remove("hidden");
      this.children?.forEach((child) => {
        child.show();
      });
    }
  }

  hideChildren() {
    if (this.dom) {
//      this.dom.classList.add("hidden");
      this.children?.forEach((child) => {
        child.dom?.classList?.add("hidden");
        child.hideChildren();
      });
    }
  }

  render() {
    if (!this.dom) {
      const listDiv = document.querySelector(".folder-list");
      this.dom = document.createElement("li");
      // make these button for accessibility (keyboard nav)
      const btn = this.dom.appendChild(document.createElement("button"));
      this.dom.classList.add("directory-row");
      btn.addEventListener("click", this.clickHandler.bind(this));
      listDiv.appendChild(this.dom);
      this.children.forEach((child) => {
        child.render();
      });
    }
    this.dom.querySelector("button").innerHTML = `${this.getSpace(this.depth)} ${this.getCaret()} ${this.open ? FOLDER_OPEN : FOLDER_CLOSED} ${this.node.name}`;
  }

  // TODO make this more robust, depth can't be infinite
  getSpace(depth: number): string {
    return depth > 0 ? `<i class="icon-space-${depth}"></i>` : "";
  }

  getCaret() {
    if (this.node.children?.find((c: ITreeNode) => c.type === "folder")) {
      return this.open ? CARET_DOWN : CARET_RIGHT;
    }
    return NO_CARET;
  }
}
