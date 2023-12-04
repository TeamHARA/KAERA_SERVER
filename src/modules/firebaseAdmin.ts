const admin = require('firebase-admin');
let serviceAccount = require("../../firebase-admin.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin;