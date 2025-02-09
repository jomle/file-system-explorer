import { NodeRowView } from "./NodeRowView";

import { getFolders } from "./utilities";
import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";
import { FETCH_ERROR, NO_FILES_FOUND, NO_FOLDER_SELECTED } from "./text";

export class App {

  selectedNode: NodeFolderView;
  allFolderViews: NodeFolderView[];

  /**
   * Runs the app. Retrieves file system information and renders folders in the
   * left pane and help text in the right pane.
   */
  async run() {
    try {
      const folders = await getFolders();
      this.renderFolders(folders);
      this.renderHelpText(NO_FOLDER_SELECTED);
    } catch (error) {
      this.renderHelpText(FETCH_ERROR);
    }
  }

  /**
   * Renders given folders in the left pane
   * @param nodes - Array of ITreeNodes to render folders for
   */
  renderFolders(nodes: ITreeNode[]) {
    this.allFolderViews = [];
    nodes.forEach((node) => {
      if (node.type === "folder") {
        const view = new NodeFolderView({node, open: true, onClick: this.handleSelect.bind(this)});
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
    const {name, type} = nrv.node;
    if (type === "folder") {
      if (this.selectedNode) {
        // if the selected node isn't open, open it because a child
        // is now selected and you wouldn't see it in the left pane
        if (!this.selectedNode.open) {
          this.selectedNode.handleOpenToggle();
        }
        const selected = this.selectedNode.children.find((nfv) => nfv.node.name === name);
        this.handleSelect(selected);
      }
    }
  }

  /**
   * Renders help text in the right pane telling the user to select a folder in the left pane
   */
  renderHelpText(text: string) {
    const tbody = document.querySelector(".file-table tbody");
    tbody.replaceChildren();
    tbody.innerHTML = `<tr><td colspan="4" class="help-text">${text}</td>`;
  }

  /**
   * Renders child files of the given folder in the right pane or displays an empty state
   * message
   * @param folder - ITreeNode to display children for
   */
  renderFiles(folder: ITreeNode) {
    if (folder.children?.length > 0) {
      const tbody = document.querySelector(".file-table tbody");
      tbody.replaceChildren();
      folder.children?.forEach((f) => {
        new NodeRowView({node: f, onClick: this.handleSelectRightPane.bind(this)}).render();
      });
    } else {
      // empty state message
      this.renderHelpText(NO_FILES_FOUND);
    }
  }
}
