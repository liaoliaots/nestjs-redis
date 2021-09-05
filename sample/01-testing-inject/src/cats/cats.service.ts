import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Cat } from './cat.model';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [
        new Cat(1, 'Test Cat 1', 1, 'Test Breed 1'),
        new Cat(2, 'Test Cat 2', 2, 'Test Breed 2')
    ];

    constructor(@InjectRedis() private readonly defaultClient: Redis) {}

    async findAll(): Promise<Cat[]> {
        const cats = await this.defaultClient.get('cats');
        if (cats) return JSON.parse(cats) as Cat[];

        await this.defaultClient.set('cats', JSON.stringify(this.cats));
        return this.cats;
    }

    async create(cat: CreateCatDto): Promise<Cat> {
        const newCat = { id: this.cats[this.cats.length - 1].id + 1, ...cat };
        this.cats.push(newCat);

        await this.defaultClient.del('cats');
        return newCat;
    }
}
