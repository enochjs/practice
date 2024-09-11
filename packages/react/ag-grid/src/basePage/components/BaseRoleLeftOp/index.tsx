/* eslint-disable */
import React from 'react';
import { Space } from 'linkmore-design';
import useAuthority from '@/hooks/useAuthority';

const BaseLeftOp = (props: any) => {
  const { children, moduleId } = props;
  const { authority } = useAuthority(moduleId);
  /** 基于当前moduleId 与 传过来的 roleKey 进行过滤 */
  const resultChildren = React.Children.map(children, (child: any) => {
    if (!child) {
      return null;
    }
    const { roleKey, btnList } = child.props;
    if (authority.includes(roleKey)) {
      return child;
    }
    if (btnList?.length) {
      const nList = btnList.filter((item: any) => authority.includes(item?.roleKey));
      return nList?.length ? React.cloneElement(child, { btnList: nList }) : null;
    }
    return null;
  });
  return <Space className='operate_left'>{resultChildren}</Space>;
  // return <Space className='operate_left'>{children}</Space>;
};

BaseLeftOp.displayName = 'BaseLeftOp';

export default BaseLeftOp;
