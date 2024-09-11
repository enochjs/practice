import React, { useRef } from 'react';
import { Tooltip, Button, IconFont, Space } from 'linkmore-design';
import { ExportTableModal, ImportTableModal } from 'business-components';
import {
  IImportTableModalHandles,
  IImportTableModalProps,
} from 'business-components/components/ImportModalV2/Table/interface';
import { IExportTableModalProps } from 'business-components/components/ExportModal/Table/interface';
import { globalIntlProxy } from '@/hooks';
import { BaseTableHandles } from '../BaseTable/interface';

const { LmToolTip } = Tooltip;

interface IImportTableProps {
  tableRef: React.RefObject<BaseTableHandles>;
  btnSorts?: ('importTable' | 'exportTable')[];
  importTableConfig?: IImportTableModalProps;
  exportTableConfig?: IExportTableModalProps;
}

const ImportTableButton = (props: IImportTableProps) => {
  const { tableRef, btnSorts, importTableConfig, exportTableConfig } = props;

  const importTableModalRef = useRef<IImportTableModalHandles>(null);
  const exportTableModalRef = useRef<IImportTableModalHandles>(null);

  const Wrapper = (p: any) =>
    btnSorts?.includes('importTable') && btnSorts.includes('exportTable') ? (
      <Space.Compact>{p.children}</Space.Compact>
    ) : (
      <>{p.children}</>
    );

  return (
    <>
      <Wrapper>
        {btnSorts?.includes('importTable') ? (
          <LmToolTip title={globalIntlProxy.common.ImportData} /* ts-morph: 导入数据 */>
            <Button
              icon={<IconFont type='icon-daoru' />}
              onClick={importTableModalRef.current?.show}
            />
          </LmToolTip>
        ) : null}
        {btnSorts?.includes('exportTable') ? (
          <LmToolTip title={globalIntlProxy.common.ExportData} /* ts-morph: 导出数据 */>
            <Button
              icon={<IconFont type='icon-daochu' />}
              onClick={exportTableModalRef.current?.show}
            />
          </LmToolTip>
        ) : null}
      </Wrapper>
      {btnSorts?.includes('importTable') ? (
        <ImportTableModal {...importTableConfig!} ref={importTableModalRef} />
      ) : null}
      {btnSorts?.includes('exportTable') ? (
        <ExportTableModal {...exportTableConfig} ref={exportTableModalRef} tableRef={tableRef} />
      ) : null}
    </>
  );
};

export default ImportTableButton;
