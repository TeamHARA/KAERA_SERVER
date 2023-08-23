import { IsString, IsDefined, IsNumber, IsArray} from 'class-validator';

class worryCreateDTO {

  @IsDefined()
  @IsNumber()
  templateId?: number;

  @IsDefined()
  @IsNumber()
  userId?: number;

  @IsDefined()
  @IsString()
  title?: string;

  @IsDefined()
  @IsArray()
  answers?: Array<string>;

  @IsDefined()
  @IsNumber()
  deadline?: number;
}

class worryUpdateDTO{
  @IsDefined()
  @IsNumber()
  worryId?: number;

  @IsDefined()
  @IsNumber()
  userId?: number;

  @IsDefined()
  @IsString()
  title?: string;

  @IsDefined()
  @IsArray()
  answers?: Array<string>;
}

class finalAnswerCreateDTO{
  @IsDefined()
  @IsNumber()
  worryId?: number;

  @IsDefined()
  @IsNumber()
  userId?: number;

  @IsDefined()
  @IsString()
  finalAnswer?: string;
}

class deadlineUpdateDTO{
  @IsDefined()
  @IsNumber()
  worryId?: number;

  @IsDefined()
  @IsNumber()
  userId?: number;

  @IsDefined()
  @IsNumber()
  dayCount?: number;
}

export {
  worryCreateDTO,
  worryUpdateDTO,
  finalAnswerCreateDTO,
  deadlineUpdateDTO
}


