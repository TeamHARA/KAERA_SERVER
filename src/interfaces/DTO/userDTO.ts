interface userCreateDTO {
    kakaoId: number | null;
    appleId: string | null;
    name: string;
    ageRange: string | null;
    gender: string | null;
    email: string | null;
    refreshToken: string;
}


export{
    userCreateDTO,

}