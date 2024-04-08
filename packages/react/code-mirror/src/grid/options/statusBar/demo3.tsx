import {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact, getInstance } from "@ag-grid-community/react";
import "./styles.css";
import { ColDef, IStatusPanel, StatusPanelDef } from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";

import { CustomStatusPanelProps } from "@ag-grid-community/react";

const ClickableStatusBarComponent = forwardRef(
  (props: CustomStatusPanelProps, ref) => {
    const [visible, setVisible] = useState(true);

    const onClick = () => {
      alert("Selected Row Count: " + props.api.getSelectedRows().length);
    };

    useImperativeHandle(ref, () => {
      return {
        setVisible: (visible: boolean) => {
          setVisible(visible);
        },
        isVisible: () => {
          return visible;
        },
      };
    });

    if (visible) {
      return (
        <div className="container">
          <div>
            <span className="component">
              Status Bar Component&nbsp;
              <input type="button" onClick={() => onClick()} value="Click Me" />
            </span>
          </div>
        </div>
      );
    }

    return null;
  },
);

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  StatusBarModule,
  RangeSelectionModule,
]);

export interface IClickableStatusBar extends IStatusPanel {
  setVisible(visible: boolean): void;
  isVisible(): boolean;
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "90%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    { row: "Row 1", name: "Michael Phelps" },
    { row: "Row 2", name: "Natalie Coughlin" },
    { row: "Row 3", name: "Aleksey Nemov" },
    { row: "Row 4", name: "Alicia Coutts" },
    { row: "Row 5", name: "Missy Franklin" },
    { row: "Row 6", name: "Ryan Lochte" },
    { row: "Row 7", name: "Allison Schmitt" },
    { row: "Row 8", name: "Natalie Coughlin" },
    { row: "Row 9", name: "Ian Thorpe" },
    { row: "Row 10", name: "Bob Mill" },
    { row: "Row 11", name: "Willy Walsh" },
    { row: "Row 12", name: "Sarah McCoy" },
    { row: "Row 13", name: "Jane Jack" },
    { row: "Row 14", name: "Tina Wills" },
  ]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "row",
    },
    {
      field: "name",
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        {
          statusPanel: ClickableStatusBarComponent,
          key: "statusBarCompKey",
        },
        {
          statusPanel: "agAggregationComponent",
          statusPanelParams: {
            aggFuncs: ["count", "sum"],
          },
        },
      ],
    };
  }, []);

  const toggleStatusBarComp = useCallback(() => {
    getInstance(
      gridRef.current!.api.getStatusPanel<IClickableStatusBar>(
        "statusBarCompKey",
      )!,
      (statusBarComponent) => {
        statusBarComponent!.setVisible(!statusBarComponent!.isVisible());
      },
    );
  }, []);

  return (
    <div style={containerStyle}>
      <button onClick={toggleStatusBarComp} style={{ marginBottom: "10px" }}>
        Toggle Status Bar Component
      </button>

      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowSelection={"multiple"}
          statusBar={statusBar}
          reactiveCustomComponents
        />
      </div>
    </div>
  );
};

export default GridExample;
