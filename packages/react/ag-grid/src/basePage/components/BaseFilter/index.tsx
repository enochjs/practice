import React from 'react';

import BaseFilter from './baseFilter';
import DynamicFilter from './dynamicFilter';
import { FilterProps } from './interface';

function Filter(props: FilterProps, ref?: React.Ref<any>) {
  if ('type' in props && props.type === 'baseFilter') {
    return <BaseFilter ref={ref} {...props} />;
  }
  return <DynamicFilter ref={ref} {...props} />;
}

const ForwardFilter = React.forwardRef(Filter);

ForwardFilter.displayName = 'BaseFilter';

export default ForwardFilter;
