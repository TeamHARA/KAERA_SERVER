import { IsDefined, IsNumber, IsString } from "class-validator";

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