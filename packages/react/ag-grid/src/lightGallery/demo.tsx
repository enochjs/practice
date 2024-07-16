import React from "react";
import type { TableProps } from "antd";
import { Table, Image } from "antd";
import Lg from ".";

type ColumnsType<T> = TableProps<T>["columns"];

interface DataType {
  name: string;
  images: string[];
  email: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "20%",
  },
  {
    title: "images",
    dataIndex: "images",
    width: "60%",
    render: (value: string[]) => {
      return (
        <div className="flex">
          {value.map((v, index) => (
            <div
              className="mr-1"
              onClick={(e) => {
                e.stopPropagation();
                console.log("===come in ", index);
                Lg.open(
                  index,
                  value?.map((d) => ({
                    src: d,
                    subHtml: "test",
                    title: "test",
                  })),
                );
              }}
            >
              <Image src={v} width={80} preview={false} />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
  },
];

const data = Array.from({ length: 1 }).map((item, index) => {
  return {
    images: Array.from({ length: Math.ceil(Math.random() * 10) }).map(
      (i) => "https://t7.baidu.com/it/u=1785207335,3397162108&fm=193&f=GIF",
    ),
    uuid: index,
    name: `index`,
    email: "enochjs@163.com",
  };
});

const LightGalleryDemo: React.FC = () => {
  return (
    <Table
      columns={columns}
      rowKey="uuid"
      dataSource={data}
      pagination={false}
    />
  );
};

export default LightGalleryDemo;
