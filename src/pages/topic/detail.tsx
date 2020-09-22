import React, { FC, useEffect } from 'react';
import {
  Layout,
  Card,
  Form,
  Spin,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Radio,
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import {
  useParams,
  connect,
  history,
  ConnectProps,
  Loading,
  Dispatch,
  AnalyticsConfig,
} from 'umi';
import AnalyticsComponent from './analytics';
import AnalyticsFormComponent from './form';
import { TopicModelState } from '@/models/TopicModel';
const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

interface TopicPageProps extends ConnectProps {
  topic: TopicModelState;
  loading: Loading;
  dispatch: Dispatch;
}

const TopicDetailPage: FC<TopicPageProps> = props => {
  const { topic, loading, dispatch, history } = props;
  const isloading: boolean = loading.effects['topic/getTopic'] || false;
  const params: any = useParams();
  const { id } = params;
  const analyticsConfig = topic?.topic?.data?.config as AnalyticsConfig;

  useEffect(() => {
    dispatch({
      type: 'topic/getTopic',
      payload: id,
    });
    return () => {
      dispatch({
        type: 'topic/save',
        payload: { topic: null },
      });
    };
  }, []);

  if (!topic.topic || isloading) {
    return (
      <div className="text-center p-4">
        <Spin />
      </div>
    );
  }

  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Button
          type="link"
          onClick={() => history.push('/')}
          icon={<LeftOutlined />}
        >
          返回首页
        </Button>
        <span className="text-white ml-10 text-lg font-bold">
          #{topic.topic.data.project.name}#
        </span>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider style={{ marginTop: 15 }} theme="light" width="350">
          <Card bordered={false}>
            <AnalyticsFormComponent />
          </Card>
        </Sider>
        <Content>
          <AnalyticsComponent project={topic.topic.data.project} />
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (props: TopicPageProps) => ({
  topic: props.topic,
  loading: props.loading,
});
export default connect(mapStateToProps)(TopicDetailPage);
