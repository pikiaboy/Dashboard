
const {app, BrowserWindow, ipcMain} = require('electron')

app.on('ready', function(){
    mainWindow = new BrowserWindow(
        {
            width: 800,
            height: 480,
            resizable: true,
            frame: true,
            show: false
        }
    )

    mainWindow.setMenu(null)

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)



    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    

})