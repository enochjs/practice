import { IImportTableModalProps } from 'business-components/components/ImportModalV2/Table/interface';
import { IExportTableModalProps } from 'business-components/components/ExportModal/Table/interface';
import { IImportImgModalProps } from 'business-components/components/ImportModalV2/Img/interface';
import { IExportImgModalProps } from 'business-components/components/ExportModal/Img/interface';
import { TABLE_MODE_ENUM } from '../../enum';
import { BaseTableHandles } from '../BaseTable/interface';

export type RightOpActions =
  | 'log'
  | 'delete'
  | 'invalid'
  | 'print'
  | 'refresh'
  | 'importTable'
  | 'importImg'
  | 'exportTable'
  | 'exportImg'
  | 'tag'
  | 'setting';

export type IDeleteConfig = {
  /**
   * @deprecated 推荐使用api
   */
  deleteApi?: (rows: any) => Promise<any>;
  /**
   * @deprecated 推荐使用api
   */
  beforeDelete?: (rows: any) => Promise<any>;
  api?: (rows: any) => Promise<any>;
  // 如果后端接口走的标准batch接口，则不用添加，如果添加了，会自动触发刷新，无论接口成功还是失败
  forceRefresh?: boolean;
};

export type IInvalidConfig = {
  api?: (rows: any) => Promise<any>;
  // 如果后端接口走的标准batch接口，则不用添加，如果添加了，会自动触发刷新，无论接口成功还是失败
  forceRefresh?: boolean;
};

export interface BaseRightOpProps<T extends Record<string, React.ReactNode>> {
  tableMode?: TABLE_MODE_ENUM[];
  deleteConfig?: IDeleteConfig;
  invalidConfig?: IInvalidConfig;
  btnSorts?: (RightOpActions | keyof T)[];
  tableRef?: React.RefObject<BaseTableHandles>;
  filterRef?: React.RefObject<any>;
  rowKey?: string;
  // 导入数据配置
  importTableConfig?: IImportTableModalProps;
  // 导出数据配置
  exportTableConfig?: IExportTableModalProps;
  // 导入图片配置
  importImgConfig?: IImportImgModalProps;
  // 导出图片配置
  exportImgConfig?: IExportImgModalProps;
  tagConfig?: {
    api?: (rows: any) => Promise<any>;
    objType?: string;
    // operateType?: string;
    paramsNames?: string;
  };
  extraButtons?: T;
  group?: string[];
  /** 是否启用卡片模式选项 */
  enableCardMode?: boolean;
  /** 是否启用预览尺寸选项 */
  enablePreviewSize?: boolean;
  // 模块唯一标识（目前仅用于打印匹配数据源字段使用）
  moduleUniqueIdentifier?: string;
}
