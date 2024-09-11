import { useMemoizedFn } from 'ahooks';
import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { Button, IconFont, Spin } from 'linkmore-design';
import { useActivate, useUnactivate } from 'react-activation';
import { isEqual } from 'lodash';
import { BASE_PAGE_SPLIT_SHOW_EVENT } from '../../enum';

interface IBaseDetailProps<T = any> {
  api: (record: T, config?: any) => Promise<any>;
  children: any;
}

function BaseDetail(props: IBaseDetailProps) {
  const { api, children } = props;

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // 标记请求是否有效
  const fetchRef = useRef(0);
  const controllerRef = useRef<AbortController>();
  const unActiveRef = useRef(false);
  const previousRecord = useRef<any>();

  useActivate(() => {
    unActiveRef.current = false;
  });

  useUnactivate(() => {
    unActiveRef.current = true;
  });

  const handleQueryDetail = useMemoizedFn((record: any) => {
    setLoading(true);
    setData(undefined);
    previousRecord.current = record;

    const equal = isEqual(record, previousRecord.current);
    fetchRef.current += 1;
    const fetchId = fetchRef.current;

    // 不是同一个请求，之前有发起的请求，则取消
    if (!equal && controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    api(record, {
      signal: controllerRef.current.signal,
    })
      .then((result) => {
        if (fetchId !== fetchRef.current) {
          // 解决请求顺序问题
          return;
        }
        setData(result);
      })
      .finally(() => {
        if (fetchId !== fetchRef.current) {
          // 解决请求顺序问题
          return;
        }
        previousRecord.current = undefined;
        setLoading(false);
      });
  });

  const handleClear = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(BASE_PAGE_SPLIT_SHOW_EVENT, {
        detail: undefined,
      }),
    );
  }, []);

  const handleShowSplit = useCallback((e?: CustomEvent<{ showSplit: boolean }>) => {
    if (unActiveRef.current) {
      return;
    }

    if (e?.detail) {
      handleQueryDetail(e?.detail);
    }
  }, []);

  useEffect(() => {
    window.addEventListener(BASE_PAGE_SPLIT_SHOW_EVENT, handleShowSplit as any);
    return () => {
      window.removeEventListener(BASE_PAGE_SPLIT_SHOW_EVENT, handleShowSplit as any);
    };
  }, []);

  return (
    <div className='flex w-full h-full relative rounded-2xl bg-white overflow-hidden'>
      <div className=' absolute right-[14px] top-[14px] z-10'>
        <Button
          type='text'
          shape='circle'
          onClick={handleClear}
          icon={<IconFont type='icon-a-tongyongaRX' />}
          style={{ marginRight: 8 }}
          disabled={false}
        />
      </div>
      {loading || data === undefined ? (
        <Spin spinning className='w-full h-full  flex items-center justify-center' />
      ) : (
        cloneElement(children, {
          data,
        })
      )}
    </div>
  );
}

BaseDetail.displayName = 'BaseDetail';

export default BaseDetail;
