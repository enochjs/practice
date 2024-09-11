import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Space, Checkbox } from 'linkmore-design';
import { CheckboxChangeEvent } from 'linkmore-design/es/checkbox';
import cls from 'classnames';
import { differenceBy, unionBy } from 'lodash';
import { useIntlProxy } from '@/hooks';
import styles from './index.module.less';
import { TABLE_MODE_ENUM } from '../../enum';

interface ICustomCheckProps {
  selectRowsNum?: number;
  total?: number;
  onChange?: (checked: boolean, data: any) => void;
  extraInfo?: ReactElement | string;
  onClear?: () => void;
  selectRows?: any[];
  renderItem?: (item: any) => ReactElement;
  dataSource?: any[];
  handleRowClick?: (data: any[]) => void;
  tableMode?: TABLE_MODE_ENUM;
}

function CustomCheck(props: ICustomCheckProps) {
  const {
    selectRowsNum = 0,
    total = 0,
    extraInfo,
    onChange,
    onClear,
    selectRows = [],
    renderItem,
    dataSource = [],
    handleRowClick,
    tableMode,
  } = props;

  const intlProxy = useIntlProxy();
  const [isCheck, setIsCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);

  const handleChange = useCallback((e: CheckboxChangeEvent, data: any) => {
    onChange?.(e.target.checked, data);
  }, []);

  const handleClear = useCallback(() => {
    onClear?.();
  }, []);

  useEffect(() => {
    const list = differenceBy(dataSource, selectRows, 'id');
    setIsCheck(!list?.length);
    setDataList(list);
  }, [dataSource, selectRows]);

  const renderSelect = () => {
    if (!renderItem) {
      return null;
    }

    return (
      <div className={styles.selectedWrapper}>
        {selectRows?.length && (
          <div>
            {selectRows.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: index === selectRows.length - 1 ? 0 : 8,
                }}
              >
                <Checkbox onChange={(e) => handleChange(e, item)} checked />
                <div>{renderItem(item)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.customCheck}>
      <div className='flex flex-row items-center'>
        <Space>
          <Checkbox
            indeterminate={!isCheck && dataList?.length !== dataSource?.length}
            checked={isCheck}
            onChange={(e) => {
              e.preventDefault();
              if (e?.target?.checked) {
                handleRowClick?.(unionBy([...dataSource, ...selectRows], 'id'));
              } else {
                const ids = dataSource.map((item) => item.id);
                const list = selectRows?.filter((item) => !ids.includes(item.id));
                handleRowClick?.(list);
              }
            }}
          />
          {tableMode === TABLE_MODE_ENUM.CARD ? (
            <span className='text-[#131523]'>本页全选</span>
          ) : null}
        </Space>
        {tableMode === TABLE_MODE_ENUM.CARD && (
          <div className='w-[1px] mx-2 h-[12px] bg-[#D7DBEC]' />
        )}
        <div
          className={cls(
            open && tableMode === TABLE_MODE_ENUM.CARD
              ? styles.customCheckText
              : styles.defaultText,
          )}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <span className='text-[#7E84A3]'>{intlProxy.common.selected}</span>
          <span className='text-[#131523] cursor-pointer mx-1'>{selectRowsNum || 0}</span>
          <span className='text-[#7E84A3]'>{intlProxy.common.item}</span>
        </div>
        {open && tableMode === TABLE_MODE_ENUM.CARD ? renderSelect() : null}
        <Button style={{ marginLeft: 8 }} onClick={handleClear}>
          {intlProxy.common.deselect}
        </Button>
      </div>
      {extraInfo && (
        <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>{extraInfo}</div>
      )}
    </div>
  );
}

export default React.memo(CustomCheck);
