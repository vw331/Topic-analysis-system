import React, { FC, useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input, message } from 'antd';
import {
  TopicModelState,
  connect,
  Dispatch,
  ConnectProps,
  Loading,
  history,
} from 'umi';
import { Topic } from '@/models/TopicModel';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';

interface TopicPageProps extends ConnectProps {
  topic: TopicModelState;
  loading: Loading;
  dispatch: Dispatch;
}

const TopicPage: FC<TopicPageProps> = props => {
  const { dispatch, topic, loading } = props;
  const isloading: boolean = loading.effects['topic/getTopicList'] || false;
  const isSubmitLoading: boolean = loading.effects['topic/addTopic'] || false;
  const { topics } = topic;
  const [createForm] = Form.useForm();

  const [createModalVisible, setcreateModalVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: 'topic/getTopicList',
    });
  }, []);

  const handleTableChange = (pagination: any, filters?: any, sorter?: any) => {
    dispatch({
      type: 'topic/getTopicList',
      payload: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  const handleDeleteAction = (record: Topic) => {
    Modal.confirm({
      title: '提醒',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除"${record.project_name}"这条记录？`,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'topic/delTopic',
            payload: record.project_id,
            callback: ({ success, msg }: any) => {
              if (success) {
                message.success(msg);
                dispatch({
                  type: 'topic/getTopicList',
                });
              } else {
                message.error(msg);
              }
              resolve();
            },
          });
        }).catch(() => console.log('Oops errors!'));
      },
    });
  };

  const columns = [
    {
      title: '项目ID',
      dataIndex: 'project_id',
      key: 'project_id',
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'project_name',
    },
    {
      title: '创建日期',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '创建者',
      dataIndex: 'project_author',
      key: 'project_author',
    },
    {
      title: '状态',
      dataIndex: 'project_status',
      key: 'project_status',
      render: (status: number) => {
        switch (status) {
          case 1:
            return <Tag color="red">未开始</Tag>;
          case 2:
            return <Tag color="blue">分析完成</Tag>;
          case 3:
            return <Tag color="warning">分析中</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'project_id',
      key: 'project_id',
      render: (text: string, record: Topic) => (
        <Space size="middle">
          <a onClick={() => history.push(`/topic/${record.project_id}`)}>
            查看
          </a>
          <a onClick={() => handleDeleteAction(record)}>删除</a>
        </Space>
      ),
    },
  ];

  const createModal = (
    <Modal
      title="创建新项目"
      visible={createModalVisible}
      destroyOnClose={true}
      onCancel={() => {
        setcreateModalVisible(false);
      }}
      confirmLoading={isSubmitLoading}
      onOk={() => {
        createForm.validateFields().then(values => {
          dispatch({
            type: 'topic/addTopic',
            payload: values,
            callback: ({ success, msg }) => {
              if (success) {
                message.success(msg);
                createForm.resetFields();
                setcreateModalVisible(false);
                dispatch({
                  type: 'topic/getTopicList',
                });
              } else {
                message.error(msg);
              }
            },
          });
        });
      }}
    >
      <Form form={createForm}>
        <Form.Item
          label="项目名称"
          name="projct_name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

  console.log(topics?.pagination);

  return (
    <div className="site-page-header-ghost-wrapper">
      <div className="mb-2">
        <Button
          type="primary"
          onClick={() => {
            setcreateModalVisible(true);
          }}
        >
          新建项目
        </Button>
      </div>
      <Table
        loading={isloading}
        columns={columns}
        rowKey={record => record.project_id}
        pagination={topics?.pagination}
        dataSource={topics?.data}
        onChange={handleTableChange}
      />
      {createModal}
    </div>
  );
};

const mapStateToProps = (props: TopicPageProps) => ({
  topic: props.topic,
  loading: props.loading,
});
export default connect(mapStateToProps)(TopicPage);
