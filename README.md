# File System Explorer

This is a mock file system UI. Directories are displayed in the left pane and files from the currently
selected directory in the right pane. Directories can be selected in either pane.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install. Developed with Node version 20.15.0.

```
npm install
```

## Running

```
npm start
```

## Testing

To run tests:

```
npm test
npm test:coverage
```

## Notes

- Additional testing utilizing an e2e framework such as Playwright would be helpful to fully test
  clicking in the left and right panes have the desired effects in the DOM.
- Buttons were utilized for selecting directories in both the left and right panes for keyboard accessibility.
  I started by making the right pane rows clickable, but everything I read said it was terrible for accessibility
  so I transitioned to just make the file name a button, which is more accessible. More work on accessibility is needed.
- The selected directory is denoted with a file open icon, but the user could potentially collapse a parent
  directory in the left pane, making it difficult to see which directory is selected. Ideally I would suggest
  adding some header text in the right pane indicating the full path of the directory being displayed
  (e.g. Files -> Images -> Dog Photos)
- Sorting the file list by the table column headers would be a nice feature to add.
