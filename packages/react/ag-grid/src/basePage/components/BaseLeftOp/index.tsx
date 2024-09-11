/* eslint-disable */
import React from 'react';
import { Space } from 'linkmore-design';

const BaseLeftOp = (props: any) => {
  const { children } = props;
  return <Space className='operate_left'>{children}</Space>;
};

BaseLeftOp.displayName = 'BaseLeftOp';

export default BaseLeftOp;
