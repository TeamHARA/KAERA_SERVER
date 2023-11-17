import express, { Express, Response, Request, NextFunction } from 'express';
import globalExceptionHandler from "./common/error/handler";
import router from './router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

class App {
  public setup(): Express {
    let app = express();
    app.use(express.json());

    const path = require('path');
    const swaggerSpec = YAML.load(path.join(__dirname, '../swagger.yaml'))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use("/v1", router);
    app.get("/health", (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json({
        status: 200,
        message: "===TESTING-KAERA-DEVELOP-SERVER=== Healthy."
      });
    });

    app.use(globalExceptionHandler);
    return app;
  }
}

export default App;