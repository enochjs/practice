import React, { useRef, useImperativeHandle, useCallback, useMemo, useEffect } from 'react';

import { LmTable, message } from 'linkmore-design';

import { omit } from 'lodash';

import { EnumEmptyStatus } from 'business-components/hooks/useTableEmptyProps';
import { CellEditRequestEvent, RowClickedEvent, SortChangedEvent } from 'ag-grid-community';
import { postCommonChangeDynamicExtraProperty } from 'services/DevelopeCenter/Common';
import { useMemoizedFn } from 'ahooks';
import { formatToTableQuery, formatToTableSorter } from '@/utils';

import { useTableEmptyProps } from '../../../../hooks';

import { useBasePageStore } from '../../store';
import { ListTableProps } from './interface';
import AgGridTable, { CoreTableHandle } from '@/components/AgTable';
import CustomPagination from './customPagination';
import CustomSelected from './customSelected';
import { BASE_PAGE_SPLIT_SHOW_EVENT } from '../../enum';

function ListTable<T = any>(props: ListTableProps<T> & { summary?: any }, ref?: React.Ref<any>) {
  const {
    columns = [],
    dataSource = [],
    rowKey = 'id',
    columnsState,
    autoSizer = true,
    loading,
    rowSelection,
    pagination,
    customCheck,
    onRowClick,
    onSearch,
    summary,
    summaryData,
    useLocalConfig,
    portCode = EnumEmptyStatus.Loaderror,
    useAgGrid = false,
    rowHeight,
    ...others
  } = props;

  const [state, actions] = useBasePageStore((s) => ({
    otherConfig: s?.otherConfig,
    tableQueryConfig: s?.tableQueryConfig,
  }));

  const listTableRef: any = useRef(null);
  const listAgTableRef = useRef<CoreTableHandle>(null);

  const [emptyProps] = useTableEmptyProps({ statusCode: portCode, retryExecutor: onSearch });

  // 表格列宽及筛选时出发缓存
  const handleTableFilterOrWidthChange = useCallback(
    (nColumns: Array<any> = []) => {
      actions.setPageConfig(
        {
          tableConfig: nColumns.map((item: any) =>
            omit(item, ['render', 'sorter', 'onFilter', 'filters']),
          ),
        },
        !useLocalConfig,
      );
    },
    [columns, useLocalConfig],
  );

  // 表格onChange拦截处理
  const handleTableChange = useCallback(
    (paginationInfo: any, filters: any, sorter: any) => {
      // filters、sorter需做缓存
      const nFilter = formatToTableQuery(filters, columns);
      const nSorter = formatToTableSorter(sorter);
      actions.setPageConfig(
        {
          tableQueryConfig: {
            ...nFilter,
            ...nSorter,
            pageIndex: paginationInfo.current,
            pageSize: paginationInfo.pageSize,
          },
        },
        !useLocalConfig,
      );
    },
    [columns, useLocalConfig],
  );

  useImperativeHandle(ref, () => {
    return {
      changeSize: useAgGrid ? undefined : listTableRef?.current?.changeSize,
      checkboxRecords: useAgGrid
        ? listAgTableRef.current?.getCheckboxRecords
        : listTableRef?.current?.checkboxRecords,
      clearSelect: () => {
        return useAgGrid
          ? listAgTableRef.current?.clearSelect()
          : listTableRef?.current?.clearSelect();
      },
      columns: useAgGrid ? columns : listTableRef?.current?.columns,
      customSetCheckboxRecords: (...args: any) => {
        return useAgGrid
          ? listAgTableRef.current?.customSetCheckboxRecords(args)
          : listTableRef?.current?.customSetCheckboxRecords(...args);
      },
      getCheckboxRecords: () => {
        return useAgGrid
          ? listAgTableRef.current?.getCheckboxRecords()
          : listTableRef?.current?.getCheckboxRecords();
      },
      openExpandAll: useAgGrid ? listAgTableRef.current?.openExpandAll : undefined,
      closeExpandAll: useAgGrid ? listAgTableRef.current?.closeExpandAll : undefined,
    };
  });

  const innerSummary = useMemo(() => {
    if (!summaryData || !summary) {
      return null;
    }
    if (typeof summary === 'function') {
      return summary({
        ...summaryData,
        items: dataSource,
      } as any);
    }
    const _summary: any = {};
    // summaryData 为接口返回的合计数据，无需手动传入
    const _summaryData: any = summaryData;
    summary.forEach((item: any) => {
      const { dataIndex, render, totalKey } = item;
      _summary[dataIndex] = render
        ? (v: any) => render?.(totalKey ? [{ [dataIndex]: _summaryData[totalKey] }] : v)
        : totalKey
          ? _summaryData[totalKey]
          : true;
    });
    return _summary;
  }, [summaryData, summary]);

  useEffect(() => {
    listAgTableRef.current?.update(dataSource, true);
  }, [dataSource]);

  const statusBar = useMemo(() => {
    return {
      statusPanels: [
        {
          statusPanel: CustomSelected,
          statusPanelParams: {
            total: pagination.total || 0,
            onClear: () => {
              return listAgTableRef.current?.clearSelect();
            },
          },
          align: 'left',
        },
        {
          statusPanel: CustomPagination,
          statusPanelParams: {
            paginationInfo: pagination,
            paginationChange: handleTableChange,
          },
        },
      ],
    };
  }, [pagination]);

  const onSelectionChanged = (evt: any) => {
    const selectRows = listAgTableRef.current?.getCheckboxRecords();
    window.dispatchEvent(
      new CustomEvent('__agStatusSelectionChangedEvent__', {
        detail: {
          selectRowsNum: selectRows?.length || 0,
        },
      }),
    );
  };

  const handleRowClick = useMemoizedFn((e: RowClickedEvent<any, any>) => {
    window.dispatchEvent(
      new CustomEvent(BASE_PAGE_SPLIT_SHOW_EVENT, {
        detail: e.node.data,
      }),
    );
  });

  const gridSortChanged = (params: SortChangedEvent) => {
    const colState = params.api.getColumnState();
    const obj: any = {};
    const sortState = colState
      .sort((a, b) => {
        return (a?.sortIndex || 0) - (b?.sortIndex || 0);
      })
      ?.map((col) => {
        obj[col.colId] = {
          sortOrder: !col.sort ? null : col.sort === 'asc' ? 'ascend' : 'descend',
          sorter: { multiple: col.sortIndex || 0 },
        };
        return { colId: col.colId, sort: col.sort, sortIndex: col.sortIndex };
      })
      .filter((s) => {
        return s.sort != null;
      })
      ?.map((item) => `${item.colId} ${item.sort}`)
      .join();
    actions.setPageConfig(
      {
        tableQueryConfig: {
          ...state.tableQueryConfig,
          sorting: sortState,
        },
        tableConfig: columns?.map((item: any) => {
          const d = omit(item, ['render', 'onFilter', 'filters']);
          if (obj[d.dataIndex]) {
            d.sortOrder = obj[d.dataIndex]?.sortOrder;
            d.agSorterOrder = obj[d.dataIndex]?.sortOrder
              ? obj[d.dataIndex]?.sorter.multiple
              : null;
          }
          return d;
        }),
      },
      !useLocalConfig,
    );
  };

  const agTableHeight = useMemo(() => {
    if (state?.otherConfig) {
      const { previewSize } = state.otherConfig;
      return Number(previewSize) + 4 || 56;
    }
    return 56;
  }, [state.otherConfig]);

  const onCellEditRequest = useCallback(async (event: CellEditRequestEvent) => {
    const oldData = event.data;
    const { field } = event.colDef;
    const { newValue } = event;
    const newData = { ...oldData };
    newData[field!] = event.newValue;
    const tx = {
      update: [newData],
    };
    event.api.applyTransaction(tx);
    await postCommonChangeDynamicExtraProperty({
      primaryKey: oldData.id,
      metadataKey: 'input',
      extraPropertieKey: field,
      extraPropertieValue: `${newValue}`,
    }).catch((error) => {
      console.error('Save Error:', error);
      message.warning('保存失败，请重试！');
      // 接口失败，返回给旧数据
      const od = {
        update: [oldData],
      };
      event.api.applyTransaction(od);
    });
  }, []);

  if (useAgGrid) {
    return (
      <>
        <AgGridTable
          ref={listAgTableRef}
          value={[]}
          loading={loading}
          rowKey={rowKey}
          rowSelection={rowSelection}
          multiSortKey='shift'
          alwaysMultiSort={false}
          suppressColClickSort={false}
          animateRows={false}
          onSelectionChanged={onSelectionChanged}
          filterChange={handleTableFilterOrWidthChange}
          showSerialNumber
          isEdit={false}
          columns={columns}
          onRowClick={handleRowClick}
          height={200}
          onDoubleClick={others.onDoubleClick}
          pagination
          noBorder
          readOnlyEdit
          onSortChanged={gridSortChanged}
          suppressPaginationPanel
          paginationPageSize={pagination.pageSize}
          paginationPageSizeSelector={[20, 50, 100, 500]}
          statusBar={statusBar}
          reactiveCustomComponents
          detailRowHeight={56}
          suppressClickEdit={false}
          singleClickEdit
          // detailRowAutoHeight
          rowHeight={rowHeight || agTableHeight}
          onCellEditRequest={onCellEditRequest}
          expandable={
            others.expandable
              ? {
                  expandedRowKeys: (others.expandable?.expandedRowKeys as string[]) || [],
                  expandedRowRender: others.expandable?.expandedRowRender,
                  rowExpandable: others.expandable?.rowExpandable,
                  expandCellClass: others.expandable?.expandCellClass,
                }
              : undefined
          }
        />
      </>
    );
  }

  return (
    <LmTable
      ref={listTableRef}
      dataSource={dataSource}
      columns={columns}
      emptyProps={emptyProps}
      rowKey={rowKey}
      columnsState={columnsState}
      autoSizer={autoSizer}
      resizeable
      onChange={handleTableChange}
      filterChange={handleTableFilterOrWidthChange}
      {...others}
      size={state.otherConfig?.size}
      pagination={{ ...pagination, size: 'default' }}
      loading={loading}
      customCheck={customCheck}
      rowClick={onRowClick}
      summary={innerSummary}
      rowSelection={rowSelection}
    />
  );
}

export default React.forwardRef(ListTable);
