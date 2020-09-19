import React, { FC } from 'react';
import { Form, Input, DatePicker, Radio, Button } from 'antd';
import { connect, ConnectProps, Dispatch, Loading } from 'umi';

import { AnalyticsModelState } from '@/models/AnalyticsModel';
const { RangePicker } = DatePicker;

interface AnalyticsFormPageProps extends ConnectProps {
  analytics: AnalyticsModelState;
  loading: Loading;
  dispatch: Dispatch;
}

const AnalyticsFormComponent: FC<AnalyticsFormPageProps> = (
  props: AnalyticsFormPageProps,
) => {
  const { analytics } = props;

  console.log(props);

  return (
    <Form layout="vertical">
      <Form.Item
        label="关键字"
        name="keyword"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="微博">
        <Form.Item
          style={{ marginBottom: 0 }}
          label="时间段"
          name="wb-range"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="知乎">
        <Form.Item
          style={{ marginBottom: 0 }}
          label="时间段"
          name="zh-range"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
      </Form.Item>
      <Form.Item label="B站">
        <Form.Item
          style={{ marginBottom: 0 }}
          label="时间段"
          name="bli-range"
          rules={[{ required: true, message: 'Please input your username!' }]}
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
  );
};

export default connect((props: AnalyticsFormPageProps) => ({
  analytics: props.analytics,
  loading: props.loading,
}))(AnalyticsFormComponent);
