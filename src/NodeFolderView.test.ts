import { ITreeNode } from "./types";
import { NodeFolderView } from "./NodeFolderView";
import { FOLDER_CLOSED, FOLDER_OPEN, ICON_WIDTH } from "./icons";
import SpyInstance = jest.SpyInstance;

function initializeDocumentBody() {
  // Set up our document body
  document.body.innerHTML =
    `<menu id="left-pane" class="folder-list">
  </menu>`;
}

beforeEach(() => {
  initializeDocumentBody();
});

test("constructor creates NodeFolderView for folder children", () => {
  const nfv = new NodeFolderView({node: NODE, onClick: jest.fn()});
  expect(nfv.children.length).toBe(2);
});

test("constructor handles no children", () => {
  const nfv = new NodeFolderView({
    node: {
      type: "folder",
      name: "Images",
      modified: new Date("2024-01-22T11:18:00"),
      size: 0
    }, onClick: jest.fn()
  });
  expect(nfv.children.length).toBe(0);
});

test("markSelected sets open folder when true", () => {
  const nfv = new NodeFolderView({node: NODE, onClick: jest.fn()});
  nfv.dom = document.createElement("li");
  nfv.dom.innerHTML = FOLDER_CLOSED;
  nfv.markSelected(true);
  expect(nfv.dom.querySelector(".fa-folder-open")).toBeDefined();
  expect(nfv.dom.querySelector(".fa-folder-closed")).toBeNull();
});

test("markSelected sets closed folder when false", () => {
  const nfv = new NodeFolderView({node: NODE, onClick: jest.fn()});
  nfv.dom = document.createElement("li");
  nfv.dom.innerHTML = FOLDER_OPEN;
  nfv.markSelected(false);
  expect(nfv.dom.querySelector(".fa-folder-open")).toBeNull();
  expect(nfv.dom.querySelector(".fa-folder-closed")).toBeDefined();
});

test("handleClick calls onClick with this", () => {
  const mockCallback = jest.fn((x: NodeFolderView): void => undefined);
  const nfv = new NodeFolderView({node: NODE, onClick: mockCallback});
  nfv.handleClick();

  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback).toHaveBeenCalledWith(nfv);
});

test("handleOpenToggle sets the correct caret icon when open", () => {
  const nfv = new NodeFolderView({node: NODE, open: true, onClick: jest.fn()});
  nfv.render();
  nfv.handleOpenToggle();

  expect(nfv.dom.querySelector(".fa-caret-right")).toBeDefined();
  expect(nfv.dom.querySelector(".fa-caret-down")).toBeNull();
});

test("handleOpenToggle sets the correct caret icon when not open", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  nfv.render();
  nfv.handleOpenToggle();

  expect(nfv.dom.querySelector(".fa-caret-right")).toBeNull();
  expect(nfv.dom.querySelector(".fa-caret-down")).toBeDefined();
});

test("show removes hidden class", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  nfv.render();
  nfv.dom.classList.add("hidden");
  nfv.show();
  expect(nfv.dom.classList.contains("hidden")).toBe(false);
});

test("show calls show on children when open is true", () => {
  const nfv = new NodeFolderView({node: NODE, open: true, onClick: jest.fn()});
  nfv.render();
  nfv.dom.classList.add("hidden");
  const spies: SpyInstance[] = [];
  nfv.children.forEach((c) => {
    spies.push(jest.spyOn(c, "show"));
  });

  expect(spies.length).toBe(2);
  nfv.show();

  spies.forEach((spy) => {
    expect(spy).toBeCalled();
  });
});

test("show does not call show on children when open is false", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  nfv.render();
  nfv.dom.classList.add("hidden");
  const spies: SpyInstance[] = [];
  nfv.children.forEach((c) => {
    spies.push(jest.spyOn(c, "show"));
  });

  expect(spies.length).toBe(2);
  nfv.show();

  spies.forEach((spy) => {
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

test("hideChildren adds the hidden class to children and calls hideChildren on children", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  nfv.render();
  const spies: SpyInstance[] = [];

  nfv.children.forEach((c) => {
    spies.push(jest.spyOn(c, "hideChildren"));
    expect(c.dom.classList.contains("hidden")).toBe(false);
  });

  nfv.hideChildren();
  nfv.children.forEach((c) => {
    expect(c.dom.classList.contains("hidden")).toBe(true);
  });
  spies.forEach((spy) => {
    expect(spy).toHaveBeenCalled();
  });
});

test("render adds caret button if children contains a folder", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  nfv.render();

  expect(nfv.dom.querySelector("button.caret-btn")).toBeDefined();
});

test("render does not add caret button if no children are folders", () => {
  const nfv = new NodeFolderView({
    node: NODE_NO_FOLDER_CHILDREN, open: false, onClick: jest.fn()
  });
  nfv.render();

  expect(nfv.dom.querySelector("button.caret-btn")).toBeNull();
});

test("render calls render on children", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  const spies: SpyInstance[] = [];

  nfv.children.forEach((c) => {
    spies.push(jest.spyOn(c, "render"));
  });

  nfv.render();

  spies.forEach((spy) => {
    expect(spy).toHaveBeenCalled();
  });
});

test("getMargin returns extra width if no children are folders", () => {
  const nfv = new NodeFolderView({
    node: NODE_NO_FOLDER_CHILDREN, depth: 1, open: false, onClick: jest.fn()
  });

  expect(nfv.getMargin()).toEqual(2 * ICON_WIDTH + "em");
});

test("getMargin returns correct value if at least one child is a folders", () => {
  const nfv = new NodeFolderView({
    node: NODE, depth: 3, open: false, onClick: jest.fn()
  });

  expect(nfv.getMargin()).toEqual(3 * ICON_WIDTH + "em");
});

test("getMargin returns empty string if depth is 0", () => {
  const nfv = new NodeFolderView({
    node: NODE, depth: 0, open: false, onClick: jest.fn()
  });

  expect(nfv.getMargin()).toEqual("");
});

test("getCaretBtnOrNull returns null when no children are folders", () => {
  const nfv = new NodeFolderView({node: NODE_NO_FOLDER_CHILDREN, onClick: jest.fn()});
  expect(nfv.getCaretBtnOrNull()).toBeNull();
});

test("getCaretBtnOrNull returns caret when children has at least one folder", () => {
  const nfv = new NodeFolderView({node: NODE, onClick: jest.fn()});
  expect(nfv.getCaretBtnOrNull()).toBeDefined();
});

test("getCaretBtnOrNull returns down caret when open", () => {
  const nfv = new NodeFolderView({node: NODE, open: true, onClick: jest.fn()});
  expect(nfv.getCaretBtnOrNull().querySelector(".fa-caret-down")).toBeDefined();
  expect(nfv.getCaretBtnOrNull().querySelector(".fa-caret-right")).toBeNull();
});

test("getCaretBtnOrNull returns right caret when not open", () => {
  const nfv = new NodeFolderView({node: NODE, open: false, onClick: jest.fn()});
  expect(nfv.getCaretBtnOrNull().querySelector(".fa-caret-right")).toBeDefined();
  expect(nfv.getCaretBtnOrNull().querySelector(".fa-caret-down")).toBeNull();
});

const NODE: ITreeNode = {
  type: "folder",
  name: "Images",
  modified: new Date("2024-01-22T11:18:00"),
  size: 0,
  children: [
    {
      type: "folder",
      name: "Vacation",
      modified: new Date("2024-03-12T11:18:00"),
      size: 0,
      children: [{
        type: "folder",
        name: "2023",
        modified: new Date("2023-01-01T11:18:00"),
        size: 0
      }]
    }, {
      type: "folder",
      name: "Millie",
      modified: new Date("2024-04-22T11:18:00"),
      size: 0,
      children: [{
        type: "file",
        name: "puppy.jpg",
        modified: new Date("2024-04-22T11:18:00"),
        size: 550
      }]
    }, {
      type: "file",
      name: "goats.jpg",
      modified: new Date("2024-02-22T11:18:00"),
      size: 247
    }
  ]
};

const NODE_NO_FOLDER_CHILDREN: ITreeNode = {
  type: "folder",
  name: "Millie",
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
