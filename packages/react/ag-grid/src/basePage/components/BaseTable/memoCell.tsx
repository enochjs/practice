import React from 'react';

function Cell(props: any) {
  return <div>{props.children}</div>;
}

export default React.memo(Cell, (pre, next) => pre.updateFlag === next.updateFlag);
