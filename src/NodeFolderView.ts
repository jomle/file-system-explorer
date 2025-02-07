import { ITreeNode } from "./types";

import { CARET_DOWN, CARET_RIGHT, FOLDER_CLOSED, ICON_WIDTH } from "./icons";

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
          this.children.push(new NodeFolderView({node: child, open: true, depth: depth + 1, onClick}));
        }
      });
    }
  }

  markSelected(selected: boolean) {
    if (this.dom) {
      let oldClass = "fa-folder-open";
      let newClass = "fa-folder-closed";
      if (selected) {
        oldClass = newClass;
        newClass = "fa-folder-open";
      }
      const elem = this.dom.querySelector(`.${oldClass}`);
      elem?.classList?.remove(oldClass);
      elem?.classList?.add(newClass);
    }
  }

  /**
   * Calls the onClick method passing this instance
   */
  clickHandler() {
    this.onClick(this);
  }

  /**
   * Toggles the expand/collapse functionality.
   */
  toggleHandler() {
    this.open = !this.open;
    this.open ? this.show() : this.hideChildren();

    if (this.dom) {
      const caret = this.dom.querySelector(".caret-btn");
      caret.innerHTML = this.open ? CARET_DOWN : CARET_RIGHT;
      caret.setAttribute("aria-expanded", this.open.toString());
    }
  }

  /**
   * Removes the "hidden" class and calls the show method on children
   * if this node is open
   */
  show() {
    if (this.dom) {
      this.dom.classList?.remove("hidden");
      if (this.open) {
        this.children?.forEach((child) => {
          child.show();
        });
      }
    }
  }

  /**
   * Adds the "hidden" class and calls the hideChildren method on children
   */
  hideChildren() {
    if (this.dom) {
      this.children?.forEach((child) => {
        child.dom?.classList?.add("hidden");
        child.hideChildren();
      });
    }
  }

  render() {
    if (!this.dom) {
      const menuDiv = document.querySelector(".folder-list");
      this.dom = document.createElement("li");
      // make these button for accessibility (keyboard nav)
      const caret = this.getCaret();
      const btn = document.createElement("button");
      if (caret) {
        this.dom.appendChild(caret);
        caret.style.marginLeft = this.getMargin();
      } else {
        btn.style.marginLeft = this.getMargin();
      }
      this.dom.appendChild(btn);
      btn.classList.add("folder-btn");
      this.dom.classList.add("directory-row");
      btn.addEventListener("click", this.clickHandler.bind(this));
      menuDiv.appendChild(this.dom);
      this.children.forEach((child) => {
        child.render();
      });
    }
    this.dom.querySelector("button.folder-btn").innerHTML = `${FOLDER_CLOSED} ${this.node.name}`;
  }

  getMargin(): string {
    let factor = this.depth;
    // if no children, need to move over another spot to account for missing caret
    if (!this.node.children?.find((c: ITreeNode) => c.type === "folder")) {
      factor++;
    }
    return this.depth > 0 ? ICON_WIDTH * factor + "em" : "";
  }

  getCaret(): HTMLElement {
    if (this.node.children?.find((c: ITreeNode) => c.type === "folder")) {
      const caret = document.createElement("button");
      caret.innerHTML = this.open ? CARET_DOWN : CARET_RIGHT;
      caret.classList.add("caret-btn");
      caret.setAttribute("aria-expanded", this.open.toString());
      caret.addEventListener("click", this.toggleHandler.bind(this));
      return caret;
    }
    return null;
  }
}
