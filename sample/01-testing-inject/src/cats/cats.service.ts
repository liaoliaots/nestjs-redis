import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Cat } from './cat';
import { CreateCatDto } from './create-cat.dto';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [new Cat(1, 'Test Cat 1', 'Test Breed 1'), new Cat(2, 'Test Cat 2', 'Test Breed 2')];

    constructor(@InjectRedis('default') private readonly client: Redis) {}

    async findAll(): Promise<Cat[]> {
        const cats = await this.client.get('cats');
        if (cats) return JSON.parse(cats) as Cat[];

        await this.client.set('cats', JSON.stringify(this.cats));
        return this.cats;
    }

    async create(cat: CreateCatDto): Promise<Cat> {
        await this.client.del('cats');

        const newCat = { id: this.cats[this.cats.length - 1].id + 1, ...cat };
        this.cats.push(newCat);
        return newCat;
    }
}
