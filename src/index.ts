import App from './app';

const app = new App().setup();


const port = 3000; // 사용할 port를 3000번으로 설정
app.listen(port || 3000, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${port} 🛡️
        #############################################
    `);
});
