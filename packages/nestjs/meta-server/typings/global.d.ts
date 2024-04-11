import '@nestjs/swagger';

declare type byte = number;

declare module 'svgdom';
declare interface Pagination<T> {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  list: T[];
}

declare type ENV = 'dev' | 'qa' | 'pre' | 'prod' | 'default';

declare type PipelineType = 'disconf' | 'pageServer' | 'nodejs';

declare type EnumListItem = {
  key: string;
  value: string | number;
  text: string;
};

declare module '@nestjs/swagger' {
  interface ApiPropertyOptions {
    enumSchema?: {
      name: string;
      desc: string;
      items: EnumListItem[];
    };
  }
}
