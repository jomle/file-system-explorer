import { NodeRowView } from "./NodeRowView";

function initializeDocumentBody() {
  // Set up our document body
  document.body.innerHTML =
    `<table class="file-table">
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
    </template>`;
}

beforeEach(() => {
  initializeDocumentBody();
});

test("handleClick should call onClick", () => {
  const mockCallback = jest.fn((x: NodeRowView) => x);
  const nrv = new NodeRowView({
    node: {type: "file", name: "photo.jpg", modified: new Date(), size: 57},
    onClick: mockCallback
  });
  nrv.handleClick();
  expect(mockCallback.mock.calls.length).toBe(1);
  expect(mockCallback).toHaveBeenCalledWith(nrv);
});

test("renders file information", () => {
  const mockCallback = jest.fn((x: NodeRowView) => x);
  const date = new Date();
  const nrv = new NodeRowView({
    node: {type: "file", name: "photo.jpg", modified: date, size: 57},
    onClick: mockCallback
  });

  nrv.render();
  expect(document.querySelector("button")).toBeNull();
  expect(document.querySelector(".fa-file")).toBeDefined();
  expect(document.querySelector(".file-name").textContent).toBe("photo.jpg");
  expect(document.querySelector(".file-date").textContent).toBe(date.toLocaleDateString());
  expect(document.querySelector(".file-size").textContent).toBe("57 KB");
});

describe("renders folder information", () => {
  const date = new Date();
  const mockCallback = jest.fn((x: NodeRowView) => x);
  let nrv: NodeRowView;

  beforeEach(() => {
    initializeDocumentBody();

    nrv = new NodeRowView({
      node: {type: "folder", name: "Documents", modified: date, size: 78},
      onClick: mockCallback
    });
    nrv.render();
  });

  afterEach(() => {
    mockCallback.mockClear();
  });


  test("renders a button with the file name", () => {
    expect(document.querySelector("button")).toBeDefined();
    expect(document.querySelector(".file-name button").textContent).toBe("Documents");
  });
  test("does not render a file icon", () => {
    expect(document.querySelector(".fa-file")).toBeNull();
  });
  test("renders a closed folder icon", () => {
    expect(document.querySelector(".fa-folder-closed")).toBeDefined();
  });
  test("renders the date", () => {
    expect(document.querySelector(".file-date").textContent).toBe(date.toLocaleDateString());
  });
  test("does not render file size", () => {
    expect(document.querySelector(".file-size").textContent).toBe("");
  });

  test("file name click calls onClick", () => {
    const btn: HTMLButtonElement = document.querySelector(".file-name button");
    btn.click();
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback).toHaveBeenCalledWith(nrv);
  });
});
