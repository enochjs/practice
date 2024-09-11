import React, { useMemo, useRef, useImperativeHandle, useCallback } from 'react';

import { CardTable as LMCardTable, Spin } from 'linkmore-design';

import { get, isObject } from 'lodash';

import { useTableEmptyProps } from '../../../../hooks';

import styles from './index.module.less';
import { useBasePageStore } from '../../store';
import { CardTableProps } from './interface';

function CardTable(props: CardTableProps, ref: React.Ref<any>) {
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
    type: props.cardType,
    height: props.cardHeight,
    rowConfig: props.cardRowConfig,
    cellConfig: props.cardCellConfig,
    checkboxConfig: props.cardCheckboxConfig,
    components: props.cardComponent,
    checkbox: props.cardCheckbox,
    cellDoubleClick: props.onDoubleClick,
    pagerConfig: {
      left: customCheck,
      ...props.cardPagerConfig,
    },
  };

  const defaultConfig = {
    checkbox: props.cardCheckbox,
    imgurl: props.cardImgUrl,
    title: props.cardTitle,
    code: props.cardCode,
    desc: props.cardDesc,
    extra: props.cardExtra,
    extend: props.cardExtend,
    footer: props.cardFooter,
  };

  const [state, actions] = useBasePageStore((s) => ({
    cardColumnsData: s?.cardConfig,
    otherConfig: s?.otherConfig,
  }));

  const cardTableRef: any = useRef(null);

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
        const cellSource: any = get(args, 'cell', {}) || {};
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

  useImperativeHandle(ref, () => {
    return cardTableRef?.current || {};
  });
  const handlePaginationChange = (current: number, pageSize: number) => {
    actions.setPageConfig(
      {
        tableQueryConfig: {
          pageIndex: current,
          pageSize,
        },
      },
      true,
    );
  };

  return (
    <Spin spinning={loading} wrapperClassName={styles.spin_wrap}>
      <div className={styles.card_table_box}>
        <LMCardTable
          ref={cardTableRef}
          {...cardProps}
          dataSource={afterData}
          emptyProps={emptyProps}
          defaultConfig={{ ...defaultConfig, columns }}
          size={state.otherConfig?.size}
          pagination={{
            ...pagination,
            onChange: handlePaginationChange,
            size: 'default',
          }}
          cellKey={rowKey}
          checkboxConfig={{
            checkKeys: rowSelection?.selectedRowKeys || [],
            checkValues: rowSelection?.selectedRows,
            ...props.cardCheckboxConfig,
          }}
          checkboxChange={handleCheckboxChange}
        />
      </div>
    </Spin>
  );
}

export default React.memo(React.forwardRef(CardTable));