export class CreateCatDto {
    name: string;

    age: number;

    breed: string;

    constructor(name: string, age: number, breed: string) {
        this.name = name;
        this.age = age;
        this.breed = breed;
    }
}
