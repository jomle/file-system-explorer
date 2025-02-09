import { App } from "./App";
import { FETCH_ERROR, NO_FILES_FOUND, NO_FOLDER_SELECTED } from "./text";
import * as utilities from "./utilities";
import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";
import { NodeRowView } from "./NodeRowView";

function initializeDocumentBody() {
  // Set up our document body
  document.body.innerHTML = `
<div id="app" class="app-container">
  <menu id="left-pane" class="folder-list">
  </menu>
  <div id="right-pane" class="file-list">
    <table class="file-table">
      <tbody></tbody>
    </table><template id="node-row">
      <tr class="file-row">
        <td class="file-icon"></td>
        <td class="file-name">
          <button class="file-name-btn"></button>
        </td>
        <td class="file-date"></td>
        <td class="file-size"></td>
      </tr>
    </template>
  </div>
</div>`;
}

beforeEach(() => {
  initializeDocumentBody();
  jest.restoreAllMocks();
});

test("run should render error when getFolders fails", async () => {
  jest.spyOn(utilities, "getFolders").mockRejectedValue("error");
  await new App().run();
  expect(document.querySelector(".help-text").textContent).toBe(FETCH_ERROR);
});

test("run should render help text if no errors", async () => {
  await new App().run();
  expect(document.querySelector(".help-text").textContent).toBe(NO_FOLDER_SELECTED);
});

test("renderFolders should only render folders", () => {
  const nfvSpy = jest.spyOn(NodeFolderView.prototype, "render");
  new App().renderFolders(MIXED_NODES);
  expect(nfvSpy).toHaveBeenCalledTimes(3);
});

test("handleSelect unmarks previous selected node", () => {
  const lastSelected = new NodeFolderView({node: MIXED_NODES[0], onClick: jest.fn()});
  const newSelected = new NodeFolderView({node: FOLDER_NODE, onClick: jest.fn()});
  const spy = jest.spyOn(lastSelected, "markSelected");

  const app = new App();
  app.selectedNode = lastSelected;
  app.handleSelect(newSelected);

  expect(spy).toHaveBeenCalledWith(false);
});

test("handleSelect calls markSelected on arg", () => {
  const newSelected = new NodeFolderView({node: FOLDER_NODE, onClick: jest.fn()});
  const spy = jest.spyOn(newSelected, "markSelected");

  const app = new App();
  app.handleSelect(newSelected);

  expect(spy).toHaveBeenCalledWith(true);
});

test("handleSelectRightPane does not call handleSelect if node is not a folder", () => {
  const nrv = new NodeRowView({node: FILE_NODE, onClick: jest.fn()});
  const app = new App();
  const spy = jest.spyOn(app, "handleSelect");
  app.handleSelectRightPane(nrv);
  expect(spy).not.toHaveBeenCalled();
});

test("handleSelectRightPane calls handleSelect if node is a folder", () => {
  const nrv = new NodeRowView({node: MIXED_NODES[0].children[0], onClick: jest.fn()});
  const lastSelected = new NodeFolderView({node: MIXED_NODES[0], open: true, onClick: jest.fn()});

  const app = new App();
  const spy = jest.spyOn(app, "handleSelect");

  app.selectedNode = lastSelected;
  app.handleSelectRightPane(nrv);

  expect(spy).toHaveBeenCalledWith(lastSelected.children[0]);
});

test("handleSelectRightPane calls handleOpenToggle if selectedNode not open", () => {
  const nrv = new NodeRowView({node: MIXED_NODES[0].children[0], onClick: jest.fn()});
  const lastSelected = new NodeFolderView({node: MIXED_NODES[0], open: false, onClick: jest.fn()});

  const app = new App();
  const spy = jest.spyOn(lastSelected, "handleOpenToggle");

  app.selectedNode = lastSelected;
  app.handleSelectRightPane(nrv);

  expect(spy).toHaveBeenCalled();
});

test("renderHelpText renders given text", () => {
  const text = "Goats!";
  new App().renderHelpText(text);
  expect(document.querySelector(".help-text").textContent).toBe(text);
});

test("renderFiles renders no files found message if node contains no children", () => {
  const emptyFolder: ITreeNode = {
    type: "folder",
    name: "Dog",
    modified: new Date("2024-04-22T11:18:00"),
    size: 0
  };
  const app = new App();
  const spy = jest.spyOn(app, "renderHelpText");
  app.renderFiles(emptyFolder);
  expect(spy).toHaveBeenCalledWith(NO_FILES_FOUND);
});

test("renderFiles should create NodeRowViews for each children of given folder", () => {
  const nrvSpy = jest.spyOn(NodeRowView.prototype, "render");
  new App().renderFiles(MIXED_NODES[0]);
  expect(nrvSpy).toHaveBeenCalledTimes(MIXED_NODES[0].children.length);
});

test("renderFiles should clear tbody before rendering", () => {
  const app = new App();
  app.renderFiles(MIXED_NODES[0]);
  expect(document.querySelectorAll(".file-table tbody tr").length).toBe(MIXED_NODES[0].children.length);

  app.renderFiles(MIXED_NODES[0].children[0]);
  expect(document.querySelectorAll(".file-table tbody tr").length).toBe(MIXED_NODES[0].children[0].children.length);
});


const FILE_NODE: ITreeNode = {
  type: "file",
  name: "puppy.jpg",
  modified: new Date("2024-04-22T11:18:00"),
  size: 550
};

const FOLDER_NODE: ITreeNode = {
  type: "folder",
  name: "Dog",
  modified: new Date("2024-04-22T11:18:00"),
  size: 0,
  children: [{
    type: "file",
    name: "puppy.jpg",
    modified: new Date("2024-04-22T11:18:00"),
    size: 550
  }, {
    type: "file",
    name: "puppy2.jpg",
    modified: new Date("2024-04-22T11:18:00"),
    size: 550
  }]
};

const MIXED_NODES: ITreeNode[] = [{
  type: "folder",
  name: "Millie",
  modified: new Date("2024-04-22T11:18:00"),
  size: 0,
  children: [{
    type: "folder",
    name: "puppy photos",
    modified: new Date("2024-04-22T11:18:00"),
    size: 0,
    children: [{
      type: "file",
      name: "puppy.jpg",
      modified: new Date("2024-04-22T11:18:00"),
      size: 550
    }, {
      type: "file",
      name: "puppy2.jpg",
      modified: new Date("2024-04-22T11:18:00"),
      size: 550
    }]
  }]
}, {
  type: "file",
  name: "goats.jpg",
  modified: new Date("2024-04-22T11:18:00"),
  size: 155
}, {
  type: "folder",
  name: "Documents",
  modified: new Date("2024-04-22T11:18:00"),
  size: 0
}];
