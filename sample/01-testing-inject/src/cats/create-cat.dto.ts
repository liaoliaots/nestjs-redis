export class CreateCatDto {
    name: string;
    breed: string;

    constructor(name: string, breed: string) {
        this.name = name;
        this.breed = breed;
    }
}
