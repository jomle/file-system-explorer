import { NodeRowView } from "./NodeRowView";

import { getFolders } from "./utilities";
import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";

export class App {

  selectedNode: NodeFolderView;
  allFolderViews: NodeFolderView[];

  /**
   * Runs the app. Retrieves file system information and renders folders in the
   * left pane and help text in the right pane.
   */
  async run() {
    const folders = await getFolders();
    this.renderFolders(folders);
    this.renderHelpText();
  }

  /**
   * Renders given folders in the left pane
   * @param folders - Array of ITreeNodes to render folders for
   */
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

  /**
   * Handles selecting a directory in the left pane. Renders the files in the selected
   * directory in the right pane.
   * @param nfv - NodeFolderView that was selected
   */
  handleSelect(nfv: NodeFolderView) {
    this.selectedNode?.markSelected(false);
    this.selectedNode = nfv;
    this.selectedNode.markSelected(true);
    this.renderFiles(this.selectedNode.node);
  }

  /**
   * Handles selecting a directory in the right pane. Displays the directory as selected
   * in the left pane and renders the files in that directory.
   * @param nrv - NodeRowView that was selected
   */
  handleSelectRightPane(nrv: NodeRowView) {
    console.log(nrv);
    const {name, type} = nrv.node;
    if (type === "folder") {
      const selected = this.selectedNode.children.find((nfv) => nfv.node.name === name);
      this.handleSelect(selected);
    }
  }

  /**
   * Renders help text in the right pane telling the user to select a folder in the left pane
   */
  renderHelpText() {
    const tbody = document.querySelector(".file-table tbody");
    tbody.replaceChildren();
    tbody.innerHTML = `<tr><td colspan="4" class="help-text">Please select a folder in the left pane to view files</td>`;
  }

  /**
   * Renders child files of the given folder in the right pane or displays an empty state
   * message
   * @param folder - ITreeNode to display children for
   */
  renderFiles(folder: ITreeNode) {
    const tbody = document.querySelector(".file-table tbody");
    tbody.replaceChildren();
    if (folder.children?.length > 0) {
      folder.children?.forEach((f) => {
        new NodeRowView({node: f, onClick: this.handleSelectRightPane.bind(this)}).render();
      });
    } else {
      // empty state message
      tbody.innerHTML = `<tr><td colspan="4" class="help-text">No files found in this folder</td>`;
    }
  }
}
