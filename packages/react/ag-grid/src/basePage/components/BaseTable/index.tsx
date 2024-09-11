import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useContext,
  useCallback,
} from 'react';

import { cloneDeep, flattenDeep, get, uniq } from 'lodash';

import { useDebounceFn, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useCacheState } from 'hooks';
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom';

import { useSearchParams } from 'react-router-dom';
import { useActivate, useUnactivate } from 'react-activation';

import makeDeferred from 'utils/deferred';
import basePageStore, { useBasePageStore } from '../../store';
import BasePageContext from '../../context';
import CustomCheck from './customCheck';
import ListTable from './listTable';
import { BaseTableHandles, BaseTableProps } from './interface';
import CardTable from './cardTable';
import ChartTable from './chartTable';
import { BASE_PAGE_SPLIT_SHOW_EVENT, TABLE_MODE_ENUM } from '../../enum';
import useColumns from './useColumns';
import { approvalIdKey, todoApprovalIdKey } from '@/constant/common';
import { mergeFilterQueryConditions } from '@/utils/basePage';
import { tableColumnItem } from './DynamicControl';

function BaseTable<T extends TABLE_MODE_ENUM[] = [TABLE_MODE_ENUM.LIST]>(
  props: BaseTableProps<T>,
  ref?: React.Ref<BaseTableHandles>,
) {
  const aliasProps = props as unknown as BaseTableProps<
    [TABLE_MODE_ENUM.IMG, TABLE_MODE_ENUM.LIST]
  >;

  const commonProps = {
    pagination: aliasProps.pagination || {
      pageSize: 20,
      pageIndex: 1,
      total: 0,
      pageSizeOptions: [20, 50, 100, 500, 1000],
    },
    autoSearch: aliasProps.autoSearch || true,
    api: aliasProps.api,
    apiHooks: aliasProps.apiHooks,
    rowKey: aliasProps.rowKey || 'id',
    size: aliasProps.size || 'default',
    virtual: aliasProps.virtual || false,
    rowSelection: aliasProps.rowSelection,
    onRowClick: aliasProps.onRowClick,
    onDoubleClick: aliasProps.onDoubleClick,
    columns: aliasProps.columns,
    useLocalConfig: aliasProps.useLocalConfig || false,
    customCheckProps: aliasProps.customCheckProps || {},
    useCustomUpdate: aliasProps.useCustomUpdate || false,
  };

  const tableProps = {
    columnsState: aliasProps.columnsState,
    autoSizer: aliasProps.autoSizer,
    showClickBorder: aliasProps.showClickBorder || false,
    selectRowChange: aliasProps.selectRowChange,
    summary: aliasProps.summary,
    expandable: aliasProps.expandable,
    components: aliasProps.components,
    useAgGrid: props.useAgGrid,
    rowClassName: aliasProps.rowClassName,
    roleFiledKeys: aliasProps.roleFiledKeys,
    rowHeight: aliasProps.rowHeight,
  };

  const cardProps = {
    cardType: aliasProps.cardType,
    cardHeight: aliasProps.cardHeight,
    cardRowConfig: aliasProps.cardRowConfig,
    cardCellConfig: aliasProps.cardCellConfig,
    cardCheckboxConfig: aliasProps.cardCheckboxConfig,
    cardComponent: aliasProps.cardComponent,
    cardCheckbox: aliasProps.cardCheckbox,
    cardImgUrl: aliasProps.cardImgUrl,
    cardTitle: aliasProps.cardTitle,
    cardCode: aliasProps.cardCode,
    cardDesc: aliasProps.cardDesc,
    cardExtra: aliasProps.cardExtra,
    cardExtend: aliasProps.cardExtend,
    cardFooter: aliasProps.cardFooter,
    cardDefaultShowKeys: aliasProps.cardDefaultShowKeys,
    cardHiddenKeys: aliasProps.cardHiddenKeys,
    cardPagerConfig: aliasProps.cardPagerConfig,
  };

  const [selectRows, setInnerSelectRows] = useState<Array<any>>([]);
  const [updateFlag, setUpdateFlag] = useState(1);

  // 解决组件嵌套深时，将tableRef 存到 mbox 中，拿不到最新的selectRows 问题
  const selectRowsRef = useRef(selectRows);
  const setSelectRows = (args: any) => {
    unstable_batchedUpdates(() => {
      setInnerSelectRows(args);
      setUpdateFlag((pre) => pre + 1);
    });

    selectRowsRef.current = args;
  };

  const [innerPagination, setInnerPagination] = useState(commonProps.pagination);

  const context = useContext(BasePageContext);

  const [urlParams] = useSearchParams();

  const { configKey, filedAuthority = [] } = context;

  const initDeferred = useRef(makeDeferred());
  const isResolvedRef = useRef(false);

  const [isResolved] = basePageStore.useStore((s) => s.cacheMenuIds.includes(context.menuId));

  useEffect(() => {
    if (isResolved) {
      isResolvedRef.current = true;
      initDeferred.current.resolve(true);
    }
  }, [isResolved]);

  const [state, actions] = useBasePageStore((s) => ({
    searchQueryConfig: s?.searchQueryConfig,
    tableQueryConfig: s?.tableQueryConfig,
    cardColumnsData: s?.cardConfig,
    otherConfig: s?.otherConfig,
    tableMode: s?.tableMode || aliasProps.tableMode?.[0] || TABLE_MODE_ENUM.LIST,
    searchConfig: s?.searchConfig,
  }));

  const searchQueryConfig = useCacheState(state.searchQueryConfig || {});
  const tableQueryConfig = useCacheState(state.tableQueryConfig || {});
  const tableQueryConfigRef = useRef(tableQueryConfig);

  const { tableColumns, cardTableColumns, handleResetConfig } = useColumns(
    commonProps.columns,
    cardProps.cardDefaultShowKeys || [],
    cardProps.cardHiddenKeys || [],
    filedAuthority,
    commonProps.useLocalConfig,
    updateFlag,
  );

  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [portCode, setPortCode] = useState<any>(200);
  // 接口返回的合计数据
  const [summaryData, setSummaryData] = useState<Record<string, any>>({});
  // 标记请求是否有效
  const fetchRef = useRef(0);

  const filterQueryFromApproval = getFilterQueryFromApproval();

  const searchParams = useRef<any>({
    pageIndex: innerPagination?.pageIndex || 1,
    pageSize: innerPagination?.pageSize || 20,
    ...tableQueryConfig,
    ...searchQueryConfig,
    filterQuery: mergeFilterQueryConditions(
      searchQueryConfig?.filterQuery,
      filterQueryFromApproval,
    ),
    fuzzyQuery: searchQueryConfig?.fuzzyQuery,
    fuzzyFilter: searchQueryConfig?.fuzzyFilter,
    basicFilter: searchQueryConfig?.basicFilter,
  }); // 页面所有搜索条件

  const listTableRef = useRef<BaseTableHandles>(null);
  const cardTableRef: any = useRef(null);

  const controllerRef = useRef<AbortController>();

  /** 消息页面跳转 审批流ID进行过滤 */
  function getFilterQueryFromApproval() {
    const approvalId = urlParams.get(approvalIdKey) || urlParams.get(todoApprovalIdKey);

    let filterQuery = {};

    if (approvalId) {
      filterQuery = {
        filters: [
          {
            conditions: [
              {
                fieldType: 'guid',
                operator: 'equal',
                type: 'input',
                fieldName: 'id',
                value: [approvalId],
              },
            ],
          },
        ],
      };
    }

    return filterQuery;
  }

  /** 针对级联多选数据, 后端要求传入末级ID, 返回值应是一维数组
   * 针对查空的问题, 将[""]转为[]
   */
  const getDeepLastValue = (value: Array<string[] | string>): string[] => {
    if (Array.isArray(value)) {
      return uniq(
        flattenDeep(value.map((k: any) => (Array.isArray(k) ? k[k.length - 1] : k))),
      ).filter((v) => !!v || typeof v === 'number');
    }
    return value;
  };

  /** 针对联级做数据的特殊处理 */
  const transformConditions = (conditions: any[]) => {
    if (!conditions) return [];
    return conditions.map((item) => {
      // 支持了为空/不为空的查询, 但接口需要equal/not_equal, 所以要做个转换
      const operatorMap: any = { empty: 'equal', not_empty: 'not_equal' };
      const operator = operatorMap[item.operator] || item.operator;
      return { ...item, operator, value: getDeepLastValue(item.value) };
    });
  };

  const handleSearch = useMemoizedFn(() => {
    if (!isResolvedRef.current) {
      return;
    }
    // 之前有发起的请求，则取消
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    setLoading(true);

    const params = {
      ...searchParams.current,
      filterQuery: {
        ...searchParams.current.filterQuery,
        filters: searchParams.current.filterQuery?.filters?.map((item: any) => ({
          ...item,
          conditions: transformConditions(item.conditions),
        })),
      },
    };

    commonProps
      .api(
        cloneDeep({
          ...params,
          sorting: params.sorting || 'creationTime desc',
          formKey: configKey,
          pageIndex: searchParams.current.pageIndex || 1,
        }),
        {
          signal: controllerRef.current.signal,
        },
      )
      .then((res: any) => {
        if (fetchId !== fetchRef.current) {
          // 解决请求顺序问题
          return;
        }
        const { items = [], totalCount, pageIndex, pageSize, totalPages, ...restData } = res || {};
        unstable_batchedUpdates(() => {
          setData(
            items.map((item: any, index: number) => ({
              ...item,
              feDataIndex: (pageIndex - 1) * pageSize + index + 1,
            })),
          );
          setInnerPagination({
            ...innerPagination,
            current: pageIndex,
            pageSize,
            total: totalCount || 0,
          });
          // 解决最后一页最后一条数据删除时，查询结果为空的问题。
          if (pageIndex > totalPages) {
            actions.setPageConfig(
              {
                tableQueryConfig: {
                  ...state.tableQueryConfig,
                  pageIndex: totalPages || 1,
                  pageSize,
                },
              },
              !commonProps.useLocalConfig,
            );
          }

          setSummaryData(restData);
          setLoading(false);
          setUpdateFlag((pre) => pre + 1);
        });
      })
      .catch((err: any) => {
        // 请求取消不做操作
        if (err?.code === 'ERR_CANCELED') {
          return;
        }
        setPortCode(err?.code);
        setLoading(false);
      });
  });

  const afterData = useMemo(() => {
    return data.map((dataItem: any) => {
      return {
        ...dataItem,
        ...(dataItem?.dynamicExtraProperty || {}),
      };
    });
  }, [data]);

  useEffect(() => {
    if (commonProps.autoSearch) {
      initDeferred.current.promise.then(() => {
        if (fetchRef.current === 0) {
          handleSearch();
        }
      });
    }
  }, []);

  useEffect(
    () => () => {
      actions.setPageConfig(
        {
          tableQueryConfig: {
            ...tableQueryConfigRef.current,
            // 这里按产品要求，标签页关闭，再打开要是第一页，所以这里强制设置为1
            pageIndex: 1,
          },
        },
        false,
      );
    },
    [],
  );

  useUpdateEffect(() => {
    searchParams.current = {
      ...searchParams.current,
      ...searchQueryConfig,
      ...tableQueryConfig,
      filterQuery: mergeFilterQueryConditions(
        searchQueryConfig?.filterQuery,
        filterQueryFromApproval,
      ),
      fuzzyQuery: searchQueryConfig?.fuzzyQuery,
      basicFilter: searchQueryConfig?.basicFilter,
      fuzzyFilter: searchQueryConfig?.fuzzyFilter,
    };

    handleSearch();
    tableQueryConfigRef.current = tableQueryConfig;
  }, [tableQueryConfig, searchQueryConfig]);

  const rowSelection = useMemo(() => {
    return {
      ...commonProps.rowSelection,
      selectedRowKeys: selectRows.map((item) => get(item || {}, commonProps.rowKey || 'id')),
      selectedRows: selectRows,
    };
  }, [commonProps.rowSelection, selectRows]);

  const handleRowClick = useCallback((args: any) => {
    setSelectRows([...args]);
    commonProps.onRowClick?.([...args]);
  }, []);

  const handleRowSelectChange = useCallback((args: any) => {
    tableProps.selectRowChange?.(args);
    window.dispatchEvent(
      new CustomEvent(BASE_PAGE_SPLIT_SHOW_EVENT, {
        detail: args,
      }),
    );
  }, []);

  const getSelectRows = () => {
    if (tableProps.useAgGrid && state.tableMode === TABLE_MODE_ENUM.LIST) {
      return listTableRef.current?.getCheckboxRecords();
    }
    return (selectRowsRef.current || []).map((item: any) => {
      const _data = data.find((i: any) => i[commonProps.rowKey] === item[commonProps.rowKey]);
      return _data || item;
    });
  };

  const handleClearSelectRows = useCallback(() => {
    setSelectRows([]);
    listTableRef?.current?.clearSelect();
  }, []);

  useImperativeHandle(ref, () => {
    return {
      customSetCheckboxRecords: (arg: string[]) => setSelectRows(arg),
      getSelectedRows: () => getSelectRows(),
      getSelectedRowKeys: () => rowSelection?.selectedRowKeys || [],
      getSearchParams: () =>
        cloneDeep({
          ...searchParams.current,
          formKey: configKey,
        }),

      resetTableConfig: handleResetConfig,
      clearSelectRows: handleClearSelectRows,
      setSelectRows: (args: any[]) => setSelectRows(args),
      ...(([TABLE_MODE_ENUM.IMG, TABLE_MODE_ENUM.CARD].includes(state.tableMode)
        ? cardTableRef.current
        : listTableRef.current) || {}),
      refresh: handleSearch,
      updateFlagCount: () => {
        setUpdateFlag((pre) => pre + 1);
      },
    };
  });

  const handleCheckBoxChange = useCallback((checked: boolean, record: any) => {
    if (checked) {
      setSelectRows([...selectRowsRef.current, record]);
    } else {
      setSelectRows(
        selectRowsRef.current.filter(
          (item) => item[commonProps.rowKey] !== record[commonProps.rowKey],
        ),
      );
    }
    // setSelectRows(args);
  }, []);

  const activeRef = useRef<boolean>(true);

  useActivate(() => {
    activeRef.current = true;
  });

  useUnactivate(() => {
    activeRef.current = false;
  });

  const { run: handleDebounceSearch } = useDebounceFn(
    () => {
      if (!activeRef.current) {
        handleSearch();
      }
    },
    {
      maxWait: 3000,
      wait: 1500,
      leading: false,
      trailing: true,
      ...props.apiHookOptions,
    },
  );

  const handleApiHooksListener = useCallback((e?: CustomEvent<{ flush: boolean }>) => {
    if (tableProps?.useAgGrid) {
      handleSearch();
    } else {
      handleDebounceSearch();
      if (e?.detail.flush) {
        handleDebounceSearch.flush();
      }
    }
  }, []);

  useEffect(() => {
    commonProps.apiHooks?.forEach((item) => {
      window.addEventListener(item.feTraceId, handleApiHooksListener as any);
    });
    return () => {
      commonProps.apiHooks?.forEach((item) => {
        window.removeEventListener(item.feTraceId, handleApiHooksListener as any);
      });
    };
  }, [commonProps.apiHooks]);

  const transExtendColumns = useMemo(() => {
    return tableColumns?.map((item) => {
      if (item.isExtendField && item.canTableEdit && !tableProps.useAgGrid) {
        return tableColumnItem(item, handleSearch);
      }
      return item;
    });
  }, [tableColumns]);

  if (state.tableMode === TABLE_MODE_ENUM.CARD) {
    return (
      <ChartTable
        {...aliasProps}
        loading={loading}
        portCode={portCode}
        rowKey={commonProps.rowKey}
        ref={cardTableRef}
        dataSource={afterData}
        columns={cardTableColumns}
        onSearch={handleSearch}
        rowSelection={commonProps.rowSelection === false ? false : rowSelection}
        pagination={{ ...innerPagination, size: commonProps.size }}
        onRowClick={handleRowClick}
        onDoubleClick={commonProps.onDoubleClick}
        customCheck={
          !!selectRows?.length && (
            <CustomCheck
              tableMode={state.tableMode}
              handleRowClick={handleRowClick}
              dataSource={afterData}
              total={innerPagination.total}
              selectRowsNum={selectRows?.length}
              onClear={handleClearSelectRows}
              selectRows={selectRows}
              onChange={handleCheckBoxChange}
              {...commonProps.customCheckProps}
            />
          )
        }
      />
    );
  }
  if (state.tableMode === TABLE_MODE_ENUM.IMG) {
    return (
      <CardTable
        {...cardProps}
        loading={loading}
        portCode={portCode}
        rowKey={commonProps.rowKey}
        ref={cardTableRef}
        dataSource={afterData}
        columns={cardTableColumns}
        onSearch={handleSearch}
        rowSelection={commonProps.rowSelection === false ? false : rowSelection}
        pagination={{ ...innerPagination, size: commonProps.size }}
        onRowClick={handleRowClick}
        onDoubleClick={commonProps.onDoubleClick}
        virtual={commonProps.virtual}
        customCheck={({
          state: cardState,
          setCheckboxKeys,
        }: {
          state: any;
          setCheckboxKeys: (keys: any, checked?: boolean, reset?: boolean) => void;
        }) => {
          if (cardState.checkboxConfig.checkKeys?.length > 1) {
            return (
              <CustomCheck
                tableMode={state.tableMode}
                handleRowClick={handleRowClick}
                dataSource={afterData}
                total={innerPagination.total}
                selectRowsNum={selectRows?.length}
                onClear={() => {
                  handleClearSelectRows();
                  setCheckboxKeys([], false, true);
                }}
                selectRows={selectRows}
                onChange={handleCheckBoxChange}
                {...commonProps.customCheckProps}
              />
            );
          }
          return <div />;
        }}
      />
    );
  }

  return (
    <ListTable
      ref={listTableRef}
      {...tableProps}
      dataSource={afterData}
      portCode={portCode}
      rowKey={commonProps.rowKey}
      columns={transExtendColumns}
      onSearch={handleSearch}
      pagination={{ ...innerPagination, size: commonProps.size }}
      loading={loading}
      // virtual={commonProps.virtual}
      virtual={
        [null, undefined].includes(commonProps.virtual)
          ? innerPagination.pageSize > 50
          : commonProps.virtual
      }
      onRowClick={handleRowClick}
      selectRowChange={handleRowSelectChange}
      onDoubleClick={commonProps.onDoubleClick}
      customCheck={
        <CustomCheck
          tableMode={state.tableMode}
          dataSource={afterData}
          total={innerPagination.total}
          selectRowsNum={selectRows?.length}
          onClear={handleClearSelectRows}
          selectRows={selectRows}
          onRowClick={handleRowClick}
          onChange={handleCheckBoxChange}
          {...commonProps.customCheckProps}
        />
      }
      rowSelection={commonProps.rowSelection === false ? false : rowSelection}
      summaryData={summaryData}
      summary={tableProps.summary}
      useLocalConfig={commonProps.useLocalConfig}
      updateFlag={updateFlag}
    />
  );
}

const memoBaseTable = React.forwardRef(BaseTable);
memoBaseTable.displayName = 'BaseTable';
export default memoBaseTable;
