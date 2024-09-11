import { Tooltip, Button, IconFont, message, Space } from 'linkmore-design';
import headerTabsStore from 'layouts/MainHeader/component/tabs/store';
import { useLocation } from 'react-router-dom';
import { memo } from 'react';
import { usePrint, useGetPrintLogInfo } from '@/components/PrintModal';
import { useIntlProxy, useGetLogKeys } from '@/hooks';
import { BaseTableHandles } from '../BaseTable/interface';

const { LmToolTip } = Tooltip;

interface IPrintButtonProps {
  tableRef: React.RefObject<BaseTableHandles>;
  rowKey?: string;
  moduleUniqueIdentifier?: string;
}

enum ModuleReportNameKeys {
  CommodityFile = 'productCode',
  NormPackage = 'productCode',
  ProductionPackage = 'productCode',
  ProofingPackage = 'sampleCode',
}

const moduleReportNameKeysObj = {
  commodityFile: ModuleReportNameKeys.CommodityFile,
  normPackage: ModuleReportNameKeys.NormPackage,
  productionPackage: ModuleReportNameKeys.ProductionPackage,
  proofingPackage: ModuleReportNameKeys.ProofingPackage,
};

const PrintButton = ({
  tableRef,
  rowKey = 'id',
  moduleUniqueIdentifier = '',
}: IPrintButtonProps) => {
  console.log(moduleUniqueIdentifier, 'moduleUniqueIdentifier');
  // 当rowKey的值为feDataIndex进行特殊处理，转换为id字段
  const transformRowKey = rowKey === 'feDataIndex' ? 'id' : rowKey;

  const location = useLocation();
  const [menuId] = headerTabsStore.useStore(
    (s) => s.moduleMap?.get(location.pathname)?.moduleId || '',
  );

  const { onOpen, onPrint } = usePrint();
  const logKeys = useGetLogKeys();
  const intlProxy = useIntlProxy();
  const printLogInfo = useGetPrintLogInfo();

  const handleClick = () => {
    const getSelectRows = tableRef.current?.getSelectedRows();

    if (!getSelectRows?.length) {
      return message.warning(intlProxy.common.pleaseselectonedata);
    }

    // 获取打印文件导出的名称
    let reportName = '';
    const reportNameKey = moduleReportNameKeysObj[moduleUniqueIdentifier];
    console.log(reportNameKey, 'reportNameKeyreportNameKey');
    if (getSelectRows?.length && reportNameKey) {
      const text = getSelectRows?.[0]?.[reportNameKey];
      reportName = getSelectRows?.length > 1 ? `${text}等` : text;
    }

    const objId = getSelectRows
      .map((item) => {
        return item?.[transformRowKey];
      })
      .join(',');

    console.log(getSelectRows, 'row', objId);

    onOpen?.(objId, {
      logInfo: printLogInfo,
      selectRowsData: getSelectRows,
      logKeys,
      reportName,
    });
  };

  const handlePrint = () => {
    const getSelectRows = tableRef?.current?.getSelectedRows();
    if (!getSelectRows?.length) {
      return message.warning(intlProxy.common.pleaseselectonedata);
    }

    // 获取打印文件导出的名称
    let reportName = '';
    const reportNameKey = moduleReportNameKeysObj[moduleUniqueIdentifier];
    if (getSelectRows?.length && reportNameKey) {
      const text = getSelectRows?.[0]?.[reportNameKey];
      reportName = getSelectRows?.length > 1 ? `${text}等` : text;
    }

    const objId = getSelectRows
      .map((item) => {
        return item?.[transformRowKey];
      })
      .join(',');
    onPrint(menuId, objId, {
      logInfo: printLogInfo,
      selectRowsData: getSelectRows,
      logKeys,
      reportName,
    });
  };

  return (
    <>
      <Space.Compact>
        <LmToolTip title={intlProxy.common.PrintNow}>
          <Button icon={<IconFont type='icon-dayin' />} onClick={handlePrint} />
        </LmToolTip>
        <LmToolTip title={intlProxy.common.Print}>
          <Button icon={<IconFont type='icon-a-dayin' />} onClick={handleClick} />
        </LmToolTip>
      </Space.Compact>
    </>
  );
};

export default memo(PrintButton);
