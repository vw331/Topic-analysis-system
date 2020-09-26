import React, { FC, useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  TopicModelState,
  connect,
  Dispatch,
  ConnectProps,
  Loading,
  history,
} from 'umi';
import {
  Topic,
  NewTopic,
  TopicStatus,
  NewTopicResponse,
  DelTopicResponse,
} from '@/models/TopicModel';
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
      content: `确定要删除"${record.name}"这条记录？`,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'topic/delTopic',
            payload: record.project_id,
            callback: ({ isSuccess, msg }: DelTopicResponse) => {
              if (isSuccess) {
                message.success('已删除');
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

  const columns: ColumnsType<Topic> = [
    {
      title: '项目ID',
      dataIndex: 'project_id',
      key: 'project_id',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建日期',
      dataIndex: 'create_date',
      key: 'create_date',
    },
    {
      title: '创建者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TopicStatus) => {
        switch (status) {
          case 'idle':
            return <Tag color="red">未开始</Tag>;
          case 'analysising':
            return <Tag color="blue">分析中</Tag>;
          case 'ok':
            return <Tag color="warning">分析完成</Tag>;
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
            callback: (response: NewTopicResponse) => {
              const { isSuccess } = response;
              if (isSuccess) {
                message.success('创建成功!');
                createForm.resetFields();
                setcreateModalVisible(false);
                dispatch({
                  type: 'topic/getTopicList',
                });
              } else {
                message.error('创建失败!');
              }
            },
          });
        });
      }}
    >
      <Form form={createForm}>
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

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
