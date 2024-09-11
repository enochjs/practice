import { CustomTableOption, Space, Button, IconFont, message, Tooltip } from 'linkmore-design';
import { useIntl } from 'linkmore-intl';
import { useIntlProxy, globalIntlProxy } from 'hooks';
import { useRef, ReactNode, useState, useMemo } from 'react';
import LogMobx from 'stores/log.mobx';
import TagModal, { TAB_OPERATE_ENUM } from 'business-components/components/TagModal';
import { postMoudlePageConfigClearMoudlePageConfigsByModuleIdModuleId } from 'services/InfrastructureCenter/MoudlePageConfig';
import { defaultExcludeKeys } from 'business-components/components/ImportModalV2/Table';
import headerTabsStore from 'layouts/MainHeader/component/tabs/store';
import { exGo } from 'utils/exgo';
import { useLocation } from 'react-router-dom';
import { postCommonDocumentMark } from '@/services/DevelopeCenter/Common';
import { common } from '@/apis';
import styles from './index.module.less';
import { useBasePageStore } from '../../store';
import { TABLE_MODE_ENUM } from '../../enum';
import PrintButton from './PrintButton';
import { BaseRightOpProps, RightOpActions } from './interface';
import DeleteButton from './DeleteButton';
import ToggleView from './ToggleButton';
import ImportTableButton from './ImportTableButton';
import ImportImgButton from './ImportImgButton';

const { LmToolTip } = Tooltip;

function BaseRightOp<T extends Record<string, React.ReactNode>>(props: BaseRightOpProps<T>) {
  const intlProxy = useIntlProxy();

  const btnSeq = [
    'version',
    'expand',
    'invalid',
    'delete',
    'tag',
    'print',
    'importTable',
    'exportTable',
    'importImg',
    'exportImg',
    'log',
    'group',
    'refresh',
    'setting',
    'toggle',
  ];

  const {
    tableMode,
    group,
    enableCardMode = true,
    filterRef,
    tableRef,
    rowKey,
    btnSorts = btnSeq,
    importTableConfig = {
      uploadDir: 'Supplier',
      excludeKeys: [...defaultExcludeKeys],
    },
    exportTableConfig = {},
    importImgConfig,
    exportImgConfig,
    tagConfig,
    deleteConfig,
    invalidConfig,
    extraButtons = {},
    enablePreviewSize,
    moduleUniqueIdentifier,
  } = props;

  const customRef = useRef<any>(null);

  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const location = useLocation();

  const sortedBtnSorts = useMemo(() => {
    // 视图切换按钮必然存在
    const resetBtnSorts = [btnSorts].includes('toggle') ? btnSorts : [...btnSorts, 'toggle'];
    return resetBtnSorts
      .filter((item) => !btnSeq.includes(item))
      .concat(btnSeq.filter((item) => resetBtnSorts.includes(item)));
  }, [btnSorts]);

  const [state, actions] = useBasePageStore((s) => ({
    tableConfig: s?.tableConfig,
    searchConfig: s?.searchConfig,
    cardConfig: s?.cardConfig,
    otherConfig: s?.otherConfig,
    tableMode: s?.tableMode || tableMode?.[0] || TABLE_MODE_ENUM.LIST,
  }));

  const { $t } = useIntl();

  const autoFocus = () => {
    const doms = document.querySelectorAll('.auto_focus');
    if (doms?.length) {
      doms.forEach((dom: any) => {
        dom?.blur();
      });
    }
  };

  // 更新用户页面配置
  const saveConfigEvent = (values: any) => {
    const { filterData, columnsData, saveSetting, size, cardMode, cardData, previewSize } = values;
    actions.setPageConfig(
      {
        searchConfig: filterData,
        tableConfig: columnsData.map((item: any) => ({
          ...item,
          sortIndex: item.order,
        })),
        cardConfig: cardData,
        otherConfig: { saveSetting, size, cardMode, previewSize },
      },
      true,
    );
    tableRef?.current?.updateFlagCount();
  };

  const [menuId] = headerTabsStore.useStore(
    (s) => s.moduleMap?.get(location.pathname)?.moduleId || '',
  );

  // 重置用户页面配置
  const resetUserPageConfigEvent = () => {
    // 删除数据库数据
    postMoudlePageConfigClearMoudlePageConfigsByModuleIdModuleId({
      moduleId: menuId!,
    });
    tableRef?.current?.resetTableConfig(false);
    filterRef?.current?.resetSearchConfig(false);
    actions.setPageConfig(
      {
        otherConfig: {},
        tableMode: tableMode?.[0] || TABLE_MODE_ENUM.LIST,
      },
      true,
    );
  };

  const handleReset = async (data: { type: 'table' | 'filter' | 'card' }) => {
    const { type } = data;
    switch (type) {
      case 'table':
        await tableRef?.current?.resetTableConfig(true, 'table');
        break;
      case 'card':
        await tableRef?.current?.resetTableConfig(true, 'card');
        break;
      case 'filter':
        await filterRef?.current?.resetSearchConfig(true);
        break;
      default:
        break;
    }
    /** 用于更新数据: onUpdate({filter: [...], columns: [...], card: [...]}) */
    customRef.current.onUpdate();
  };

  const handleGoToLogPage = () => {
    /** 跳转日志页面 */
    /** 在跳转之前在本地暂存当前表格勾选的ids */
    const SelectRows = tableRef?.current?.getSelectedRows?.() || [];
    LogMobx.setStageLog({
      key: menuId,
      list: SelectRows?.length ? SelectRows?.map((item) => item?.id) : [],
    });
    exGo(`/settings/log?menuId=${menuId}`);
  };

  // 打标签接口调用
  const handleSaveTag = async (tags: any[], operateType: TAB_OPERATE_ENUM) => {
    try {
      const selectRow = tableRef?.current?.getSelectedRows();
      const tagIds = tags?.map((item: any) => item?.id);
      if (!tagIds?.length) {
        message.error('请选择要打标的数据');
        return;
      }
      const params: any = selectRow?.map((item: any) => {
        return {
          objId: tagConfig?.paramsNames ? item[tagConfig?.paramsNames] : item?.id,
          tagIds,
          menuId,
          operateType,
        };
      });
      console.log('params', params, selectRow);

      await common.setBusinessTag(
        params,
        tagConfig && tagConfig.api && tagConfig.objType
          ? {
              api: tagConfig.api! as typeof postCommonDocumentMark,
              objType: tagConfig.objType!,
            }
          : undefined,
      );
      message.success(globalIntlProxy.common.czScuess /* ts-morph: 操作成功！ */);
      tableRef?.current?.refresh();
    } catch (err) {
      console.log('err', err);
    }
  };

  const tableModeChange = (mode: TABLE_MODE_ENUM) => {
    actions.setPageConfig({ tableMode: mode }, true, group);
  };

  const logBtn = (
    <LmToolTip
      destroyTooltipOnHide={{ keepParent: false }}
      trigger={['focus', 'hover']}
      title={globalIntlProxy.common.log} /* ts-morph: 日志 */
      hideWhenClick
    >
      <Button
        icon={<IconFont type='icon-rizhi' />}
        onClick={handleGoToLogPage}
        className='btn_del auto_focus'
      />
    </LmToolTip>
  );

  const deleteBtn = (
    <DeleteButton
      tableRef={tableRef!}
      invalidConfig={invalidConfig}
      deleteConfig={deleteConfig}
      btnSorts={sortedBtnSorts.filter((item) => item === 'delete' || item === 'invalid') as any}
    />
  );

  const importTableButton = (
    <ImportTableButton
      tableRef={tableRef!}
      importTableConfig={importTableConfig}
      exportTableConfig={exportTableConfig}
      btnSorts={
        sortedBtnSorts.filter((item) => item === 'exportTable' || item === 'importTable') as any
      }
    />
  );

  const importImgButton = (
    <ImportImgButton
      tableRef={tableRef!}
      importImgConfig={importImgConfig}
      exportImgConfig={exportImgConfig}
      btnSorts={
        sortedBtnSorts.filter((item) => item === 'importImg' || item === 'exportImg') as any
      }
    />
  );

  const printTableBtn = (
    <PrintButton
      tableRef={tableRef}
      rowKey={rowKey}
      moduleUniqueIdentifier={moduleUniqueIdentifier}
    />
  );

  const refreshBtn = (
    <LmToolTip title={intlProxy.common.refresh}>
      <Button icon={<IconFont type='icon-shuaxin' />} onClick={tableRef?.current?.refresh} />
    </LmToolTip>
  );

  const tagBtn = (
    <LmToolTip title={globalIntlProxy.common.makeTag} /* ts-morph: 打标 */>
      <Button
        icon={<IconFont type='icon-jiabiaoqian' />}
        onClick={() => {
          const selectRow = tableRef?.current?.getSelectedRows();
          if (!selectRow?.length) {
            message.error('请选择要打标的数据');
            return;
          }
          setTagModalOpen(true);
        }}
      />
    </LmToolTip>
  );

  const settingBtn = (
    <div
      onClick={(e) => {
        e.preventDefault();
        autoFocus?.();
      }}
      className='auto_focus'
    >
      <CustomTableOption
        ref={customRef}
        columns={tableMode?.includes(TABLE_MODE_ENUM.LIST) ? state.tableConfig : []}
        filter={state.searchConfig || []}
        card={
          tableMode?.includes(TABLE_MODE_ENUM.IMG) || tableMode?.includes(TABLE_MODE_ENUM.CARD)
            ? state.cardConfig
            : undefined
        }
        enableCardMode={enableCardMode}
        onSave={saveConfigEvent}
        size={state.otherConfig?.size}
        cardMode={state.otherConfig?.cardMode}
        saveSetting={state.otherConfig?.saveSetting}
        recommendNumObj={{ card: 999 }}
        key='custom_table_option'
        tooltip={{
          title: $t({
            id: 'columnsSetting',
            defaultMessage: globalIntlProxy.common.ColumnSettings /* ts-morph: 列设置 */,
            description: '[ScmSupplierPage]',
          }),
          hideWhenClick: true,
        }}
        onReset={handleReset}
        enablePreviewSize={enablePreviewSize}
        previewSize={state.otherConfig?.previewSize || 48}
        resetFun={() => {
          resetUserPageConfigEvent();
        }}
      />
    </div>
  );

  /** 仅在多个视图时展示 */
  const toggleBtn =
    extraButtons?.toggle ||
    (tableMode?.length > 1 && (
      <ToggleView value={state.tableMode} onChange={tableModeChange} tableMode={tableMode} />
    ));

  const BtnMap = {
    log: logBtn,
    delete: deleteBtn,
    invalid: btnSorts.includes('delete') ? null : deleteBtn,
    print: printTableBtn,
    refresh: refreshBtn,
    importTable: importTableButton,
    exportTable: btnSorts.includes('importTable') ? null : importTableButton,
    importImg: importImgButton,
    exportImg: btnSorts.includes('importImg') ? null : importImgButton,
    setting: settingBtn,
    tag: tagBtn,
    ...extraButtons,
    toggle: toggleBtn,
  } as Record<RightOpActions | keyof T, ReactNode | null>;

  return (
    <Space className={`${styles.operate_right} global-tour-operate_right`}>
      {sortedBtnSorts.map((key) => BtnMap[key])}
      {sortedBtnSorts.includes('tag') && tagModalOpen ? (
        <TagModal
          showOperateType
          visible={tagModalOpen}
          onOk={handleSaveTag}
          close={() => setTagModalOpen(false)}
        />
      ) : null}
    </Space>
  );
}

BaseRightOp.displayName = 'BaseRightOp';

export default BaseRightOp;
