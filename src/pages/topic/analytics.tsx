import React, { FC, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Statistic,
  Card,
  Avatar,
  Divider,
  DatePicker,
  Space,
  Radio,
  List,
  Tag,
  Table,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Column, StackedColumn, WordCloud, Bubble } from '@ant-design/charts';
import { ColumnsType } from 'antd/es/table';
import './analytics.less';

const { RangePicker } = DatePicker;

const TimePicker: FC<{}> = props => {
  return (
    <>
      <Space direction="horizontal" size={12}>
        <Radio.Group
          optionType="button"
          options={[
            { label: '今日', value: 'today' },
            { label: '本周', value: 'week' },
            { label: '本月', value: 'month' },
            { label: '全年', value: 'yean' },
          ]}
        />
        <RangePicker />
      </Space>
    </>
  );
};

/**
 * 话题热度
 */
const ColumnsCharts: FC = props => {
  const data = new Array(12)
    .fill({
      value: '2345',
      name: '1月',
    })
    .map((item, index) => ({
      name: `${index + 1}月`,
      value: Math.ceil(Math.random() * 1000),
    }));

  const config = {
    title: {
      visible: true,
      text: '讨论趋势',
    },
    description: {
      visible: false,
      text:
        '基础柱状图的图形之间添加转化率标签图形\uFF0C用户希望关注从左到右的数据变化比例',
    },
    forceFit: true,
    data,
    padding: [15, 0, 30, 50],
    xField: 'name',
    yField: 'value',
    conversionTag: { visible: false },
  };

  return (
    <div style={{ height: '400px' }}>
      <Column {...config} />
    </div>
  );
};

/**
 * 用户变化趋势
 */
const StackedColumnCharts: FC = props => {
  const data = new Array(4 * 4)
    .fill({})
    .map((item, index) => {
      const time = ['2017', '2018', '2019', '2020'];
      return {
        year: time[Math.floor(index / 4)],
        value: Math.floor(Math.random() * 10000),
      };
    })
    .map((item, index) => {
      const range = ['18周岁以下', '18岁-24岁', '25岁-34岁', '35岁以上'];
      return {
        ...item,
        type: range[Math.floor(index % 4)],
      };
    });

  const config = {
    forceFit: true,
    title: {
      visible: true,
      text: '用户变化趋势',
    },
    padding: [15, 0, 30, 50],
    data,
    legend: { visible: false },
    xField: 'year',
    yField: 'value',
    yAxis: { min: 0 },
    label: { visible: false },
    stackField: 'type',
    color: ['#ae331b', '#f27957', '#dadada', '#609db7', '#1a6179'],
    connectedArea: {
      visible: true,
      triggerOn: 'mouseenter',
    },
  };
  return <StackedColumn {...config} />;
};

/**
 *  词云
 */
const WordCloudChars: FC = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/antfincdn/fLPUlSQCRI/word-cloud.json',
    )
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log('fetch data failed', error);
      });
  };
  const config = getWordCloudConfig(data);
  function getDataList(data) {
    const list = [];
    data.forEach(d => {
      list.push({
        word: d.name,
        weight: d.value,
        id: list.length,
      });
    });
    return list;
  }
  function getWordCloudConfig(data) {
    return {
      width: 600,
      height: 400,
      data: getDataList(data),
      maskImage:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*07tdTIOmvlYAAAAAAAAAAABkARQnAQ',
      wordStyle: {
        rotation: [-Math.PI / 2, Math.PI / 2],
        rotateRatio: 0.5,
        rotationSteps: 4,
        fontSize: [10, 60],
        color: (word, weight) => {
          return getRandomColor();
        },
        active: {
          shadowColor: '#333333',
          shadowBlur: 10,
        },
        gridSize: 8,
      },
      shape: 'cardioid',
      shuffle: false,
      backgroundColor: '#fff',
      tooltip: { visible: true },
      selected: -1,
      onWordCloudHover: hoverAction,
    };
  }
  function getRandomColor() {
    const arr = [
      '#5B8FF9',
      '#5AD8A6',
      '#5D7092',
      '#F6BD16',
      '#E8684A',
      '#6DC8EC',
      '#9270CA',
      '#FF9D4D',
      '#269A99',
      '#FF99C3',
    ];
    return arr[Math.floor(Math.random() * (arr.length - 1))];
  }
  function hoverAction(item, dimension, evt, start) {}
  return <WordCloud {...config} />;
};

/**
 *  多话题关联
 */
const BubbleCharts: FC = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/antfincdn/XMCQ4qsuPa/smoking-rate.json',
    )
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    title: {
      visible: true,
      text: '多话题关联',
    },
    data,
    xField: 'change in female rate',
    yField: 'change in male rate',
    sizeField: 'pop',
    pointSize: [4, 30],
    colorField: 'continent',
    color: ['#ffd500', '#82cab2', '#193442', '#d18768', '#7e827a'],
    xAxis: {
      visible: true,
      max: 5,
      min: -25,
    },
  };
  return <Bubble {...config} />;
};

/**
 * 热门信息
 * @param props
 */
const HotMessageTable: FC = props => {
  interface HotMessage {
    id: string;
    title: string;
    source: string;
    create_time: string;
  }

  const data: HotMessage[] = new Array(8).fill({
    id: '1',
    title: '热门信息',
    source: '今日头条',
    create_time: '2020-02-12',
  });

  const columns: ColumnsType<HotMessage> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
  ];

  return (
    <Table dataSource={data} columns={columns} rowKey={record => record.id} />
  );
};

/**
 * 热点网民
 */
const HotNetizenTag: FC = props => {
  const tabList = [
    {
      tab: '全部',
      key: 'tab1',
    },
    {
      tab: '微博',
      key: 'tab2',
    },
    {
      tab: '知乎',
      key: 'tab3',
    },
    {
      tab: 'Bilili',
      key: 'tab4',
    },
  ];

  const cardGrid = (list: any[]) => {
    return (
      <Card bodyStyle={{ padding: 0 }}>
        {list.map(item => {
          return (
            <Card.Grid style={{ width: '25%' }}>
              <Card.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title="Card title"
                description="This is the description"
              />
            </Card.Grid>
          );
        })}
      </Card>
    );
  };

  const netizenList = new Array(12).fill({});

  const contentList = {
    tab1: cardGrid(netizenList),
    tab2: <p>content2</p>,
    tab3: <p>content3</p>,
    tab4: <p>content4</p>,
  };

  const [key, setKey] = useState('tab1');

  return (
    <>
      <Card
        style={{ width: '100%' }}
        title="热点网民"
        tabList={tabList}
        activeTabKey={key}
        onTabChange={key => {
          setKey(key);
        }}
      >
        {contentList[key]}
      </Card>
    </>
  );
};

const AnalyticsComponent: FC<{}> = props => {
  const dataList = [
    '工专路0号',
    '工专路1号',
    '工专路2号',
    '工专路3号',
    '工专路4号',
    '工专路5号',
  ];

  return (
    <div className="p-4">
      <Row className="mb-4" gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="讨论量"
              value={8846}
              valueStyle={{ color: 'black', fontSize: 30 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <div className="flex">
              <Avatar
                className="mr-2"
                size={60}
                style={{
                  color: '#ffffff',
                  backgroundColor: '#f55d52',
                  marginRight: '6px',
                }}
              >
                微
              </Avatar>
              <Statistic
                title="微博讨论量"
                value={8846}
                valueStyle={{ color: 'black', fontSize: 30 }}
              />
            </div>
            <Divider style={{ margin: '5px' }} />
            <p className="m-0">
              周讨论量 <strong>2312</strong>
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <div className="flex">
              <Avatar
                className="mr-2"
                size={60}
                style={{
                  color: '#ffffff',
                  backgroundColor: '#1077ef',
                  marginRight: '6px',
                }}
              >
                知
              </Avatar>
              <Statistic
                title="知乎讨论量"
                value={8846}
                valueStyle={{ color: 'black', fontSize: 30 }}
              />
            </div>
            <Divider style={{ margin: '5px' }} />
            <p className="m-0">
              周讨论量 <strong>2312</strong>
            </p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <div className="flex">
              <Avatar
                className="mr-2"
                size={60}
                style={{
                  color: '#ffffff',
                  backgroundColor: '#1fc4fd',
                  marginRight: '6px',
                }}
              >
                B
              </Avatar>
              <Statistic
                title="B站讨论量"
                value={8846}
                valueStyle={{ color: 'black', fontSize: 30 }}
              />
            </div>
            <Divider style={{ margin: '5px' }} />
            <p className="m-0">
              周讨论量 <strong>2312</strong>
            </p>
          </Card>
        </Col>
      </Row>

      <div className="mb-4">
        <Card title="话题热度" extra={<TimePicker />}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={16} lg={16}>
              <ColumnsCharts />
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <List
                header={<div>热门话题排行</div>}
                dataSource={dataList}
                split={false}
                renderItem={(item, index) => {
                  const prefix =
                    index > 2 ? (
                      <Tag>{index + 1}</Tag>
                    ) : (
                      <Tag color="black">{index + 1}</Tag>
                    );
                  return (
                    <List.Item>
                      {prefix}
                      {item}
                    </List.Item>
                  );
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      <Row className="mb-4" gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <StackedColumnCharts />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <WordCloudChars />
          </Card>
        </Col>
      </Row>

      <div className="mb-4">
        <Card>
          <BubbleCharts />
        </Card>
      </div>

      <div className="mb-4">
        <Card title="热门信息" bodyStyle={{ padding: 0 }}>
          <HotMessageTable />
        </Card>
      </div>

      <div className="mb-4">
        <HotNetizenTag />
      </div>
    </div>
  );
};

export default AnalyticsComponent;
