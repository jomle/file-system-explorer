import { ITreeNode } from "../types";

export const MOCK_FILE_SYSTEM: ITreeNode[] = [{
  type: "folder",
  name: "Files",
  modified: new Date("2021-12-17T03:24:00"),
  size: 0,
  children: [{
    type: "folder",
    name: "Documents",
    modified: new Date("2022-01-27T03:24:00"),
    size: 0,
    children: [{
      type: "folder",
      name: "workspace",
      modified: new Date("2023-11-15T03:24:00"),
      size: 0,
      children: [{
        type: "file",
        name: "code.js",
        modified: new Date("2024-12-17T03:24:00"),
        size: 14
      }]
    },
      {
        type: "file",
        name: "resume.pdf",
        modified: new Date("2024-11-15T03:24:00"),
        size: 12
      }, {
        type: "file",
        name: "expenses.csv",
        modified: new Date("2024-01-12T03:24:00"),
        size: 24
      }]
  }, {
    type: "folder",
    name: "Images",
    modified: new Date("2022-02-17T03:24:00"),
    size: 0,
    children: [{
      type: "file",
      name: "dogphoto1.jpg",
      modified: new Date("2024-04-22T11:14:00"),
      size: 235
    }, {
      type: "file",
      name: "dogphoto2.jpg",
      modified: new Date("2024-04-22T11:17:00"),
      size: 2200
    }, {
      type: "file",
      name: "dogphoto3.jpg",
      modified: new Date("2024-04-22T11:24:00"),
      size: 240
    }, {
      type: "file",
      name: "dogphoto4.jpg",
      modified: new Date("2024-04-22T11:34:00"),
      size: 1234
    }]
  },
    {
      type: "folder",
      name: "System",
      modified: new Date("2021-12-17T03:24:00"),
      size: 0,
      children: [{
        type: "folder",
        name: "Applications",
        modified: new Date("2021-12-17T03:24:00"),
        size: 0
      }, {
        type: "folder",
        name: "Library",
        modified: new Date("2021-12-17T03:24:00"),
        size: 0
      }]
    }, {
      type: "file",
      name: "soup-recipes.csv",
      modified: new Date("2022-11-15T03:24:00"),
      size: 55
    }]
}];
