import { ReactNode } from 'react';
import { TABLE_MODE_ENUM } from '../../enum';
import { BaseTableHandles } from '../BaseTable/interface';

export interface BaseFilterProps {
  data: Array<any>;
  onChange?: (value: any) => void;
  placeholder: string | ReactNode;
  enableCustom?: boolean;
  searchKey?: string;
  enableSearch?: boolean;
  customOptions?: any[];
  enableComplex?: boolean;
  customRender?: (args: any) => ReactNode;
  tableRef?: React.RefObject<BaseTableHandles>;
}

export interface DynamicFilterProps {
  data:
    | IDynamicFilterDataItem[]
    | Promise<IDynamicFilterDataItem[]>
    | (() => IDynamicFilterDataItem[])
    | (() => Promise<IDynamicFilterDataItem[]>);
  onChange?: (value: any) => void;
  placeholder?: string | ReactNode;
  enableCustom?: boolean;
  searchKey?: string;
  globalSearchId?: string;
  enableSearch?: boolean;
  enableComplex?: boolean;
  useLocalConfig?: boolean;
  tableMode?: TABLE_MODE_ENUM;
  customRender?: (args: any) => ReactNode;
  tableRef?: React.RefObject<BaseTableHandles>;
}

export type OptionValue = {
  label: string | undefined;
  relation: string | undefined;
  default: boolean | undefined;
  value: string | undefined;
  data: {
    field: string | undefined;
    value: string | undefined;
    operator: string | undefined;
  }[];
};

export type FilterProps =
  | DynamicFilterProps
  | (BaseFilterProps & { type: 'baseFilter' })
  | (DynamicFilterProps & { type: 'dynamicFilter' });
