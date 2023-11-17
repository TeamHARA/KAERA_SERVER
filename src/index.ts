import App from './app';

const app = new App().setup();

const port = 3000; 
app.listen(port || 3000, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${port} 🛡️
        #############################################
    `);
});
