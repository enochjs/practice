import type { FormProps } from "antd";
import { Button, Divider, Form, InputNumber } from "antd";
import makeDeferred from "./deferred";
import { useBlurSave } from "./utils";

type FieldType = {
  count?: string;
  price?: string;
  amount?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function OnblurDemo() {
  const [form] = Form.useForm();
  const [asyncForm] = Form.useForm();

  const handleSubmit = () => {
    console.log("=====sync", form.getFieldsValue());
  };

  const handleBlur = async () => {
    const values = form.getFieldsValue();
    const defer = makeDeferred();
    setTimeout(() => {
      defer.resolve(true);
    }, 300);
    await defer.promise;
    form.setFieldValue("amount", (values.count || 0) * (values.price || 0));
  };

  const handleAsyncBlur = async () => {
    const values = asyncForm.getFieldsValue();
    const defer = makeDeferred();
    setTimeout(() => {
      defer.resolve(true);
    }, 300);
    await defer.promise;
    asyncForm.setFieldValue(
      "amount",
      (values.count || 0) * (values.price || 0),
    );
  };

  const handleAsyncSubmit = useBlurSave(() => {
    // 拿到异步后的值
    console.log("=====async", form.getFieldsValue());
  });

  return (
    <div>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="数量"
          name="count"
          rules={[{ required: true, message: "Please input your count!" }]}
        >
          <InputNumber onBlur={handleBlur} />
        </Form.Item>

        <Form.Item<FieldType>
          label="单价"
          name="price"
          rules={[{ required: true, message: "Please input your price!" }]}
        >
          <InputNumber onBlur={handleBlur} />
        </Form.Item>

        <Form.Item<FieldType> label="总计" name="amount">
          <InputNumber disabled />
        </Form.Item>

        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
      <Divider />
      <Form
        name="basic"
        form={asyncForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="数量"
          name="count"
          rules={[{ required: true, message: "Please input your count!" }]}
        >
          <InputNumber onBlur={handleAsyncBlur} />
        </Form.Item>

        <Form.Item<FieldType>
          label="单价"
          name="price"
          rules={[{ required: true, message: "Please input your price!" }]}
        >
          <InputNumber onBlur={handleAsyncBlur} />
        </Form.Item>

        <Form.Item<FieldType> label="总计" name="amount">
          <InputNumber disabled />
        </Form.Item>

        <Button type="primary" onClick={handleAsyncSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default OnblurDemo;
