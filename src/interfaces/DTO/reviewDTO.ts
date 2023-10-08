import { IsDefined, IsNumber, IsString, isString } from "class-validator";

class reviewDTO {
    @IsDefined()
    @IsNumber()
    worryId!: number;
    
    @IsDefined()
    @IsNumber()
    userId!: number;

    @IsDefined()
    @IsString()
    review!: string;
}


export{
    reviewDTO

}