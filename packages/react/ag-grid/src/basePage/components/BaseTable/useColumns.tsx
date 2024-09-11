import React, { useMemo, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { omit, get, isFunction } from 'lodash';
import { useCacheState } from 'hooks';
import { FORM_RENDER_CHANGE_EVENT } from 'constant/pageConfigEnum';
import common from 'apis/common';
import { formatTimeValue } from 'utils/dateTime';

import { useLanguage } from 'linkmore-intl';
import request from 'services/request';
import { useDebounceFn } from 'ahooks';
import { TableRemark } from 'business-components';
import { useBasePageStore } from '../../store';
import BasePageContext from '../../context';

const handleLanguageForField = (props: any, language: any) => {
  if (Reflect.has(props, 'translations')) {
    const nextLabel = get(props, `translations.${language}`) || props.label;

    return nextLabel;
  }

  return props.label;
};

function useColumns(
  columns: any[],
  defaultCardKeys: string[],
  cardHiddenKeys?: string[],
  roleKeys?: {
    key: string;
    type: PermissionCenter.UFXSCMCloudDomainSharedFieldAuthorityTypeEnum;
  }[],
  useLocalConfig?: boolean,
  updateFlag?: number,
) {
  const context = useContext(BasePageContext);
  const { language } = useLanguage();

  const { configKey } = context;

  const [state, actions] = useBasePageStore((s) => ({
    columnsData: s?.tableConfig,
    cardColumnsData: s?.cardConfig,
  }));

  const columnsData = useCacheState(state.columnsData || []);
  const cardColumnsData = useCacheState(state.cardColumnsData || []);

  // 由form产生的表格列
  const [formCreateColumns, setFormCreateColumns] = useState<any[]>([]);
  // 存储form 产生的 列，用来解决远程的字段可能不在这个范围内的问题 所有列的集合为由本地table columns 列 +
  const extendKeysRef = useRef<string[]>([]);

  const getAllColumnsMap = useCallback(() => {
    const columnsMap: Record<string, any> = {};
    const columnsKey: string[] = [];
    columns.forEach((item: any, index: number) => {
      columnsMap[item.key || item.dataIndex] = {
        ...item,
        sortIndex: index,
        dataIndex: item.dataIndex || item.key,
        hide: item.show === false,
      };
      columnsKey.push(item.key || item.dataIndex);
    });

    const allColumnsKey = Array.from(new Set([...columnsKey, ...extendKeysRef.current]));
    const allColumnsKeyToMap: Record<string, boolean> = {};
    allColumnsKey.forEach((key) => {
      allColumnsKeyToMap[key] = true;
    });
    formCreateColumns.forEach((item) => {
      if (allColumnsKeyToMap[item.key || item.dataIndex]) {
        // 表单设置为隐藏属于最高级别，表格columns 直接删除
        if (item.show === false) {
          delete columnsMap[item.key || item.dataIndex];
        } else {
          columnsMap[item.key || item.dataIndex] = {
            ...item,
            ...columnsMap[item.key || item.dataIndex],
            // show: item.show,
            show: true,
            dataIndex: item.dataIndex || item.key,
            isFormCreate: true,
          };
        }
      }
    });
    return columnsMap;
  }, [columns, formCreateColumns]);

  /**
   * 禁用操作列的点击事件冒泡
   */
  const disableEventColumnClick = (realColumns: any[]) => {
    if (realColumns && realColumns.length) {
      const lastColumn = realColumns?.at(-1);

      /**
       * 符合操作列的特征
       */
      if (lastColumn && (lastColumn?.fixed === 'right' || lastColumn?.key === 'operation')) {
        const rawRender = lastColumn?.render;

        if (rawRender && isFunction(rawRender)) {
          const nextRender = (...props: any) => {
            return React.createElement(
              'div',
              {
                onClick: (e) => {
                  e.stopPropagation();
                },
                onDoubleClick: (e) => {
                  e.stopPropagation();
                },
              },
              rawRender(...props),
            );
          };

          lastColumn.render = nextRender;
        }
      }
    }
  };

  const { run: debounceSetTableConfig } = useDebounceFn(
    (config: any) => {
      actions.setPageConfig(config);
    },
    {
      wait: 1500,
    },
  );

  const { run: debounceSetCardConfig } = useDebounceFn(
    (config: any) => {
      actions.setPageConfig(config);
    },
    {
      wait: 1500,
    },
  );

  // 根据用户列配置，合并本地配置
  const tableColumns = useMemo(() => {
    if (useLocalConfig) {
      return columns;
    }

    let afterTableColumns: any[] = [];
    if (columnsData?.length) {
      const columnsMap: Record<string, any> = {};
      const allColumnsMap = getAllColumnsMap();

      columnsData.forEach((item: any) => {
        if (allColumnsMap[item.key || item.dataIndex]) {
          columnsMap[item.key || item.dataIndex] = {
            ...allColumnsMap[item.key || item.dataIndex],
            ...item,
            title: allColumnsMap[item.key || item.dataIndex]?.title || item.title,
          };
        }
      });

      // 根据fix做排序，否则列表样式会乱掉
      const fixLeftColumns: any[] = [];
      const fixRightColumns: any[] = [];
      const restColumns: any[] = [];
      Object.values(columnsMap).forEach((item) => {
        if (item.fixed === 'left') {
          fixLeftColumns.push(item);
        } else if (item.fixed === 'right') {
          fixRightColumns.push(item);
        } else {
          restColumns.push(item);
        }
      });

      Object.values(allColumnsMap).forEach((item) => {
        const { key, dataIndex } = item || {};
        if (!columnsMap[key || dataIndex]) {
          restColumns.push(item);
        }
      });

      fixLeftColumns.sort((a, b) => a.sortIndex - b.sortIndex);
      fixRightColumns.sort((a, b) => a.sortIndex - b.sortIndex);
      restColumns.sort((a, b) => a.sortIndex - b.sortIndex);
      afterTableColumns = fixLeftColumns.concat(restColumns, fixRightColumns).map((item) => {
        // 时间格式处理
        const dataIndex = item.dataIndex || item.key;

        const isExtendField = dataIndex?.startsWith('labelField_');

        if (isExtendField) {
          return {
            ...item,
            isExtendField: true,
            hide: item.show === false,
            render: (text: any) => {
              const afterFormatTimeValue = formatTimeValue(text);
              if (item?.options) {
                const options = item?.options;

                if (Array.isArray(options) && options.length) {
                  const selectLabels: string[] = [];

                  options.forEach((optionItem) => {
                    if (
                      Array.isArray(afterFormatTimeValue) &&
                      afterFormatTimeValue.includes(optionItem?.value)
                    ) {
                      selectLabels.push(optionItem?.label);
                    } else if (optionItem?.value === afterFormatTimeValue) {
                      selectLabels.push(optionItem?.label);
                    }
                  });

                  return (
                    <TableRemark>{selectLabels.join(',') || afterFormatTimeValue}</TableRemark>
                  );
                }
              } else if (Array.isArray(text)) {
                return <TableRemark>{text?.join('~')}</TableRemark>;
              }
              return <TableRemark>{afterFormatTimeValue}</TableRemark>;
            },
          };
        }

        return item;
      });
    }
    debounceSetTableConfig({
      tableConfig: (columnsData?.length ? afterTableColumns : columns).map((item: any) =>
        omit(item, ['render', 'sorter', 'onFilter', 'filters']),
      ),
    });

    /** TODO: 过滤敏感列字段 是否会对后续保存缓存造成数据缺失？？？ */
    const roleHideKey = roleKeys?.filter((item) => item.type === 0).map((item) => item.key) || [];

    const realColumns = (afterTableColumns.length ? afterTableColumns : columns).map((item) => ({
      ...item,
      hide: item.show === false,
    }));

    disableEventColumnClick(realColumns);

    return realColumns.filter((item) => !roleHideKey?.includes(item?.roleKey || item?.key));
  }, [columns, columnsData, formCreateColumns, updateFlag]);

  const filterCardConfig = (configs: any[]) =>
    configs.filter((c) => !cardHiddenKeys?.includes(c.dataIndex || c.key));

  // 根据用户列配置，合并本地配置
  const cardTableColumns = useMemo(() => {
    let afterCardTableColumns: any[] = [];
    if (cardColumnsData?.length) {
      const columnsMap: Record<string, any> = {};
      const allColumnsMap = getAllColumnsMap();

      cardColumnsData.forEach((item: any) => {
        if (allColumnsMap[item.key || item.dataIndex]) {
          columnsMap[item.key || item.dataIndex] = {
            ...allColumnsMap[item.key || item.dataIndex],
            ...item,
            title: allColumnsMap[item.key || item.dataIndex]?.title || item.title,
            dataIndex: item.dataIndex || item.key,
          };
        }
      });
      afterCardTableColumns = filterCardConfig(Object.values(columnsMap));
    }
    debounceSetCardConfig({
      cardConfig: filterCardConfig(
        (cardColumnsData?.length ? afterCardTableColumns : columns).map((item: any) => {
          return {
            ...omit(item, ['render', 'sorter', 'onFilter', 'filters']),
            show:
              item.show !== undefined
                ? item.show
                : defaultCardKeys.includes(item.key || item.dataIndex),
            dataIndex: item.dataIndex || item.key,
          };
        }),
      ),
    });
    return afterCardTableColumns;
  }, [columns, cardColumnsData, formCreateColumns]);

  // 处理form 产生的 列
  const handleFormConfig = async (formComponentGroups: any[]) => {
    const formColumns: any[] = [];
    const extendKeys: string[] = [];
    for (let groupIndex = 0; groupIndex < formComponentGroups.length; groupIndex++) {
      const module = formComponentGroups[groupIndex] || {};
      const formComponents = module?.formComponents || [];
      if (Array.isArray(formComponents)) {
        for (let index = 0; index < formComponents.length; index++) {
          const field = formComponents[index] || {};

          if (field?.isExtend && field?.canSearch) {
            // 由表格产生的列
            field?.isExtend && extendKeys.push(field?.labelField);
            const canTableEdit = field?.props?.canTableEdit;
            const filedRenderType = field?.props?.componentType;
            const colItem: any = {
              canTableEdit,
              filedRenderType,
              dataIndex: field?.labelField,
              key: field?.labelField,
              title: handleLanguageForField(field.props, language),
              width: 130, // 默认展示100px
            };

            const componentType = get(field, 'props.componentType');

            // eslint-disable-next-line max-depth
            if (componentType === 'Select') {
              const options = get(field, 'props.componentProps.options') || null;

              const interfaceApi = get(field, 'props.interface');

              // eslint-disable-next-line max-depth
              if (interfaceApi) {
                // eslint-disable-next-line max-depth
                try {
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
                  // eslint-disable-next-line no-await-in-loop
                  const response = await getFieldData();

                  colItem.options = response || [];
                } catch (error) {
                  /* empty */
                }
              }

              // eslint-disable-next-line max-depth
              if (options) {
                colItem.options = options;
              }
            }

            formColumns.push(colItem);
          }
        }
      }
    }

    extendKeysRef.current = [...extendKeys];

    // 服了你个老六，这里是ajax或者是event触发，为同步任务，ref设值需要写到前面，好想升到18～～
    setFormCreateColumns(formColumns);
  };

  useEffect(() => {
    const handler = (e: any) => {
      const { detail } = e;
      if (detail?.formKey === configKey && detail?.formComponentGroups?.length && !useLocalConfig) {
        handleFormConfig(detail.formComponentGroups);
      }
    };
    window.addEventListener(FORM_RENDER_CHANGE_EVENT, handler);
    return () => {
      window.removeEventListener(FORM_RENDER_CHANGE_EVENT, handler);
    };
  }, [configKey]);

  useEffect(() => {
    if (!useLocalConfig) {
      common.getNewFormConfig({ id: configKey }).then((response: any) => {
        if (response?.data?.formComponentGroups) {
          handleFormConfig(response.data.formComponentGroups);
        }
      });
    }
  }, [configKey, useLocalConfig]);

  const handleResetConfig = useCallback(
    (needSave = true, type?: 'table' | 'card') => {
      const tableConfigs = Object.values(getAllColumnsMap()).map((item: any) =>
        omit(item, ['render', 'sorter', 'onFilter', 'filters']),
      );
      const cardConfigs = filterCardConfig(tableConfigs);
      if (type === 'table') {
        actions.setPageConfig(
          {
            tableConfig: tableConfigs,
          },
          needSave,
        );
      } else if (type === 'card') {
        actions.setPageConfig(
          {
            cardConfig: cardConfigs.map((item) => ({
              ...item,
              show: defaultCardKeys.includes(item.key || item.dataIndex),
            })),
          },
          needSave,
        );
      } else {
        actions.setPageConfig(
          {
            tableConfig: tableConfigs,
            cardConfig: cardConfigs.map((item) => ({
              ...item,
              show: defaultCardKeys.includes(item.key || item.dataIndex),
            })),
          },
          needSave,
        );
      }
    },
    [columns, formCreateColumns],
  );

  return {
    tableColumns,
    cardTableColumns,
    handleResetConfig,
  };
}

export default useColumns;
