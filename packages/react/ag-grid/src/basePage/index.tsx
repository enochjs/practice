import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
// import { Tour, IconFont, FullScreen } from "linkmore-design";
// import cx from "classnames";
// import { EnumGlobalClearCache } from "constant/pageConfigEnum";
// import { common } from "apis";
// import headerTabsStore from "layouts/MainHeader/component/tabs/store";
// import { useLocation } from "react-router-dom";
import {
  BaseFilter,
  BaseTable,
  BaseRightOp,
  BaseLeftOp,
  BaseAside,
  BaseRoleLeftOp,
} from "./components";

// import LoadingPage from "@/components/LoadingPage";
// import BasePageContext from "./context";
import styles from "./index.module.less";
// import basePageStore from "./store";
import {
  BaseTableHandles,
  BaseTableProps,
} from "./components/BaseTable/interface";
import { FilterProps } from "./components/BaseFilter/interface";
// import useAuthority from "@/hooks/useAuthority";
// import { TABLE_MODE_ENUM } from "./enum";
import BaseSplitPane from "./components/BaseSplitPane";
import BaseDetail from "./components/BaseDetail";

const supportComponentList: Array<string> = [
  "BaseFilter",
  "BaseTable",
  "BaseRightOp",
  "BaseRoleLeftOp",
  "BaseLeftOp",
  "BaseAside",
  "BaseDetail",
];

interface BasePageProps {
  children: any;
  loading?: boolean;
  configKey?: string;
  onlyFilter?: boolean;
  isFull?: any;
  toggleFullStatus?: any;
  useFull?: boolean;
  renderType?: "page" | "module";
  useLocalConfig?: boolean;
  className?: string;
  group?: string[];
}

interface IBasePage {
  (props: BasePageProps): any;
  Filter: React.ForwardRefExoticComponent<
    FilterProps & React.RefAttributes<any>
  >;
  Table: any;
  LeftOp: typeof BaseLeftOp;
  RoleLeftOp: typeof BaseLeftOp;
  RightOp: typeof BaseRightOp;
  Aside: typeof BaseAside;
  Detail: typeof BaseDetail;
}

const BasePage: IBasePage = ({
  children,
  loading = false,
  configKey = "#BasePage",
  onlyFilter = false,
  isFull,
  useFull,
  toggleFullStatus,
  renderType = "page",
  className = "",
  group = [],
}) => {
  const [openTour, setOpenTour] = useState(false);
  // const actions = basePageStore.getActions();
  const innerTableRef = useRef<any>(null);
  const innerFilterRef = useRef<any>(null);
  // const { authority, filedAuthority } = useAuthority();
  // const location = useLocation();

  const ContentMap = useMemo(() => {
    const finallyMap = {};
    React.Children.map(children, (item) => {
      const componentName = get(item, "type.displayName");
      if (supportComponentList.includes(componentName)) {
        set(finallyMap, componentName, item);
      }
    });

    return finallyMap;
  }, [children]);

  const Filter = get(ContentMap, "BaseFilter");
  const Table = get(ContentMap, "BaseTable");
  const LeftOp = get(ContentMap, "BaseLeftOp");
  const RightOp = get(ContentMap, "BaseRightOp");
  const Aside = get(ContentMap, "BaseAside");
  const Detail = get(ContentMap, "BaseDetail");
  const filterData = get(Filter, "props.data") || get(Filter, "props.fullData");
  const tableColumnsData = get(Table, "props.columns") || [];
  const tableName = get(Table, "props.tableName") || "";
  const tableMode = get(Table, "props.tableMode") || [TABLE_MODE_ENUM.LIST];
  const tableRef = get(Table, "ref");
  const filterRef = get(Filter, "ref");
  const cardColumnsData = get(Table, "props.cardColumns") || [];
  const isAsideFull = get(Aside, "props.full", false);
  const filterDivRef = useRef<any>(null);
  const operateRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const useLocalConfig = get(Table, "props.useLocalConfig");
  const useFilterLocalConfig = get(Filter, "props.useLocalConfig");

  // 需要动态请求查询数据
  const dynamicQueryFilter = get(Filter, "props.type") === "dynamicFilter";

  const initialLocalConfig: any = {};

  if (configKey) {
    set(initialLocalConfig, configKey, {
      searchConfig: !dynamicQueryFilter ? filterData || [] : [],
      tableConfig: tableColumnsData,
      cardConfig: cardColumnsData || [],
    });
  }

  const GetUserOperateLog = async () => {
    const localOpenTour = localStorage.getItem("openTour");
    if (localOpenTour === "False") {
      setOpenTour(true);
    }
  };

  // const [menuId] = headerTabsStore.useStore(
  //   (s) => s.moduleMap?.get(location.pathname)?.moduleId || "",
  // );

  // useLayoutEffect(() => {
  //   actions.getPageConfigs(menuId);
  // }, [menuId]);

  const handleFinishGuideLog = async () => {
    try {
      const res: any = await common.setUserIsOperateGuide({
        operationType: 1,
        hasDone: true,
      });
      if (res?.code === 200) {
        setOpenTour(false);
        localStorage.setItem("openTour", "True");
      }
    } catch {
      //
    }
  };

  // useEffect(() => {
  //   set(window, EnumGlobalClearCache.ClearTableCache, () => {
  //     actions.setPageConfig(
  //       menuId,
  //       configKey,
  //       {
  //         tableConfig: [],
  //         cardConfig: [],
  //         searchConfig: [],
  //         searchQueryConfig: {},
  //         tableQueryConfig: {},
  //       },
  //       true,
  //     );
  //   });
  //   GetUserOperateLog();
  // }, []);

  // useEffect(() => {
  //   if (menuId) {
  //     actions.setConfigInfo(menuId, configKey);
  //   }
  // }, [configKey, menuId]);

  const containerClassNames = useMemo(
    () =>
      cx({
        [styles.bc_base_container]: renderType === "page",
        [styles.bc_base_container_full]: isAsideFull,
        [styles.bc_base_module_container]: renderType === "module",
        bc_base_container: renderType === "page",
        [className]: true,
      }),
    [isAsideFull, renderType],
  );

  const contentClassNames = useMemo(
    () =>
      cx({
        [styles.bc_base_content]: !isAsideFull,
        [styles.bc_base_content_full]: isAsideFull,
      }),
    [isAsideFull],
  );

  const memoConfig = useMemo(
    () => ({
      configKey,
      menuId,
      authority,
      filedAuthority,
    }),
    [configKey, menuId],
  );

  const content = (
    <>
      {LeftOp || RightOp ? (
        <div className={styles.bc_base_op} ref={operateRef}>
          {LeftOp ? (
            React.cloneElement(LeftOp, {
              key: "LeftOp",
            })
          ) : (
            <div />
          )}
          {RightOp
            ? React.cloneElement(RightOp, {
                key: "RightOp",
                group,
                tableRef: tableRef || innerTableRef,
                filterRef: filterRef || innerFilterRef,
                tableMode,
                rowKey: get(Table, "props.rowKey", "id"),
              })
            : null}
        </div>
      ) : null}
      <div className={styles.centerContentClassNames}>
        {!isAsideFull && Aside
          ? React.cloneElement(Aside, {
              key: "Aside",
            })
          : null}
        <div className={styles.bc_base_content_table} ref={containerRef}>
          {Table &&
            React.cloneElement(Table, {
              tableName,
              useLocalConfig: useLocalConfig ?? renderType === "module",
              key: "Table",
              ref: tableRef || innerTableRef,
            })}
        </div>
      </div>
    </>
  );

  const fullContent = (
  
  );

  if (Detail) {
  }

  return (
    <BaseSplitPane>
      <>
        <div className={containerClassNames}>
            {isAsideFull && Aside
              ? React.cloneElement(Aside, {
                  key: "Aside",
                })
              : null}
            <div className={contentClassNames}>
              <div
                className={
                  Filter || LeftOp || RightOp
                    ? cx({
                        [styles.bc_base_op_area]: true,
                        bc_base_op_area: true,
                      })
                    : null
                }
              >
                {Filter && (
                  <div ref={filterDivRef}>
                    {React.cloneElement(Filter, {
                      key: "Filter",
                      useLocalConfig:
                        useFilterLocalConfig ?? renderType === "module",
                      tableMode,
                      ref: filterRef || innerFilterRef,
                      tableRef: tableRef || innerTableRef,
                    })}
                  </div>
                )}
              </div>
            </div>
        </div>
        {loading ? <LoadingPage /> : null}
      </>
      {Detail}
    </BaseSplitPane>
  );

  return fullContent;
};

BasePage.Filter = BaseFilter;
BasePage.Table = BaseTable as any;
BasePage.LeftOp = BaseLeftOp;
BasePage.RoleLeftOp = BaseRoleLeftOp;
BasePage.RightOp = BaseRightOp;
BasePage.Aside = BaseAside;
BasePage.Detail = BaseDetail;

export default BasePage;
