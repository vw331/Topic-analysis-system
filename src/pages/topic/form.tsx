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
  message,
} from 'antd';
import { connect, ConnectProps, Dispatch, Loading } from 'umi';
import moment from 'moment';

import { AnalyticsModelState, AnalyticsConfig } from '@/models/AnalyticsModel';
const { RangePicker } = DatePicker;

interface AnalyticsFormPageProps extends ConnectProps {
  analytics: AnalyticsModelState;
  analyticsConfig?: AnalyticsConfig;
  loading: Loading;
  dispatch: Dispatch;
}

const AnalyticsFormComponent: FC<AnalyticsFormPageProps> = (
  props: AnalyticsFormPageProps,
) => {
  const { analytics, loading, analyticsConfig, dispatch } = props;
  const isLoading: boolean =
    loading.effects['analytics/getConfigOptions'] || false;
  const submitLoading: boolean =
    loading.effects['analytics/saveConfig'] || false;

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

  const getDataSourceFieldLabel = (field: any) => {
    const item = dataSourceConfigs?.find(i => i.key == field.key);
    return `【${item?.name}】时间段`;
  };

  const deepCloneAndSerialize = (source: any) => {
    if (source && source._isAMomentObject) {
      return source.format('YYYY-MM-DD');
    }
    const type = Object.prototype.toString.call(source);
    let target: any;
    if (/Array/.test(type)) {
      target = source.map((item: any) => deepCloneAndSerialize(item));
    } else if (/Object/.test(type)) {
      target = {};
      Object.keys(source).forEach(key => {
        target[key] = deepCloneAndSerialize(source[key]);
      });
    } else {
      target = source;
    }

    return target;
  };

  const onFinish = (values: AnalyticsConfig) => {
    let result = deepCloneAndSerialize(values);
    Object.assign(result, {
      project_id: analyticsConfig?.project_id,
    });
    dispatch({
      type: 'analytics/saveConfig',
      payload: result,
      callback(response) {
        if (response.isSuccess) {
          message.success('更新成功!');
        } else {
          message.error('更新失败!');
        }
      },
    });
  };

  return (
    <Form
      onFinish={onFinish}
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
        <Button type="primary" loading={submitLoading} block htmlType="submit">
          开始分析
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = (props: any): AnalyticsFormPageProps => {
  return {
    analyticsConfig: props.topic.topic.data.config,
    analytics: props.analytics,
    loading: props.loading,
    dispatch: props.dispatch,
  } as AnalyticsFormPageProps;
};

export default connect(mapStateToProps)(AnalyticsFormComponent);
