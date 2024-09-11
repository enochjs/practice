import { ColDef } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import { Button, Form } from "antd";

// Row Data Interface
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

var x = [];

function grow() {
  for (var i = 0; i < 10000; i++) {
    document.body.appendChild(document.createElement("div"));
  }
  x.push(new Array(1000000).join("X!X!"));
}

function Test() {
  useEffect(() => {
    console.log("====come in child");
  }, []);

  return <div>test</div>;
}

// Create new PerformanceExample component
const PerformanceExample = () => {
  useEffect(() => {
    console.log("=====come in parent");
    setTimeout(() => {
      form.setFieldsValue({
        test: 1234,
      });
    }, 300);
  }, []);

  const [form] = Form.useForm();

  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      className={"ag-theme-quartz"}
      style={{ width: "100%", height: "500px" }}
    >
      <Form form={form}>
        <Form.Item name="test">
          <Test />
        </Form.Item>
      </Form>
    </div>
  );
};
export default PerformanceExample;

// // Render PerformanceExample
// const root = createRoot(document.getElementById("root")!);
// root.render(<PerformanceExample />);
