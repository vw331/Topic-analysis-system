import React, { FC } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Spin,
  Space,
  Checkbox,
} from 'antd';
import { connect, ConnectProps, Dispatch, Loading } from 'umi';
import moment from 'moment';

import { AnalyticsModelState, AnalyticsConfig } from '@/models/AnalyticsModel';
const { RangePicker } = DatePicker;

interface AnalyticsFormPageProps extends ConnectProps {
  analytics: AnalyticsModelState;
  analyticsConfig: AnalyticsConfig | null;
  loading: Loading;
  dispatch: Dispatch;
}

const AnalyticsFormComponent: FC<AnalyticsFormPageProps> = (
  props: AnalyticsFormPageProps,
) => {
  const { analytics, loading, analyticsConfig } = props;
  const isLoading: boolean =
    loading.effects['analytics/getConfigOptions'] || false;

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <Spin />
      </div>
    );
  }

  const indicatorsOptions = analytics.analyticsConfigOptions?.indicators;
  const dataSourceConfigs = analytics.analyticsConfigOptions?.datasources.map(
    (name, index) => {
      const result = analyticsConfig?.datasources.find(
        data => data.name == name,
      );
      return {
        key: index,
        name,
        from_date: result?.from_date
          ? moment(result?.from_date, 'YYYY-MM-DD')
          : null,
        to_date: result?.to_date ? moment(result?.to_date, 'YYYY-MM-DD') : null,
      };
    },
  );
  console.log(dataSourceConfigs);

  const getDataSourceFieldLabel = (field: any) => {
    const item = dataSourceConfigs?.find(i => i.key == field.key);
    return `【${item?.name}】时间段`;
  };

  return (
    <Form
      onFinish={values => {
        console.log(values);
      }}
      layout="vertical"
      initialValues={{
        keyword: analyticsConfig?.keyword,
        datasources: dataSourceConfigs,
        indicators: analyticsConfig?.indicators,
      }}
    >
      <Form.Item label="关键字" name="keyword">
        <Input />
      </Form.Item>
      <Form.List name="datasources">
        {fields => {
          return (
            <div>
              {fields.map(field => (
                <Form.Item
                  key={field.key}
                  label={getDataSourceFieldLabel(field)}
                  style={{ marginBottom: 0 }}
                >
                  <Space
                    key={field.key}
                    style={{ display: 'flex' }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'from_date']}
                      fieldKey={[field.fieldKey, 'first']}
                    >
                      <DatePicker placeholder="起始时间" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'to_date']}
                      fieldKey={[field.fieldKey, 'last']}
                    >
                      <DatePicker placeholder="结束时间" />
                    </Form.Item>
                  </Space>
                </Form.Item>
              ))}
            </div>
          );
        }}
      </Form.List>

      <Form.Item label="分析指标" name="indicators">
        <Checkbox.Group options={indicatorsOptions}></Checkbox.Group>
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
