import { useEffect, useRef, useState } from 'react';
import {
  Cascader,
  Checkbox,
  DropDownProps,
  Dropdown,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from 'linkmore-design';
import { postCommonChangeDynamicExtraProperty } from 'services/DevelopeCenter/Common';

const DropdownRender = ({
  type,
  defaultValue,
  onChange,
  ...props
}: {
  type: string;
  defaultValue?: string;
  onChange: (val: string) => void;
  onPressEnter?: () => void;
}) => {
  const inputRef = useRef<any>();

  useEffect(() => {
    inputRef.current?.focus({ cursor: 'all' });
  }, []);

  return (
    <div className='filter_dropdown'>
      <Input
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
  // const widgets: Record<string, any> = {
  //   select: () => <Select {...props} />,
  //   input: () => <Input value={value} onChange={(e) => onChange(e.target.value)} {...props} />,
  //   number: () => <InputNumber {...props} />,
  //   checkbox: () => <Checkbox {...props} />,
  //   cascader: () => <Cascader {...props} />,
  //   date: () => <DatePicker {...props} />,
  //   range: () => <DatePicker.RangePicker {...props} />,
  // };
  if (!(type in widgets)) return null;

  return <div className='filter_dropdown'>{widgets[type]?.()}</div>;
};

/** 动态控件 */
const DynamicControl = (
  props: DropDownProps & { value?: string; onBlur: (val: string) => void },
) => {
  const { value, children, onBlur, ...restProps } = props;

  /** 数据是否变更, 未变更时不会触发保存接口 */
  const changedRef = useRef(false);
  const inputRef = useRef<any>(value);

  const [visible, setVisible] = useState(false);

  const onOpenChange = (isOpen: boolean) => {
    setVisible(isOpen);
    if (!isOpen && changedRef.current) {
      onBlur(inputRef.current);
    }
    if (isOpen) {
      changedRef.current = false;
    }
  };

  const onChange = (val: string) => {
    changedRef.current = true;
    inputRef.current = val;
  };
  const onPressEnter = () => {
    onBlur(inputRef.current);
    setVisible(false);
  };

  const dropdownConfig: DropDownProps = {
    open: visible,
    trigger: ['click'],
    placement: 'bottomLeft',
    overlayClassName: 'filter_dropdown_container_input',
    dropdownRender: () => (
      <DropdownRender
        defaultValue={value}
        onChange={onChange}
        onPressEnter={onPressEnter}
        type='input'
      />
    ),
    onOpenChange,
    // 我直接就是一手销毁(未开启则需手动控制下拉展示组件的初始化)
    destroyPopupOnHide: true,
    ...restProps,
  };

  return <Dropdown {...dropdownConfig}>{children}</Dropdown>;
};

export default DynamicControl;

export function tableColumnItem(item: Record<string, any>, refresh: Function) {
  const onBlur = async (extraPropertieValue?: string, record?: Record<string, any>) => {
    try {
      const params = {
        primaryKey: record?.id,
        metadataKey: 'input',
        extraPropertieKey: item.key,
        extraPropertieValue,
      };
      await postCommonChangeDynamicExtraProperty(params);
      refresh();
    } catch (error) {
      console.log('Save Error:', error);
    }
  };

  return {
    ...item,
    render: (text: any, record: any) => {
      return (
        <DynamicControl value={text} onBlur={(val: string) => onBlur(val, record)}>
          <div
            className='flex flex-row justify-between items-center min-h-6'
            onClick={(e) => e.stopPropagation()}
          >
            {item?.render?.(text, record)}
          </div>
        </DynamicControl>
      );
    },
  };
}
