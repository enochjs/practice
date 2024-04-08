import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  StatusPanelDef,
} from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";

interface IOlympicData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  StatusBarModule,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 200 },
    { field: "age", filter: "agNumberColumnFilter", checkboxSelection: true },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 180 },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
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
        { statusPanel: "agTotalAndFilteredRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
        // { statusPanel: 'agGroupContractedComponent' },
      ],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact<IOlympicData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowSelection={"multiple"}
          statusBar={statusBar}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default GridExample;
