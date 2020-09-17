import React, { FC } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Radio,
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';

import AnalyticsComponent from './analytics';
const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

const TopicDetailPage: FC<{}> = props => {
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
        <span className="text-white ml-10 text-lg font-bold">#话题名称#</span>
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider style={{ marginTop: 15 }} theme="light" width="300">
          <Card title="配置区" bordered={false}>
            <Form layout="vertical">
              <Form.Item
                label="关键字"
                name="keyword"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="微博">
                <Form.Item
                  style={{ marginBottom: 0 }}
                  label="时间段"
                  name="wb-range"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                >
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="知乎">
                <Form.Item
                  style={{ marginBottom: 0 }}
                  label="时间段"
                  name="zh-range"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                >
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="B站">
                <Form.Item
                  style={{ marginBottom: 0 }}
                  label="时间段"
                  name="bli-range"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                >
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="分析指标">
                <Radio.Group name="quota">
                  <Radio value="a">话题热度</Radio>
                  <Radio value="b">主要观点</Radio>
                  <Radio value="c">用户态度</Radio>
                  <Radio value="d">用户画像</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" block htmlType="submit">
                  开始分析
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Sider>
        <Content>
          <AnalyticsComponent />
        </Content>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = props => ({
  topic: props.topic,
  loading: props.loading,
});
export default connect(mapStateToProps)(TopicDetailPage);
