import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Response } from 'express';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get()
  findAll() {
    return this.catService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.catService.findOne(+id);
  }

  /**
   * @param id
   * @param res use res send to send response
   */
  @Get('res/:id')
  findOneWithRes(@Param('id') id: string, @Res() res: Response) {
    res.status(201).send(`This action returns a #${id} cat`);
  }

  /**
   * @param id
   * @param res use res send to send response, with path through
   */
  @Get('res/path/through/:id')
  findOneWithResPathThrough(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.status(201);
    return `This action returns a #${id} cat`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(+id);
  }

  /**
   * 通配符
   * @returns
   */
  @Get('/wildcard/ab*cd')
  findAllWildCard() {
    return 'This route uses a wildcard';
  }

  @Get('/http/code')
  @HttpCode(204)
  httpCode() {
    return 'return status code 204';
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  /**
   * redirect
   * @returns
   */
  @Get('/redirect')
  @Redirect('https://nestjs.com', 301)
  redirect() {
    return 'return status code 204';
  }

  /**
   * redirect with query
   * @param version
   * @returns
   */
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
