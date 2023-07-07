//testApp 에는 listen 하는 부분이 존재하지 X

import App from '../src/app';
import * as dotenv from 'dotenv';

const testApp = new App().setup();
dotenv.config();


export default testApp;