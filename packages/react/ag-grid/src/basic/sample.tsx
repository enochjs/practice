import { ColDef } from "ag-grid-enterprise";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useRef, useState } from "react";

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

function RenderCustomInput(params: CustomCellRendererProps) {
  return (
    <input
      type="text"
      value={params.value}
      onChange={(e) => {
        params.api.applyTransaction({
          update: [
            {
              id: params.data.id,
              ...params.data,
              [params.colDef!.field!]: e.target.value,
              [`${params.colDef!.field!}-id`]: e.target.value,
            },
          ],
        });
        params.api.refreshCells({
          rowNodes: [params.node],
          // force: true,
        });
      }}
    />
  );
}

const GridExample = () => {
  const [rowData, setRowData] = useState<IRow[]>([
    { id: 1, make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { id: 2, make: "Ford", model: "F-Series", price: 33850, electric: false },
  ]);

  const gridRef = useRef<AgGridReact>(null);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { field: "make", cellRenderer: RenderCustomInput, editable: true },
    { field: "model", cellRenderer: RenderCustomInput, editable: true },
    { field: "price" },
    { field: "electric" },
  ]);

  return (
    <div
      className={"ag-theme-quartz"}
      style={{ width: "100%", height: "100%" }}
    >
      <button
        onClick={() => {
          // todo: add new row
          gridRef.current?.api.forEachNode((node) => {
            console.log("====node", node.data);
          });
        }}
      >
        get data
      </button>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        gridOptions={{
          getRowId: (row) => {
            return row.data.id;
          },
        }}
      />
    </div>
  );
};
export default GridExample;
