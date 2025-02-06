import { NodeRowView } from "./NodeRowView";

import { getFolders } from "./utilities";
import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";

export class App {

  selectedNode: NodeFolderView;
  allFolderViews: NodeFolderView[];

  async run() {
    const folders = await getFolders();
    this.renderFolders(folders);
    this.renderHelpText();
  }

  renderFolders(folders: ITreeNode[]) {
    this.allFolderViews = [];
    folders.forEach(f => {
      if (f.type === "folder") {
        const view = new NodeFolderView({node: f, open: true, onClick: this.handleSelect.bind(this)});
        this.allFolderViews.push(view);
        view.render();
      }
    });
  }

  handleSelect(node: NodeFolderView) {
    this.selectedNode?.markSelected(false);
    this.selectedNode = node;
    this.selectedNode.markSelected(true);
    this.renderFiles(this.selectedNode.node);
  }

  renderHelpText() {
    const tbody = document.querySelector(".file-table tbody");
    tbody.replaceChildren();
    tbody.innerHTML = `<tr><td colspan="4">Please select a folder in the left pane to view files</td>`;
  }

  renderFiles(folder: ITreeNode) {
    const tbody = document.querySelector(".file-table tbody");
    tbody.replaceChildren();
    if (folder.children?.length > 0) {
      folder.children?.forEach((f) => {
        new NodeRowView(f).render();
      });
    } else {
      // empty state message
      tbody.innerHTML = `<tr><td colspan="4">No files found in this folder</td>`;
    }
  }
}
