// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
let mainWindow = false;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      // preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hidden",
  });

  const isMac = process.platform === "darwin";

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        // {
        //   label: "Open File",
        //   accelerator: "CmdOrCtrl+O",
        //   click() {
        //     openFile();
        //   },
        // },
        {
          label: "Open Folder",
          accelerator: "CmdOrCtrl+O",
          click() {
            openDir();
          },
        },
        {
          label: "Save File",
          accelerator: "CmdOrCtrl+S",
          click() {
            mainWindow.webContents.send("save-file");
          },
        },
      ],
    },
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        // { role: "forceReload" },
        // { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              // { type: "separator" },
              // { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://github.com/oortnetwork/sixteen");
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

///Open File
function openFile() {
  // open files dialog looking for markdown
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Markdown", extensions: ["md", "markdown", "txt"] }],
  });

  // if no files
  if (!files) return;

  const file = files[0];
  const fileContent = fs.readFileSync(file).toString();

  // send file content to render
  mainWindow.webContents.send("new-file", fileContent);
}

///Open Directory
function openDir() {
  // open files dialog looking for markdown
  const directory = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openDirectory"],
  });

  // if no directory
  if (!directory) return;
  const dir = directory[0];
  mainWindow.webContents.send("new-dir", dir);
}
