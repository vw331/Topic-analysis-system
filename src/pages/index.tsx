import React, { FC } from 'react';
import styles from './index.less';
import {
  IndexModelState,
  ConnectProps,
  Dispatch,
  Action,
  Loading,
  connect,
} from 'umi';

interface PageProps extends ConnectProps {
  index: IndexModelState;
  loading: boolean;
  dispatch: Dispatch;
}

const IndexPage: FC<PageProps> = ({ index, dispatch }) => {
  const { name, test } = index;
  const handleClick = (e: React.MouseEvent) => {
    dispatch({
      type: 'index/save',
      payload: { name: 'haha' },
    });
  };

  const handleFetch = (e: React.MouseEvent) => {
    dispatch({
      type: 'index/test',
      payload: 'abc',
    });
  };

  return (
    <div>
      <div>Hello {name}</div>
      <button onClick={handleClick}>button</button>
      <button onClick={handleFetch}>fetch</button>
      <div>result: {test && test.msg} </div>
    </div>
  );
};

const mapStateToProps = (props: PageProps) => ({
  index: props.index,
  loading: props.loading,
});

export default connect(mapStateToProps)(IndexPage);
