import React, { useRef, useEffect, useMemo, useImperativeHandle, memo, useCallback } from 'react';

import { LmFilter } from 'linkmore-design';

import { isFunction, isEqual, omit } from 'lodash';

import { useBasePageStore } from '../../store';
import { BaseFilterProps } from './interface';

function BaseFilter(props: BaseFilterProps, ref?: React.Ref<any>) {
  const {
    data = [],
    customOptions = [],
    enableComplex = true,
    enableCustom = true,
    ...restProps
  } = props;

  const innerRef: any = useRef({});

  const [{ filterData, searchQueryConfig }, actions] = useBasePageStore((s) => ({
    filterData: s?.searchConfig,
    searchQueryConfig: s?.searchQueryConfig,
  }));

  useEffect(() => {
    const prevConfig = innerRef?.current?.getFilterQuery?.();

    if (!isEqual(prevConfig, searchQueryConfig)) {
      if (innerRef?.current?.setLocalization && isFunction(innerRef?.current?.setLocalization)) {
        innerRef?.current?.setLocalization(searchQueryConfig);
      }
    }
  }, [searchQueryConfig]);

  const afterData = useMemo(() => {
    return filterData;
  }, [filterData]);

  const handleChange = useCallback((customQuery: any) => {
    actions.setPageConfig(
      {
        searchQueryConfig: customQuery,
      },
      true,
    );
  }, []);

  useImperativeHandle(ref, () => ({
    ...innerRef.current,
    updateSearchQueryConfig: handleChange,
  }));

  return (
    <LmFilter
      ref={innerRef}
      dataSource={afterData || []}
      {...restProps}
      enableComplex={enableComplex}
      customOptions={customOptions}
      enableCustom={enableCustom}
      onChange={handleChange}
    />
  );
}

const MemoFilter = memo(React.forwardRef(BaseFilter), (prevProps, nextProps) => {
  const prevPropsOmit = omit(prevProps, 'onChange');
  const nextPropsOmit = omit(nextProps, 'onChange');

  return isEqual(prevPropsOmit, nextPropsOmit);
});

MemoFilter.displayName = 'BaseFilter';

export default MemoFilter;
