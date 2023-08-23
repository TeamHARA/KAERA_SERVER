import { ValidationError, validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ClientException } from '../common/error/exceptions/customExceptions';

// 미들웨어 정의
export function validateBody(schema: {new() : any}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const target = plainToInstance(schema, req.body);
    try {
      await validateOrReject(target,{ whitelist: true, forbidNonWhitelisted: true });
      next();
    } catch (error) {

      if(error instanceof Array){
        error.forEach(err => {
          const msgObj:Object = err.constraints
          error = new ClientException(JSON.stringify(Object.values(msgObj)))
          
        });
      }

      next(error);
    
    }
  };
}