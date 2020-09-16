import React, { FC, useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input } from 'antd';
import { TopicModelState, connect, Dispatch, ConnectProps, Loading } from 'umi';
import './index.less';

interface TopicPageProps extends ConnectProps {
  topic: TopicModelState;
  loading: Loading;
  dispatch: Dispatch;
}

const TopicPage: FC<TopicPageProps> = props => {
  const { dispatch, topic, loading } = props;
  const isloading = loading.effects['topic/getTopicList'];
  const { topics } = topic;
  const [createForm] = Form.useForm();

  const [createModalVisible, setcreateModalVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: 'topic/getTopicList',
    });
  }, []);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    dispatch({
      type: 'topic/getTopicList',
      payload: {
        current: pagination.current,
        pageSize: pagination.pageSize,
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
    },
    {
      title: '操作',
      dataIndex: 'project_id',
      key: 'project_id',
      render: (text: string, record: any) => (
        <Space size="middle">
          <a>查看</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const createModal = (
    <Modal
      title="创建新项目"
      visible={createModalVisible}
      onCancel={() => {
        setcreateModalVisible(false);
      }}
      onOk={() => {
        createForm.validateFields().then(values => {
          console.log(values);
        });
      }}
    >
      <Form form={createForm}>
        <Form.Item
          label="项目名称"
          name="projct_name"
          rules={[
            { required: true, message: 'Please input your project name!' },
          ]}
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
