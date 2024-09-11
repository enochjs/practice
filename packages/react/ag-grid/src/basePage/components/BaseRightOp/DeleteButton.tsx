import React from 'react';
import { Tooltip, Button, IconFont, Space } from 'linkmore-design';
import { batchOperate } from 'business-components/components/BatchOperate';
import { useIntlProxy } from '@/hooks';
import { IDeleteConfig, IInvalidConfig } from './interface';
import { BaseTableHandles } from '../BaseTable/interface';

const { LmToolTip } = Tooltip;

interface IDeleteButtonProps {
  tableRef: React.RefObject<BaseTableHandles>;
  btnSorts?: ('delete' | 'invalid')[];
  deleteConfig?: IDeleteConfig;
  invalidConfig?: IInvalidConfig;
}

const DeleteButton = (props: IDeleteButtonProps) => {
  const { tableRef, btnSorts, deleteConfig, invalidConfig } = props;

  const intlProxy = useIntlProxy();

  const handleInvalidClick = () => {
    const records = tableRef?.current?.getSelectedRows() || [];
    if (invalidConfig?.api) {
      return batchOperate({
        data: records,
        tableRef,
        api: invalidConfig.api,
      }).then((result) => {
        if (result === false && invalidConfig?.forceRefresh) {
          tableRef?.current?.refresh();
        }
      });
    }
  };

  const handleDeleteClick = () => {
    const records = tableRef?.current?.getSelectedRows() || [];
    if (deleteConfig?.api) {
      return batchOperate({
        data: records,
        tableRef,
        api: deleteConfig?.api,
      }).then((result) => {
        if (result === false && invalidConfig?.forceRefresh) {
          tableRef?.current?.refresh();
        }
      });
    }

    return Promise.resolve(deleteConfig?.beforeDelete?.(records))
      .then(async () => {
        deleteConfig?.deleteApi?.(records).then(() => {
          tableRef?.current?.refresh();
        });
      })
      .catch((err: any) => {
        console.log('======error1', err);
      });
  };

  const Wrapper = (p: any) =>
    btnSorts?.includes('delete') && btnSorts.includes('invalid') ? (
      <Space.Compact>{p.children}</Space.Compact>
    ) : (
      <>{p.children}</>
    );

  return (
    <Wrapper>
      {btnSorts?.includes('invalid') ? (
        <LmToolTip title={intlProxy.common.void}>
          <Button icon={<IconFont type='icon-feiqi' />} onClick={handleInvalidClick} />
        </LmToolTip>
      ) : null}
      {btnSorts?.includes('delete') ? (
        <LmToolTip title={intlProxy.common.delete}>
          <Button
            icon={<IconFont type='icon-a-tongyongaNlajitong' />}
            onClick={handleDeleteClick}
            className='btn_del'
          />
        </LmToolTip>
      ) : null}
    </Wrapper>
  );
};

export default DeleteButton;
