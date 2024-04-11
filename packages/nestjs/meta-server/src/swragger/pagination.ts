import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';
import { Pagination } from 'typings/global';

export class PaginationDto<T> {
  @IsArray()
  readonly list: T[];

  @IsInt()
  currentPage: number;

  @IsInt()
  pageSize: number;

  @IsInt()
  totalCount: number;

  constructor(data: Pagination<T>) {
    this.list = data.list;
    this.totalCount = data.totalCount;
    this.currentPage = data.currentPage;
    this.pageSize = data.pageSize;
  }
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'pagination dto',

      schema: {
        required: ['list', 'currentPage', 'pageSize', 'totalCount'],
        properties: {
          list: {
            type: 'array',
            items: {
              $ref: getSchemaPath(model),
            },
          },
          currentPage: {
            type: 'number',
          },
          pageSize: {
            type: 'number',
          },
          totalCount: {
            type: 'number',
          },
        },
      },
    }),
  );
};
