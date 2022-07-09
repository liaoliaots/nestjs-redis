import { Controller, Post, Get, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';
import { Cat } from './cat';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Get()
    async findAll(): Promise<Cat[]> {
        return await this.catsService.findAll();
    }

    @Post()
    async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
        return await this.catsService.create(createCatDto);
    }
}
