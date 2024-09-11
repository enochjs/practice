import React, { useMemo, useCallback } from 'react';

import { Spin, Image, Empty } from 'linkmore-design';
import { get, isObject } from 'lodash';
import ResetChartTable from '@/components/ResetChartTable';
import EmptyImg from '@/assets/png_empty.png';
import { useTableEmptyProps } from '../../../../hooks';

import styles from './index.module.less';
import { useBasePageStore } from '../../store';
import { ChartTableProps } from './interface';

function CardTable(props: ChartTableProps, ref: React.Ref<any>) {
  const {
    rowKey = 'id',
    customCheck = null,
    pagination = null,
    onSearch,
    portCode,
    loading,
    rowSelection,
    onRowClick,
    dataSource = [],
    columns = [],
  } = props;

  const cardProps = {
    ...props,
    height: props.height,
    rowConfig: { height: 220, ...props.rowConfig },
    checkboxConfig: {
      selected: rowSelection?.selectedRowKeys || [],
      selectedRecords: rowSelection?.selectedRows,
      ...props.checkboxConfig,
    },
    onDoubleClick: props.onDoubleClick,
  };

  const [state, actions] = useBasePageStore((s) => ({
    cardColumnsData: s?.cardConfig,
    otherConfig: s?.otherConfig,
  }));

  const [emptyProps] = useTableEmptyProps({ statusCode: portCode, retryExecutor: onSearch });

  const afterData = useMemo(() => {
    return dataSource.map((dataItem: any) => {
      return {
        ...dataItem,
        ...(dataItem?.dynamicExtraProperty || {}),
      };
    });
  }, [dataSource]);

  const handleCheckboxChange = useCallback(
    (args: any) => {
      if (isObject(args)) {
        const checked = get(args, 'checked');
        const cellSource: any = get(args, 'record', {}) || {};
        const keyField = rowKey || 'id';
        const keyValue = get(cellSource, keyField);
        const keys: Array<string> = rowSelection?.selectedRowKeys || [];
        const alreadyExist = keys.includes(keyValue);
        if (checked) {
          // 新增操作
          if (!alreadyExist) {
            if (onRowClick) {
              onRowClick([...(rowSelection?.selectedRows || []), cellSource]);
            }
          }
          return;
        }
        // 删除操作
        if (alreadyExist) {
          const existSub = keys.findIndex((item) => item === keyValue);

          if (existSub !== -1) {
            rowSelection?.selectedRows?.splice(existSub, 1);
            if (onRowClick) {
              onRowClick([...(rowSelection?.selectedRows || [])]);
            }
          }
        }
      }
    },
    [rowSelection],
  );

  const handlePaginationChange = (current: number, pageSize: number) => {
    actions.setPageConfig({ tableQueryConfig: { pageIndex: current, pageSize } }, true);
  };

  const contentColumn = useMemo(
    () => (state.otherConfig?.cardMode === 'double' ? 2 : 1),
    [state.otherConfig?.cardMode],
  );
  const resizeConfig = useMemo(
    () =>
      contentColumn === 2
        ? { sm: 1, md: 1, lg: 2, xl: 3, xxl: 3 }
        : { sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 },
    [contentColumn],
  );

  return (
    <Spin spinning={loading} wrapperClassName={styles.spin_wrap}>
      <div className={styles.card_table_box}>
        {afterData?.length === 0 ? (
          <div className='h-full w-full flex items-center justify-center'>
            <Empty title='暂无数据' image='nodata' />
          </div>
        ) : (
          <ResetChartTable
            id={rowKey}
            ref={ref}
            resizeConfig={resizeConfig}
            {...cardProps}
            dataSource={afterData}
            columns={columns.filter((v) => v.show !== false)}
            /** 列数量 */
            contentColumn={contentColumn}
            pagination={{ ...pagination, onChange: handlePaginationChange }}
            onCheckboxChange={handleCheckboxChange}
            customCheck={customCheck}
          />
        )}
      </div>
    </Spin>
  );
}

export default React.memo(React.forwardRef(CardTable));
