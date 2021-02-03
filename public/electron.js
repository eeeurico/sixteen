// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog } = require("electron");
const settings = require("electron-settings");
const contextMenu = require("electron-context-menu");

const path = require("path");
// const fs = require("fs");
const isDev = require("electron-is-dev");

contextMenu();

var currentWindows = new Map();
let currentFiles = [];

function createMainMenu() {
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
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click() {
            newFile();
          },
        },
        {
          label: "Open File",
          accelerator: "CmdOrCtrl+O",
          click() {
            openFile();
          },
        },
        {
          label: "Save File",
          accelerator: "CmdOrCtrl+S",
          click() {
            saveFile();
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
      submenu: isDev
        ? [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" },
          ]
        : [
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainMenu();
  createStartWindows();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createStartWindows();
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
  const files = dialog.showOpenDialogSync(false, {
    properties: ["openFile"],
    filters: [{ name: "Txt", extensions: ["txt"] }],
  });

  // if no files
  if (!files) return;

  const file = files[0];
  createNewWindow(file);
}

function createNewWindow(file) {
  // const fileContent = file !== "new" ? fs.readFileSync(file).toString() : null;

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 480,
    minHeight: 320,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      spellcheck: true,
      // preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hiddenInset",
  });

  const windowId = newWindow.id;
  newWindow.on("closed", () => {
    /// #if env == 'DEBUG'
    console.log(`Window was closed, id = ${windowId}`);
    /// #endif
    currentWindows.delete(windowId);
    refreshCache("remove", file);
  });

  // The window identifier can be checked from the Renderer side.
  // `win.loadFile` will escape `#` to `%23`, So use `win.loadURL`
  const filePath = path.join(__dirname, "index.html");
  newWindow.loadURL(
    isDev ? `http://localhost:3000/#${file}` : `file://${filePath}#${file}`
  );

  currentWindows.set(windowId, newWindow);
  refreshCache("add", file);
}

function refreshCache(status, file) {
  let files = settings.getSync("cachedFiles");
  currentFiles = files;
  if (file === "new") {
    return;
  } else if (status === "add" && !currentFiles.includes(file)) {
    currentFiles.push(file);
  } else if (status === "remove") {
    currentFiles = currentFiles.filter(function (value) {
      return file !== value;
    });
  }
  settings.setSync("cachedFiles", currentFiles);
}

function createStartWindows() {
  var cachedFiles = settings.getSync("cachedFiles");

  // console.log("files:", cachedFiles, cachedFiles.length);
  if (cachedFiles.length) {
    for (let i = 0; i < cachedFiles.length; i++) {
      createNewWindow(cachedFiles[i]);
    }
  } else {
    // console.log("createWindow without anything");
    createNewWindow("new");
  }
}

//savefile
function saveFile() {
  currentWindows.forEach(saveFileArray);
}

function saveFileArray(value, key, map) {
  value.webContents.send("save-file");
}

///Open Directory
function newFile() {
  createNewWindow("new");
}
