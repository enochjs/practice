import { CustomStatusPanelProps } from 'ag-grid-react';
import { Pagination, type PaginationProps } from 'linkmore-design';
import React from 'react';

interface IProps extends CustomStatusPanelProps {
  paginationInfo?: PaginationProps;
  paginationChange?: any;
}

const CustomPagination = (props: IProps) => {
  const { paginationInfo, paginationChange } = props;
  const handleTableChange = (page: number, pageSize: number) => {
    paginationChange?.({ current: page, pageSize }, {}, {});
  };

  return (
    <Pagination
      {...paginationInfo}
      onChange={handleTableChange}
      showQuickJumper
      showSizeChanger
      showTotal={(total) => <span className=' mr-2'>{`共 ${total} 条`}</span>}
    />
  );
};

export default CustomPagination;
