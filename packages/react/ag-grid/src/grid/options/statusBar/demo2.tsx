import { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import { ColDef, StatusPanelDef } from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";

import { CustomStatusPanelProps } from "@ag-grid-community/react";

function CountStatusBarComponent(props: CustomStatusPanelProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(props.api.getDisplayedRowCount());
  }, []);

  return (
    <div className="ag-status-name-value">
      <span className="component">Row Count Component&nbsp;</span>
      <span className="ag-status-name-value-value">{count}</span>
    </div>
  );
}

function ClickableStatusBarComponent(props: CustomStatusPanelProps) {
  const onClick = () => {
    alert("Selected Row Count: " + props.api.getSelectedRows().length);
  };

  return (
    <div className="ag-status-name-value">
      <span>
        Status Bar Component&nbsp;
        <input type="button" onClick={() => onClick()} value="Click Me" />
      </span>
    </div>
  );
}

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  StatusBarModule,
  RangeSelectionModule,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
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
      checkboxSelection: true,
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
          statusPanel: CountStatusBarComponent,
        },
        {
          statusPanel: ClickableStatusBarComponent,
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

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
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
