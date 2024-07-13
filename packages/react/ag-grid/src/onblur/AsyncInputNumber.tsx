import { InputNumber, InputNumberProps } from "antd";
import { useAsyncDelayer } from "./utils";

const AsyncInputNumber = ({
  onBlur,
  ...restProps
}: InputNumberProps & {
  onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => Promise<any>;
}) => {
  const { run } = useAsyncDelayer(onBlur);

  return <InputNumber onBlur={(e) => run(e)} {...restProps} />;
};

export default AsyncInputNumber;
