import { EnumEmptyStatus } from 'business-components/hooks/useTableEmptyProps';
import { ReactNode } from 'react';
import type { ChartTableProps as defaultChartTableProps } from 'linkmore-design';
import { ExpandableConfig } from 'linkmore-design/es/table/interface';
import { TABLE_MODE_ENUM } from '../../enum';

export type GetApiValue<T> = T extends (...args: any) => PromiseLike<infer R> ? R : never;
type GetApiRowByApiValue<T> = T extends { items?: infer R }
  ? R extends any[]
    ? R[number] & { feDataIndex: number }
    : any
  : any;

export type GetApiRow<T> =
  GetApiValue<T> extends { items?: infer R }
    ? R extends any[]
      ? R[number] & { feDataIndex: number }
      : any
    : any;

export type GetApiRowValue<T> =
  GetApiValue<T> extends { items?: infer R } ? (R extends any[] ? R[number] : any) : any;

type PaginationKeys =
  | 'items'
  | 'totalCount'
  | 'pageIndex'
  | 'pageSize'
  | 'totalPages'
  | 'indexFrom'
  | 'hasPreviousPage'
  | 'hasNextPage';

export interface ITableSummaryItem<T> {
  dataIndex: keyof GetApiRowByApiValue<T>;
  // 对应total的key，如果不传则默认为小记，如果传了则显示对应的key
  totalKey?: Exclude<keyof T, PaginationKeys>;
  render?: (value: Array<GetApiRowByApiValue<T>>) => ReactNode;
}

export interface ITableCommonProps<T> {
  dataSource: Array<GetApiRowByApiValue<T>>;
  size?: string;
  loading?: boolean;
  virtual?: any;
  customCheckProps?: {
    renderItem: (item: GetApiRowByApiValue<T>) => ReactNode;
  };
  rowKey?: string;
  rowSelection?: any;
  onRowClick?: (args: GetApiRowByApiValue<T>) => void;
  onDoubleClick?: (cell: any, table: any) => void;
  onSearch: () => void;
  pagination?: any;
  portCode: EnumEmptyStatus;
  columns: Array<any>;
  expandable?: ExpandableConfig<any>;
  // 使用本地配置，不保存到远程数据库，如弹框中使用
  useLocalConfig?: boolean;
  // 页面自行更新
  useCustomUpdate?: boolean;
}

export interface ListTableProps<T> extends ITableCommonProps<T> {
  columnsState?: any;
  autoSizer?: boolean;
  summaryData?: Record<string, any>;
  useAgGrid?: boolean;
  components?: Record<string, any>;
  rowClassName?: (record: GetApiRowByApiValue<T>, index: number) => string;
  updateFlag?: number;
  rowHeight?: number;
}

export interface CardTableProps<T> extends ITableCommonProps<T> {
  cardType?: 'PTC' | 'PTR' | 'TG' | 'TW';
  cardHeight?: string | number;
  cardRowConfig?: {
    gap?: number | Array<string | number>;
  };
  cardCellConfig?: {
    width?: string | number;
    height?: string | number;
  };
  cardCheckboxConfig?: {
    trigger?: 'default' | 'cell';
  };
  cardComponent?: any;
  cardCheckbox?: boolean; // 复选框
  cardImgUrl: string | ((record: any) => ReactNode); // 从dataSource中读取字段; // 从dataSource中读取字段
  cardTitle: (record?: any, table?: any) => ReactNode; // 自定义显示的内容
  cardCode?: string; // 从dataSource中读取字段
  cardDesc?: string;
  cardExtra: (record?: any, table?: any) => ReactNode;
  cardExtend?: (record?: any, table?: any) => ReactNode;
  cardFooter?: (record?: any, table?: any) => ReactNode; // 自定义显示的内容
  cardDefaultShowKeys: string[];
  cardHiddenKeys?: string[];
  cellDoubleClick?: (cell: any, table: any) => void;
  cardPagerConfig: { left: any; right: any };
}

export interface ChartTableProps<T> extends defaultChartTableProps {
  height?: number | string;
  enableGroup?: boolean;
  groupKeys?: string | string[];
}

type IUnionTableProps<T extends TABLE_MODE_ENUM[], V, R = unknown> = T extends [
  infer F,
  ...infer Rest extends TABLE_MODE_ENUM[],
]
  ? IUnionTableProps<
      Rest,
      V,
      R & (F extends TABLE_MODE_ENUM.IMG ? CardTableProps<V> : ListTableProps<V>)
    >
  : R;

export type BaseTableProps<
  T extends TABLE_MODE_ENUM[] = [TABLE_MODE_ENUM.LIST],
  V extends (...args: any) => PromiseLike<any> = (...args: any) => any,
> = Omit<
  {
    tableMode?: T;
    api: V;
    // 监听需要更新的api，刷新列表数据
    apiHooks?: { feTraceId: string }[];
    apiHookOptions?: { wait?: number; leading?: boolean; trailing?: boolean; maxWait?: number };
    autoSearch?: boolean;
    showClickBorder?: boolean;
    selectRowChange?: (record: any) => void;
    onRow?: (record: GetApiRow<V>) => void;
    roleFiledKeys?: any[];
    useAgGrid?: boolean;
    summary?:
      | ((summaryData: GetApiValue<V>) => ReactNode)
      | Array<ITableSummaryItem<GetApiValue<V>>>;
  } & IUnionTableProps<T, GetApiValue<V>>,
  'dataSource' | 'loading' | 'onSearch' | 'portCode' | 'customCheck' | 'summaryData'
>;

export interface BaseTableHandles<T = any> {
  changeSize: () => void;
  checkboxRecords: T[];
  clearSelect: () => void;
  columns: any[];
  getSearchParams: () => any;
  /**
   * @deprecated 无效属性 推荐使用clearSelectRows
   */
  customSetCheckboxRecords: (...args: any) => void;
  setSelectRows: (args: any[]) => void;
  clearSelectRows: () => void;
  /**
   * @deprecated 推荐使用 getSelectedRows
   */
  getCheckboxRecords: () => T[];
  getSelectedRows: () => T[];
  getSelectedRowKeys: () => (string | number)[];
  refresh: () => void;
  resetTableConfig: (needSave?: boolean, type?: 'card' | 'table') => void;
  updateFlagCount: () => void;
}

export interface BaseFilterHandles {
  updateSearchQueryConfig: (config: any) => void;
  appendSearchQueryConfig: (config: any) => void;
  updateAfterData: (result: any[]) => void;
  getAfterData: () => any;
  resetSearchConfig: (needSave: boolean) => void;
  setLocalization: (config: any) => void;
}
