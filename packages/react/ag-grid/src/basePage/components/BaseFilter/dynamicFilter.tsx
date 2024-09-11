import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  memo,
  useCallback,
  useContext,
} from 'react';

// eslint-disable-next-line camelcase
import { Button, ComplexFilter, message, Cascader } from 'linkmore-design';
import { set, get, isFunction, result } from 'lodash';
import { DynamicQueryConfig } from 'services/InfrastructureCenter';
import makeDeferred from 'utils/deferred';
import { useCacheState, globalIntlProxy } from 'hooks';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import common from 'apis/common';
import { useLanguage } from 'linkmore-intl';
import { GLOBAL_SEARCH_CONFIG_KEY } from 'layouts/MainHeader/component/searchModal/tabSearch';
import basePageStore, { useBasePageStore } from '../../store';
import { DynamicFilterProps, OptionValue } from './interface';
import BasePageContext from '../../context';
import EmptyImg from '@/assets/png_empty.png';
import request from '@/services/request';
import { TABLE_MODE_ENUM } from '../../enum';
import { camelizeName, formatter, handleLanguageForField } from './utils';
import { postTagGroupListCondition } from '@/services/InfrastructureCenter/TagGroup';

function DynamicFilter(props: DynamicFilterProps, ref?: React.Ref<any>) {
  const {
    enableCustom = true,
    enableComplex = true,
    data,
    globalSearchId = 'id',
    useLocalConfig,
    tableMode,
    tableRef,
    ...restProps
  } = props;

  const context = useContext(BasePageContext);
  const { language } = useLanguage();

  const { configKey } = context;

  /**
   * 存储 menuId和configKey的关系，解决全局搜索路由跳转时，globalState change，上一个页面也会监听到change，触发错误查询问题
   */
  const menuConfigMap = useRef({ menuId: '', configKey: '' });

  useEffect(() => {
    menuConfigMap.current = { menuId: context.menuId, configKey: context.configKey };
  }, []);

  const complexFilterRef: any = useRef({});

  const [dynamicCustomOptions, setDynamicCustomOptions] = useState<OptionValue[]>([]);
  const [afterData, setAfterData] = useState<any[]>([]);

  const [globalState, globalActions] = useBasePageStore(
    (s) => s?.globalSearch,
    GLOBAL_SEARCH_CONFIG_KEY,
  );

  const [state, actions] = useBasePageStore((s) => ({
    searchQueryConfig: s?.searchQueryConfig,
    tableQueryConfig: s?.tableQueryConfig,
    searchConfig: s?.searchConfig,
    tableMode: s?.tableMode || tableMode?.[0] || TABLE_MODE_ENUM.LIST,
  }));

  const cacheSearchConfig = useCacheState(state.searchConfig || []);
  const [menuConfigResolved] = basePageStore.useStore((s) =>
    s.cacheMenuIds.includes(menuConfigMap.current.menuId),
  );

  const initDeferred = useRef(makeDeferred<any[]>());
  const menuConfigResolvedRef = useRef(makeDeferred<boolean>());

  useEffect(() => {
    if (menuConfigResolved) {
      menuConfigResolvedRef.current.resolve(true);
    }
  }, [menuConfigResolved]);

  /** 校验是否可以转换, 转换通过返回转换后的值, 不通过则返回原值 */
  const validParse = (val: any) => {
    try {
      return JSON.parse(val);
    } catch (error) {
      return val;
    }
  };

  function formatDynamicOptions(
    dynamicQueryConfig: InfrastructureCenter.UFXSCMCloudDomainSharedDtosRequestDynamicQueryConfigGetCustomQueryResDto[],
  ) {
    const nextOptions: OptionValue[] = [];
    let defaultConfig = null;
    dynamicQueryConfig?.forEach((item) => {
      const conditions = item.conditionGroups?.[0]?.conditions || [];
      const nextOpItem = {
        label: item?.name,
        relation: conditions[0]?.relation,
        default: item?.isDefault,
        value: item?.id,
        data: conditions.map((cItem) => ({
          field: cItem?.fieldName,
          value: validParse(cItem?.value),
          operator: cItem?.operator,
        })),
      };

      if (item?.isDefault) {
        defaultConfig = nextOpItem;
      }
      nextOptions.push(nextOpItem);
    });

    return {
      dynamicCustomOptions: nextOptions,
      defaultConfig,
    };
  }

  // 根据配置获取查询项数据
  async function getResolvedData(): Promise<IDynamicFilterDataItem[]> {
    const arrayData = isFunction(data) ? await data() : await data;
    const _data = await Promise.all(
      arrayData.map(async (item) => {
        const dataList = isFunction(item.data) ? await item.data() : await item.data;

        return {
          ...item,
          fieldValueSource: item.valueType === 'integer' ? 4 : 0,
          data: formatter(dataList, {
            labelKey: item.labelKey,
            valueKey: item.valueKey,
            childrenKey: item.childrenKey,
          }),
          componentProps: {
            multiple: item.multiple,
          },
        };
      }),
    );
    return _data;
  }

  const handleRefreshData = useMemoizedFn(async (config: any) => {
    const res = await config.api();
    const _afterData = afterData.map((item) => {
      if (item.field === 'TagIds') {
        return {
          ...item,
          data: formatter(res, {
            labelKey: 'name',
            valueKey: 'id',
            childrenKey: 'tags',
          }),
        };
      }

      if (config.field === camelizeName(item.field)) {
        return {
          ...item,
          data: formatter(res, {
            labelKey: item.labelKey,
            valueKey: item.valueKey,
            childrenKey: item.childrenKey,
          }),
        };
      }

      return item;
    });

    setAfterData(_afterData);
  });

  const mergeFiled = (
    localField?: IDynamicFilterDataItem,
    remoteField?: any,
  ): IDynamicFilterDataItem => {
    if (localField?.useLocal) {
      return localField;
    }
    if (localField && remoteField) {
      return {
        ...remoteField,
        operator: remoteField.defaultOperator,
        data: remoteField.data?.length ? remoteField.data : localField.data,
        id: remoteField.id,
        filedId: remoteField.id,
        title: remoteField.title || localField.title,
        fieldValueSource: remoteField.valueType === 'integer' ? 4 : 0,
        componentProps: {
          multiple: remoteField.isMultiple,
          showCheckedStrategy: remoteField.type === 'cascader' ? Cascader.SHOW_CHILD : undefined,
        },
      };
    }
    if (remoteField) {
      return {
        ...remoteField,
        operator: remoteField.defaultOperator,
        componentProps: {
          multiple: remoteField.isMultiple,
          showCheckedStrategy: remoteField.type === 'cascader' ? Cascader.SHOW_CHILD : undefined,
        },
      };
    }
    return localField as IDynamicFilterDataItem;
  };

  async function formatDataSource(
    fieldsOption: InfrastructureCenter.UFXSCMCloudDomainSharedDtosResponseDynamicQueryConfigOptionalFieldQueryResDto,
    resolvedData: IDynamicFilterDataItem[],
  ) {
    if (!fieldsOption?.optionalFields || fieldsOption?.optionalFields?.length === 0) {
      return resolvedData;
    }

    const localKeys = resolvedData.map((item) => camelizeName(item.field!));
    const remoteKeys = fieldsOption.optionalFields.map((item) => camelizeName(item.field!));

    const sortedKeys: string[] = remoteKeys?.length ? remoteKeys : localKeys;

    return sortedKeys.map((key) => {
      const localField = resolvedData.find((item) => camelizeName(item.field!) === key);
      const remoteField = fieldsOption.optionalFields?.find(
        (item) => camelizeName(item.field!) === key,
      );

      const config = mergeFiled(localField, remoteField);

      /* 处理标签查询条件 */
      if (config.field === 'TagIds') {
        return {
          ...config,
          componentProps: {
            ...config.componentProps,
            showCheckedStrategy: Cascader.SHOW_CHILD,
            multiple: true,
            onVisibleChange: (open: boolean) => {
              if (open) {
                handleRefreshData({
                  ...config,
                  api: () => postTagGroupListCondition({ query: '', isCustomShow: true }),
                });
              }
            },
          },
        };
      }

      if (config.refreshType === 'open' && config.api) {
        return {
          ...config,
          componentProps: {
            ...config.componentProps,
            showCheckedStrategy: config.type === 'cascader' ? Cascader.SHOW_CHILD : undefined,
            onVisibleChange: (open: boolean) => {
              if (open) {
                handleRefreshData(config);
              }
            },
          },
        };
      }
      return config;
    });
  }

  const formatNeedPushDataItem = async (field: any) => {
    const componentTypeMap: any = {
      Input: 'input',
      Select: 'select',
      InputNumber: 'input',
      Textarea: 'input',
      DatePicker: 'date',
    };

    const fieldProps: any = field.props || {};
    const componentProps = fieldProps.componentProps || {};
    const picker = componentProps.picker || '';
    const interfaceApi = fieldProps.interface || '';

    const { componentType } = fieldProps;
    let fieldType = componentTypeMap[componentType];

    if (!fieldType) return null;

    if (picker && picker !== 'RangePicker') return null;

    if (picker === 'RangePicker') {
      return null;
    }

    if (componentProps.mode === 'multiple') {
      fieldType = 'checkbox';
    }

    let fieldData: any = [];

    if (componentProps && componentProps.options && componentProps.options.length) {
      fieldData = componentProps.options;
    }

    if (interfaceApi) {
      const getFieldData = () => {
        return new Promise((resolve, reject) => {
          request(interfaceApi, { method: 'GET' })
            .then((response: any) => {
              resolve(response || []);
            })
            .catch((error) => {
              resolve([]);
            });
        });
      };

      fieldData = await getFieldData();
    }

    const configs: any = {
      id: field.labelField,
      type: fieldType,
      title: handleLanguageForField(field?.props, language) || field.label,
      valueType: 'string',
      operator: 'in',
      field: field.labelField,
      key: field.labelField,
      fixed: true,
      data: fieldData,
    };

    if (interfaceApi) {
      configs.labelKey = 'label';
      configs.valueKey = 'value';
    }

    return configs;
  };

  async function filterFormConfigToData(targetList: any) {
    const response: any = await common.getNewFormConfig({ id: configKey });

    const formComponentGroups: any[] = response?.data?.formComponentGroups;

    const needPushData: any[] = [];

    if (formComponentGroups) {
      for (let groupIndex = 0; groupIndex < formComponentGroups.length; groupIndex++) {
        const module = formComponentGroups[groupIndex] || {};
        const formComponents = module?.formComponents || [];

        if (Array.isArray(formComponents)) {
          for (let index = 0; index < formComponents.length; index++) {
            const field = formComponents[index];

            // eslint-disable-next-line max-depth
            if (field?.isExtend && field?.canSearch) {
              // eslint-disable-next-line no-await-in-loop
              const fileConfig = await formatNeedPushDataItem(field);

              // eslint-disable-next-line max-depth
              if (fileConfig) {
                needPushData.push(fileConfig);
              }
            }
          }
        }
      }
    }

    if (needPushData.length) {
      needPushData.forEach((item) => {
        if (targetList && Array.isArray(targetList)) {
          targetList?.push(item);
        }
      });
    }

    return Promise.resolve();
  }

  const init = useMemoizedFn(async () => {
    let fieldsOption: InfrastructureCenter.UFXSCMCloudDomainSharedDtosResponseDynamicQueryConfigOptionalFieldQueryResDto =
      {};

    let dynamicQueryConfig: InfrastructureCenter.UFXSCMCloudDomainSharedDtosRequestDynamicQueryConfigGetCustomQueryResDto[] =
      [];
    if (!useLocalConfig) {
      const [_fieldsOption, _dynamicQueryConfig] = await Promise.all([
        DynamicQueryConfig.getDynamicQueryConfigOptionalFieldsModuleId({
          moduleId: context.menuId,
        }),
        DynamicQueryConfig.getDynamicQueryConfig({ moduleId: context.menuId }),
      ]).catch((e) => {
        console.error('failed to get filter options, error info: ', e);
        return [];
      });

      fieldsOption = _fieldsOption!;
      dynamicQueryConfig = _dynamicQueryConfig!;
      await filterFormConfigToData(fieldsOption?.optionalFields);
    }

    const resolvedData = await getResolvedData().catch((e) => {
      console.log('failed to resolve  filter data, error info:', e);
      return [];
    });

    const _data = await formatDataSource(fieldsOption, resolvedData);

    const dynamicConfig = formatDynamicOptions(dynamicQueryConfig);
    let sortedData: any;

    if (!cacheSearchConfig?.length) {
      actions.setPageConfig({
        searchConfig: _data || [],
      });
      sortedData = _data;
    } else {
      const configs: any[] = [];
      const pushedMap: Record<string, boolean> = {};
      cacheSearchConfig.forEach((c: any) => {
        const config = _data.find((d) => d.field === c.field);
        if (config) {
          configs.push({
            ...config,
            show: c.show,
          });
          pushedMap[config.field] = true;
        }
      });

      _data.forEach((item) => {
        if (!pushedMap[item.field]) {
          configs.push(item);
        }
      });
      sortedData = configs;
    }
    setAfterData(sortedData);
    setDynamicCustomOptions(dynamicConfig.dynamicCustomOptions);
    initDeferred.current.resolve(_data);

    if (dynamicConfig.defaultConfig) {
      complexFilterRef?.current?.onComplexFilter?.(dynamicConfig.defaultConfig);
    } else if (state?.searchQueryConfig) {
      complexFilterRef?.current?.setLocalization?.(state.searchQueryConfig);
    }
  });

  useEffect(() => {
    menuConfigResolvedRef.current.promise.then(() => {
      init();
    });
  }, []);

  const handleSave = useCallback(
    async (customQuery: any, values: any, operateType: string) => {
      const id = customQuery?.value;
      try {
        if (operateType === 'delete') {
          DynamicQueryConfig.deleteDynamicQueryConfigId({ id });
          setDynamicCustomOptions(values);
          return;
        }

        const filterDataMap = {};
        afterData?.forEach((item: any) => {
          set(filterDataMap, item?.field, item?.id);
        });

        const conditions = get(customQuery, 'data', []) || [];
        const createFilterItemParams = {
          name: get(customQuery, 'label'),
          isDefault: get(customQuery, 'default'),
          moduleId: context.menuId,
          conditionGroups: [
            {
              relation: get(customQuery, 'relation'),
              seq: 0,
              conditions: conditions.map((item: any, index: number) => {
                const val = get(item, 'value');
                const value = !!val || typeof val === 'number' ? val : [];
                return {
                  relation: get(customQuery, 'relation'),
                  fieldId: get(filterDataMap, get(item, 'field')) || '',
                  operator: get(item, 'operator'),
                  /** 保存时转换为字符串形式 */
                  value: JSON.stringify(value),
                  seq: index,
                };
              }),
            },
          ],
        };

        if (operateType === 'add') {
          const addId = await DynamicQueryConfig.postDynamicQueryConfigCustomQuery(
            createFilterItemParams,
            { ifHandleError: false },
          );
          /** 手动处理筛选报错问题 */
          if (!addId) {
            message.warning(globalIntlProxy.common.SaveFilterFail);
            return Promise.reject(new Error(globalIntlProxy.common.SaveFilterFail));
          }
          const nValue = values?.map((v: Record<string, any>, idx: number) =>
            idx + 1 === values?.length ? { ...v, value: addId } : v,
          );
          setDynamicCustomOptions(nValue);
          return addId;
        }

        if (['cover', 'default', 'rename'].includes(operateType)) {
          await DynamicQueryConfig.putDynamicQueryConfigId({ id }, createFilterItemParams);
        }
        setDynamicCustomOptions(values);
      } catch (error) {
        message.warning(globalIntlProxy.common.SaveFilterFail);
        return Promise.reject(new Error(globalIntlProxy.common.SaveFilterFail));
      }
    },
    [afterData],
  );

  const handleChange = useCallback(
    (config: any) => {
      let _config = config;
      if (globalState && !useLocalConfig) {
        const searchDateData = globalState.searchDateRange
          ? [
              {
                fieldName: 'CreationTime',
                fieldType: 'datetime',
                type: 'range',
                value: globalState.searchDateRange || [],
                operator: 'between',
              },
            ]
          : [];
        _config = {
          ...config,
          filterQuery: {
            filters: [
              {
                conditions: globalState?.id
                  ? [
                      ...config.filterQuery?.filters?.[0]?.conditions,
                      {
                        fieldName: globalSearchId,
                        fieldType: 'guid',
                        operator: 'equal',
                        type: 'input',
                        value: [globalState.id],
                      },
                    ]
                  : [
                      ...config.filterQuery?.filters?.[0]?.conditions,
                      {
                        fieldName: globalSearchId,
                        fieldType: 'guid',
                        operator: 'in',
                        type: 'input',
                        value: globalState.ids,
                      },
                    ],
              },
            ],
          },
          fuzzyQuery: globalState?.id
            ? config.fuzzyQuery
            : {
                filters: [
                  {
                    conditions: [...config.fuzzyQuery?.filters?.[0]?.conditions, ...searchDateData],
                  },
                ],
              },
          basicFilter: {},
          tableQuery: { filters: [{ conditions: [] }] },
        };
      }

      const callback = props.onChange?.(_config);

      actions.setPageConfig({
        searchQueryConfig: callback || _config,
        tableQueryConfig: {
          ...state.tableQueryConfig,
          pageIndex: 1,
        },
      });
      tableRef?.current?.clearSelectRows();
    },
    [globalState],
  );

  const updateSearchQueryConfig = useCallback((config: any) => {
    initDeferred.current.promise.then(() => {
      actions.setPageConfig({
        searchQueryConfig: config,
      });
      complexFilterRef?.current?.setLocalization?.(config);
    });
  }, []);

  const appendSearchQueryConfig = (config: any) => {
    actions.setPageConfig({
      searchQueryConfig: {
        ...state.searchQueryConfig,
        ...config,
      },
    });
  };

  useUpdateEffect(() => {
    initDeferred.current.promise.then((config: any[]) => {
      if (cacheSearchConfig?.length) {
        const configMap = new Map<string, any>();
        config?.forEach((c: any) => {
          configMap.set(c.field, c);
        });
        const _configs = cacheSearchConfig.map((c) => {
          const _c = configMap.get(c.field);
          configMap.delete(c.field);
          return c;
        });
        configMap.forEach((v) => {
          _configs.push(v);
        });
        // 新增的放在后面
        setAfterData(_configs.filter((item) => item));
      }
    });
  }, [cacheSearchConfig]);

  useImperativeHandle(ref, () => ({
    ...complexFilterRef.current,
    updateSearchQueryConfig,
    appendSearchQueryConfig,
    updateAfterData: (res: any[]) => setAfterData(res),
    getAfterData: () => afterData,
    resetSearchConfig: (needSave = true) => {
      initDeferred.current.promise.then((values: any) => {
        actions.setPageConfig(
          {
            searchConfig: values || [],
          },
          needSave,
        );
      });
    },
  }));

  const mountRef = useRef(false);

  useEffect(() => {
    if (
      (globalState?.searchKey || globalState?.imgUrl || globalState?.searchDateRange) &&
      menuConfigMap.current.menuId === context.menuId &&
      menuConfigMap.current.configKey === context.configKey &&
      !useLocalConfig
    ) {
      complexFilterRef.current?.setLocalization();

      const searchDateData = globalState.searchDateRange
        ? [
            {
              fieldName: 'CreationTime',
              fieldType: 'datetime',
              type: 'range',
              value: globalState.searchDateRange || [],
              operator: 'between',
            },
          ]
        : [];
      const updater = () =>
        actions.setPageConfig({
          searchQueryConfig: {
            filterQuery: {
              filters: [
                {
                  conditions: globalState.id
                    ? [
                        {
                          fieldName: globalSearchId,
                          fieldType: 'guid',
                          operator: 'equal',
                          type: 'input',
                          value: [globalState.id],
                        },
                      ]
                    : [
                        {
                          fieldName: globalSearchId,
                          fieldType: 'guid',
                          operator: 'in',
                          type: 'input',
                          value: globalState.ids || [],
                        },
                      ],
                },
              ],
            },
            fuzzyQuery: globalState.id
              ? undefined
              : {
                  filters: [
                    {
                      conditions: [...searchDateData],
                    },
                  ],
                },
            basicFilter: {},
            tableQuery: { filters: [{ conditions: [] }] },
          },
          tableQueryConfig: {
            ...state.tableQueryConfig,
            pageIndex: 1,
          },
          tableMode:
            globalState.type === 'img'
              ? TABLE_MODE_ENUM.IMG
              : state.tableMode || TABLE_MODE_ENUM.LIST,
        });

      if (mountRef.current) {
        updater();
        tableRef?.current?.clearSelectRows();
      } else {
        setTimeout(() => {
          // 延迟请求，解决远程接口返回数据覆盖当前参数的问题，后续优化
          updater();
          tableRef?.current?.clearSelectRows();
        }, 600);
      }
    }
  }, [globalState]);

  useEffect(() => {
    mountRef.current = true;
  }, []);

  const handleClearQuery = () => {
    globalActions.setPageConfig({
      globalSearch: undefined,
    });
    complexFilterRef.current?.setLocalization();

    actions.setPageConfig({
      searchQueryConfig: {
        sorting: 'creationTime desc',
        filterQuery: { filters: [{ conditions: [] }] },
        basicFilter: {},
        tableQuery: { filters: [{ conditions: [] }] },
      },
    });
  };

  const renderGlobalSearch = () => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '22px',
            marginBottom: 'var(--lm-margin-md)',
            color: 'var(--lm-primary-color-case5)',
            fontWeight: 600,
            fontSize: 'var(--lm-font-size-lgg)',
          }}
        >
          {globalState?.imgUrl ? (
            <div>搜图结果</div>
          ) : (
            <div className='flex flex-1 items-center overflow-hidden'>
              <span className='mr-1'>搜索</span>
              {globalState?.searchDateRange ? (
                <div className=' bg-standard-2 text-standard-5 rounded-8 font-normal text-lm14 px-1 py-[2px] mx-1'>
                  {globalState.searchDateRange[0]}到{globalState.searchDateRange[1]}
                </div>
              ) : null}
              <span className='flex flex-1 overflow-hidden items-center'>
                <span className='whitespace-nowrap overflow-hidden text-ellipsis'>
                  {globalState?.searchKey}
                </span>
                <span className=' ml-1 whitespace-nowrap'>的结果</span>
                <Button type='link' onClick={handleClearQuery}>
                  清空所有查询
                </Button>
              </span>
            </div>
          )}
        </div>
        {globalState?.imgUrl ? (
          <div className='w-[100px] h-[100px] rounded-8 border-standard-2 border border-solid flex items-center justify-center mb-3'>
            <img
              src={
                globalState?.imgUrl
                  ? `${globalState?.imgUrl}?x-oss-process=image/resize,m_pad,w_100`
                  : EmptyImg
              }
              alt='img'
              className='rounded'
              style={{ width: '84px', height: '84px' }}
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div>
      {(globalState?.searchKey || globalState?.imgUrl || globalState?.searchDateRange) &&
      !useLocalConfig
        ? renderGlobalSearch()
        : null}
      <ComplexFilter
        ref={complexFilterRef}
        dataSource={afterData || []}
        {...restProps}
        enableComplex={enableComplex}
        customOptions={dynamicCustomOptions}
        enableCustom={enableCustom}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}

const MemoFilter = memo(React.forwardRef(DynamicFilter));

MemoFilter.displayName = 'BaseFilter';

export default MemoFilter;
