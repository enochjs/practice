import { FunctionComponent, useMemo } from 'react';
import { IconFont, Radio } from 'linkmore-design';
import styled from 'styled-components';
import { TABLE_MODE_ENUM } from '../../enum';

const Wrapper = styled.div`
  position: relative;
  margin-left: 9px;

  &::before {
    position: absolute;
    top: 0;
    left: -9px;
    width: 1px;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    content: ' ';
  }

  .ant-radio-button-wrapper:not(.ant-radio-button-wrapper-checked) {
    color: var(--lm-primary-color-case4);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):before {
    border-color: var(--lm-primary-color-case3) !important;
  }
`;

interface ToggleViewProps {
  value: TABLE_MODE_ENUM;
  onChange: (value: TABLE_MODE_ENUM) => void;
  tableMode: TABLE_MODE_ENUM[];
}

/** 视图切换按钮 */
const ToggleView: FunctionComponent<ToggleViewProps> = ({ value, onChange, tableMode }) => {
  const tableModeBtnMap = useMemo(() => {
    const newMap = new Map([
      [TABLE_MODE_ENUM.LIST, { value: TABLE_MODE_ENUM.LIST, icon: 'lmweb-menu' }],
      [TABLE_MODE_ENUM.IMG, { value: TABLE_MODE_ENUM.IMG, icon: 'lmweb-appstore' }],
      [TABLE_MODE_ENUM.CARD, { value: TABLE_MODE_ENUM.CARD, icon: 'lmweb-appstore' }],
    ]);
    return tableMode.map((mode: TABLE_MODE_ENUM) => newMap.get(mode));
  }, [tableMode]);

  return (
    <Wrapper>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        {tableModeBtnMap.map((mode) => (
          <Radio.Button value={mode?.value}>
            <IconFont type={mode?.icon} />
          </Radio.Button>
        ))}
      </Radio.Group>
    </Wrapper>
  );
};

export default ToggleView;
