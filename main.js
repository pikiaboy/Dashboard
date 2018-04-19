require('dotenv').config();

const {app, BrowserWindow, ipcMain} = require('electron')

process.env.GOOGLE_API_KEY = process.env.API_KEY;

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
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    ipcMain.on('openSettings',function(event, id){
        openSettings();
    });
    

})

function openSettings(){
    let win = new BrowserWindow(
        {
            width: 200,
            height: 150,
            resizable: true,
            frame: true,
            // fullscreen: true,
            show: false
        }
    );

    win.loadURL(`file://${__dirname}/app/settings.html`);


    win.once('ready-to-show',()=>{
        win.show();
    })

    console.log("loaded...");
}