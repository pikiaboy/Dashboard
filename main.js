require('dotenv').config();

const {app, BrowserWindow, ipcMain} = require('electron')

app.on('ready', function(){
    mainWindow = new BrowserWindow(
        {
            width: 800,
            height: 480,
            resizable: false,
            frame: false,
            // fullscreen: true,
            show: false
        }
    )

    mainWindow.setMenu(null)
    //mainWindow.webContents.openDevTools()
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    

})