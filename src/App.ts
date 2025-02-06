import { NodeRowView } from "./NodeRowView";

import { getFolders } from "./utilities";
import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";

export class App {

  async run() {
    const folders = await getFolders();
    folders[0].children.forEach((f) => {
      new NodeRowView(f).render();
    });
    this.renderFolders(folders);
  }

  renderFolders(folders: ITreeNode[], depth: number = 0) {
    folders.forEach(f => {
      if (f.type === "folder") {
        new NodeFolderView(f).render(depth);
        if (f.children?.length > 0) {
          this.renderFolders(f.children, depth + 1);
        }
      }
    });
  }
}
