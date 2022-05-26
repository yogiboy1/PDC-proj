const {app,BrowserWindow,ipcMain}=require('electron');
app.on('ready',()=>{
   const controller=new BrowserWindow({});
   controller.loadURL(`file://${__dirname}/index.html`);

   ipcMain.on('data:load',function (event,data) {
       // console.log(data);
       const single=new BrowserWindow({});
       single.loadURL(`file://${__dirname}/views/single.html`);
       single.webContents.on('did-finish-load',()=>{
           single.webContents.send('simulation:start',data);
       });
       single.webContents.send('simulation:start',data);
       const multi=new BrowserWindow({
           webPreferences: {
               nodeIntegrationInWorker: true
           }
       });
       multi.loadURL(`file://${__dirname}/views/multi.html`);
       multi.webContents.on('did-finish-load',()=>{
           multi.webContents.send('simulation:start',data);
       });
   });
});