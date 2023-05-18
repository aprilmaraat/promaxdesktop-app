const {app, shell, BrowserWindow, ipcMain, dialog} = require('electron');
const { spawn } = require('child_process');
const url = require("url");
const path = require("path");
const serviceName = 'ProMAXDesktopSyncService';
const ipcKeys = require("./helper.constants");

const gotTheLock = app.requestSingleInstanceLock();

let mainWindow

function get_win_drives(success_cb, error_cb){
  var stdout = '';
  var list  = spawn('powershell');

  list.stdout.setEncoding('utf8');
  list.stdout.on('data', function (data) {
      stdout += data;
  });

  list.stderr.setEncoding('utf8');
  list.stderr.on('data', function (data) {
      //console.log('stderr: ' + data);
  });
  
  list.on('exit', function (code) {
      if (code == 0) {
        var data = stdout.split('\r\n');
        data = data.splice(6, data.length - 7);
        data = data.map(Function.prototype.call, String.prototype.trim);
        success_cb(data);
      } else {
        error_cb();
      }
  });

  list.stdin.write('[System.IO.DriveInfo]::GetDrives()');
  list.stdin.end();
}

function createWindow () {
  mainWindow = new BrowserWindow({
    // minWidth: 1170,
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // webSecurity: false
    },
    frame: false,
    resizable: true,
    transparent: true
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/promaxdesktop-app/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  mainWindow.removeMenu();

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Warning',
      message: 'Cannot run ProMAX SOS app, the application is already opened.',
      buttons: ['OK']
    });
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // Create mainWindow, load the rest of the app, etc...
  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    if (mainWindow === null) createWindow()
  })
}

ipcMain.on(ipcKeys.IPC["SET_WINDOW_SIZE"], (event, arg) => {
  mainWindow.setResizable(true);
  mainWindow.setSize(arg.width, arg.height);
  mainWindow.setResizable(false);
  mainWindow.center();
});

ipcMain.on(ipcKeys.IPC["REFRESH_CHANGES"], (event, args) => {
  mainWindow.webContents.reloadIgnoringCache();
});

// Do not commit this code if you uncomment
ipcMain.on(ipcKeys.IPC["OPEN_DEV_TOOLS"], (event, args) => {
  mainWindow.webContents.openDevTools();
})

ipcMain.on(ipcKeys.IPC["MINIMIZE_WINDOW"], (event, arg) => {
  mainWindow.minimize();
});

ipcMain.on(ipcKeys.IPC["MAXIMIZE_WINDOW"], (event, arg) => {
  mainWindow.setResizable(true);
  mainWindow.maximize();
  mainWindow.setResizable(false);
});

ipcMain.on(ipcKeys.IPC["CLOSE_WINDOW"], (event, arg) => {
  mainWindow.close();
  app.quit();
});

ipcMain.on(ipcKeys.IPC["START_SYNC_SERVICE"], (event, arg) => {
  const netStop = spawn('net', ['start', serviceName]);

  netStop.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  netStop.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  netStop.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

ipcMain.on(ipcKeys.IPC["STOP_SYNC_SERVICE"], (event, arg) => {
  const netStop = spawn('net', ['stop', serviceName]);

  netStop.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  netStop.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  netStop.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

ipcMain.on(ipcKeys.IPC["FEDERATE_SEARCH_NAV"], (event, args) => {
  event.sender.send(ipcKeys.IPC["FEDERATE_SEARCH_RESULT"], args);
});

ipcMain.on(ipcKeys.IPC["KILL_PIDS"], (event, args) => {
  event.sender.send(ipcKeys.IPC["SHOW_STOPPED_SYNCTHING"], args);
});


ipcMain.on('file-request', (event,args) => {  
  // If the platform is 'win32' or 'Linux'
  if (process.platform !== 'darwin') {
    // Resolves to a Promise<Object>
    dialog.showOpenDialog({
      title: 'Select Folder Location',
      //defaultPath: path.join(__dirname, '../assets/'),
      defaultPath: args.defaultDrive,
      buttonLabel: 'Select',
      // Restricting the user to only Text Files.
      // filters: [ 
      // { 
      //    name: 'Text Files', 
      //    extensions: ['txt', 'docx'] 
      // }, ],
      properties: ['openDirectory']
    }).then(file => {
      // Stating whether dialog operation was
      // cancelled or not.
      console.log(file.canceled);
      if (!file.canceled) {
        const filepath = file.filePaths[0].toString();
        console.log(filepath);
        event.reply('file', filepath);
      }  
    }).catch(err => {
      console.log(err)
    });
  }
  else {
    // If the platform is 'darwin' (macOS)
    dialog.showOpenDialog({
      title: 'Select the File to be uploaded',
      defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: 'Upload',
      filters: [ 
      { 
         name: 'Text Files', 
         extensions: ['txt', 'docx'] 
      }, ],
      // Specifying the File Selector and Directory 
      // Selector Property In macOS
      properties: ['openFile', 'openDirectory']
    }).then(file => {
      console.log(file.canceled);
      if (!file.canceled) {
      const filepath = file.filePaths[0].toString();
      console.log(filepath);
      event.send('file', filepath);
    }  
  }).catch(err => {
      console.log(err)
    });
  }
});

