
![graphic_1024_500](https://github.com/TeamHARA/KAERA_Android/assets/70648111/a79277e7-af82-4976-b739-a784e9f19e9f)

## 💡 프로젝트 소개
나의 고민을 빛나는 보석으로
<br>
<aside>
고민을 기록하며 나를 탐구하는 시간
여러분은 스스로에 대해 얼마나 알고 계신가요? 나는 누구인지, 나의 잠재력은 무엇인지, 내가 부족한 점은 무엇인지, 취향에 대한 호불호는 어떠한지 자신있게 설명하실 수 있나요?

캐라에서는 고민을 기록함으로써 나를 찾을 수 있습니다. 
자신의 삶에서 고민이 생겼다는 것은, 더 나은 나를 찾고 싶은 마음에서 생겨난 불안이 있음을 뜻합니다. 기록의 힘을 빌려, 머릿 속이 말끔해지는 기분을 경험해보세요. 캐라를 통해 진정한 자기 자신을 선명하게 그려볼 수 있습니다.

캐라에서는 고민에 대한 부정적인 관점을 바꿔, 반짝이는 나만의 보석을 찾는 과정으로 바라봅니다. 
스스로를 탐구하고 찾는 여정을 느끼고 싶다면, 캐라에서 과거 고민 기록 속의 나와 현재의 나를 연결하며 자신에 대한 확신을 가져보세요.

</aside>

## 📎 출시 링크
### 애플 앱스토어: 
[앱스토어에서 앱 다운로드](https://apps.apple.com/kr/app/%EC%BA%90%EB%9D%BC-%EA%B3%A0%EB%AF%BC-%EC%83%9D%EA%B0%81-%EA%B8%B0%EB%A1%9D/id6471411750)
### 구글 플레이 스토어:
[플레이스토어에서 앱 다운로드](https://play.google.com/store/apps/details?id=com.hara.kaera)

<br>

## ⚙️ 아키텍처

<img width="1115" alt="스크린샷 2023-01-13 오후 8 03 52" src="https://user-images.githubusercontent.com/78431728/212305537-1d043033-6712-478d-8fac-f52f675f99a3.png">

<br>

## 🔧 프로젝트 의존성
package.json
```bash
{
  "name": "kaera",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "api-docs": "swagger-cli bundle ./src/modules/swagger/openapi.yaml --outfile swagger.yaml --type yaml",
    "preproduction": "npm run api-docs",
    "development": "dotenv -e .env.development nodemon",
    "production": "dotenv -e .env.production nodemon",
    "build": "tsc",
    "pretest": "yarn generate",
    "test": "jest",
    "db:pull": "npx prisma db pull",
    "db:push": "npx prisma db push",
    "generate": "npx prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^4.16.2",
    "axios": "^1.4.0",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "firebase-admin": "^11.11.1",
    "jsonwebtoken": "^9.0.1",
    "jwks-rsa": "^3.1.0",
    "moment": "^2.29.4",
    "node-cron": "^3.0.3",
    "prisma": "^4.16.2",
    "swagger-cli": "^4.0.4",
    "yamljs": "^0.3.0"
  },
  "devDependencies": {
    "@jest/globals": "^29.6.0",
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.17",
    "@types/express-validator": "^3.0.0",
    "@types/jest": "^29.5.2",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/node": "^18.15.11",
    "@types/node-cron": "^3.0.11",
    "@types/supertest": "^2.0.12",
    "@types/swagger-ui-express": "^4.1.3",
    "@types/yamljs": "^0.2.31",
    "jest": "^29.6.0",
    "jest-mock-extended": "^3.0.4",
    "nodemon": "^1.14.9",
    "supertest": "^6.3.3",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "ts-jest": "^29.1.1",
    "ts-mockito": "^2.6.1",
    "typescript": "^5.1.6"
  }
}

```

## 📁 폴더 구조
```bash
KAERA
├── .github
├── prisma
├── scripts
├── src
│   ├── common
│   │    ├── error
│   │    ├── utils
│   ├── constants
│   ├── controller
│   ├── interfaces
│   ├── middlewares
│   ├── modules
│   ├── repository
│   ├── router
│   └── service
└── test
```

## 스크린샷

![3](https://github.com/TeamHARA/KAERA_Android/assets/70648111/119a06c3-51ee-4f3f-b58c-0673c849fd83)| ![4](https://github.com/TeamHARA/KAERA_Android/assets/70648111/1294ce26-ed41-412f-8322-601a1f6e14c5) | ![5](https://github.com/TeamHARA/KAERA_Android/assets/70648111/ca297a47-0af1-4559-a614-0190f9acf211)
---| ---| ---|

