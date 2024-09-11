import SplitPane from 'react-split-pane';
import { useSize } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActivate, useUnactivate } from 'react-activation';
import { BASE_PAGE_SPLIT_SHOW_EVENT } from '../../enum';

interface IBaseSplitPaneProps {
  children: any;
}

function BaseSplitPane({ children }: IBaseSplitPaneProps) {
  const size = useSize(document.querySelector('.SplitPane'));

  const [showSplit, setShowSplit] = useState(false);

  const unActiveRef = useRef(false);

  useActivate(() => {
    unActiveRef.current = false;
  });

  useUnactivate(() => {
    unActiveRef.current = true;
  });

  const onDragFinished = useCallback(() => {
    // tableRef?.current?.changeSize();
  }, []);

  const handleShowSplit = useCallback((e?: CustomEvent<{ showSplit: boolean }>) => {
    if (unActiveRef.current) {
      return;
    }
    setShowSplit(!!e?.detail);
  }, []);

  useEffect(() => {
    window.addEventListener(BASE_PAGE_SPLIT_SHOW_EVENT, handleShowSplit as any);
    return () => {
      window.removeEventListener(BASE_PAGE_SPLIT_SHOW_EVENT, handleShowSplit as any);
    };
  }, []);

  return (
    <SplitPane
      split='horizontal'
      primary='first'
      minSize={300}
      maxSize={size ? size?.height - 20 : undefined}
      size={showSplit ? '60%' : '100%'}
      defaultSize={showSplit ? '60%' : '100%'}
      onDragFinished={onDragFinished}
      pane2Style={{
        overflow: 'hidden',
        display: 'flex',
        padding: '0 24px 16px',
      }}
      resizerStyle={{ display: showSplit ? 'block' : 'none' }}
    >
      {children}
    </SplitPane>
  );
}

BaseSplitPane.displayName = 'BaseSplitPane';

export default BaseSplitPane;
