/* eslint-disable */
import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import cx from 'classnames';

import styles from '../../index.module.less';

const BaseAside = (props: any) => {
  const { children, width = 0, full = false.valueOf, style = {}, allowShrinkage = true } = props;

  const baseWidth = !full ? 168 : 192;

  const usedWidth = width ? width : baseWidth;
  const [toggleAside, setToggleAside] = useState<boolean>(true);

  const baseAsideClassNames = cx({
    [styles.ba_base_aside]: !full,
    [styles.ba_base_aside_full]: full,
  });

  const handleToggleAside = () => {
    setToggleAside(!toggleAside);
  };

  const mergedStyle = {
    width: usedWidth,
    minWidth: usedWidth,
    ...style,
  };

  if (style?.width) {
    mergedStyle.minWidth = style.width;
  }

  const defaultWidth = allowShrinkage ? 16 : 0;

  return (
    <div
      style={toggleAside ? mergedStyle : { width: defaultWidth }}
      className={baseAsideClassNames}
    >
      {(toggleAside || !allowShrinkage) && children}
      {allowShrinkage && (
        <div className={styles.ba_base_aside_toggle} onClick={handleToggleAside}>
          {toggleAside ? <LeftOutlined /> : <RightOutlined />}
        </div>
      )}
    </div>
  );
};

BaseAside.displayName = 'BaseAside';

export default BaseAside;