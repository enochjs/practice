import { CustomStatusPanelProps } from 'ag-grid-react';
import { Button, Checkbox, Pagination, Space, type PaginationProps } from 'linkmore-design';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntlProxy } from 'hooks';
import styles from './index.module.less';

interface IProps extends CustomStatusPanelProps {
  total: number;
  onClear?: () => void;
}

const CustomPagination = (props: IProps) => {
  const { total, onClear } = props;
  const intlProxy = useIntlProxy();
  const [selectRowsNum, setSelectRowsNum] = useState(0);

  const handleClear = useCallback(() => {
    onClear?.();
  }, []);

  useEffect(() => {
    window.addEventListener('__agStatusSelectionChangedEvent__', (params: any) => {
      const { detail = {} } = params;
      setSelectRowsNum(detail?.selectRowsNum);
    });
  }, []);

  return (
    <div className={styles.customCheck} style={{ display: selectRowsNum ? 'block' : 'none' }}>
      <Space>
        <Checkbox
          indeterminate={selectRowsNum > 0 && selectRowsNum < total}
          checked={selectRowsNum === total}
        />
        <span>
          {intlProxy.common.selected}
          <span
            style={{ fontStyle: 'normal', color: '#1890FC', margin: '0 4px', cursor: 'pointer' }}
          >
            {selectRowsNum || 0}
          </span>
          {intlProxy.common.item}
        </span>
        <Button onClick={handleClear}>{intlProxy.common.deselect}</Button>
      </Space>
    </div>
  );
};

export default CustomPagination;
