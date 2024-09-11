import React, { useRef } from 'react';
import { Tooltip, Button, IconFont, Space } from 'linkmore-design';
import {
  IImportImgModalHandles,
  IImportImgModalProps,
} from 'business-components/components/ImportModalV2/Img/interface';
import { IExportImgModalProps } from 'business-components/components/ExportModal/Img/interface';
import { ExportImgModal, ImportImgModal } from 'business-components';
import { globalIntlProxy } from '@/hooks';
import { BaseTableHandles } from '../BaseTable/interface';

const { LmToolTip } = Tooltip;

interface IImportImgProps {
  tableRef: React.RefObject<BaseTableHandles>;
  btnSorts?: ('importImg' | 'exportImg')[];
  importImgConfig?: IImportImgModalProps;
  exportImgConfig?: IExportImgModalProps;
}

const ImportImgButton = (props: IImportImgProps) => {
  const { tableRef, btnSorts, importImgConfig, exportImgConfig } = props;

  const importImgModalRef = useRef<IImportImgModalHandles>(null);
  const exportImgModalRef = useRef<IImportImgModalHandles>(null);

  const Wrapper = (p: any) =>
    btnSorts?.includes('importImg') && btnSorts.includes('exportImg') ? (
      <Space.Compact>{p.children}</Space.Compact>
    ) : (
      <>{p.children}</>
    );

  return (
    <>
      <Wrapper>
        {btnSorts?.includes('importImg') ? (
          <LmToolTip title={globalIntlProxy.common.ImportPictures} /* ts-morph: 导入图片 */>
            <Button
              icon={<IconFont type='icon-jiatu' />}
              onClick={importImgModalRef.current?.show}
            />
          </LmToolTip>
        ) : null}
        {btnSorts?.includes('exportImg') ? (
          <LmToolTip title={globalIntlProxy.common.ExportPicture} /* ts-morph: 导出图片 */>
            <Button
              icon={<IconFont type='icon-chuantu' />}
              onClick={exportImgModalRef.current?.show}
            />
          </LmToolTip>
        ) : null}
      </Wrapper>
      {btnSorts?.includes('importImg') ? (
        <ImportImgModal {...importImgConfig!} ref={importImgModalRef} />
      ) : null}
      {btnSorts?.includes('exportImg') ? (
        <ExportImgModal {...exportImgConfig!} ref={exportImgModalRef} tableRef={tableRef} />
      ) : null}
    </>
  );
};

export default ImportImgButton;
