import App from './app';
// import errorSender from './middlwares/errorSender';

// dotenv.config();

const app = new App().setup();

console.log(process.env.NODE_ENV)
console.log(process.env.DATABASE_URL)

const port = 3000; // 사용할 port를 3000번으로 설정
app.listen(port || 3000, () => {
  console.log(`
        #############################################
            🛡️ Server listening on port: ${port} 🛡️
        #############################################
    `);
});
