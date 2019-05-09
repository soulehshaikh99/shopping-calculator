const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const gotTheLock = app.requestSingleInstanceLock();

const path = require('path');

let mainWindow;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    mainWindow.webContents.send('second-instance-request');
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
  app.on('ready', () => {
    let winState = windowStateKeeper({
      defaultWidth: 1072,
      defaultHeight: 712
    });
    mainWindow = new BrowserWindow({
      minWidth: 1072,
      minHeight: 712,
      width: winState.width,
      height: winState.height,
      x: winState.x,
      y: winState.y,
      resizable: true,
      center: true,
      title: 'Shopping List Calculator',
      backgroundColor: '#3d5afe'
    });
    winState.manage(mainWindow);
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.setMenu(null);
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
    mainWindow.flashFrame(true);
    mainWindow.setThumbnailToolTip('Shopping List Calculator');
  });
}

app.on('window-all-closed', () => {
  app.quit();
});
