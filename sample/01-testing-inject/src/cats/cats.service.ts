import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Cat } from './models/cat';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [
        new Cat(1, 'Test Cat 1', 1, 'Test Breed 1'),
        new Cat(2, 'Test Cat 2', 2, 'Test Breed 2')
    ];

    constructor(@InjectRedis() private readonly redisClient: Redis) {}

    async findAll(): Promise<Cat[]> {
        const cats = await this.redisClient.get('cats');
        if (cats) return JSON.parse(cats) as Cat[];

        await this.redisClient.set('cats', JSON.stringify(this.cats));

        return this.cats;
    }

    async create(cat: CreateCatDto): Promise<Cat> {
        const newCat = { id: this.cats[this.cats.length - 1].id + 1, ...cat };
        this.cats.push(newCat);

        await this.redisClient.del('cats');

        return newCat;
    }
}
