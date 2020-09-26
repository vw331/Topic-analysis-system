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
  Spin,
  Table,
  Alert,
  Empty,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  Column,
  StackedColumn,
  WordCloud,
  Bubble,
  GroupedColumn,
} from '@ant-design/charts';
import { ColumnsType } from 'antd/es/table';
import {
  TopicModelState,
  connect,
  Dispatch,
  ConnectProps,
  Loading,
  history,
} from 'umi';
import { Topic } from '@/models/TopicModel';
import { AnalyticsData, AnalyticsModelState } from '@/models/AnalyticsModel';
import './analytics.less';
import { Rose } from '@ant-design/charts';
import { WordCloudConfig } from '@ant-design/charts/es/wordCloud';
import { BubbleConfig } from '@ant-design/charts/es/bubble';
import { Scene } from '@antv/l7';
import { CountryLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';

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
export interface HotTopic {
  name: string;
  time: string;
  value: number;
}

const ColumnsCharts: FC<{ data: HotTopic[] }> = props => {
  const { data } = props;

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
    data: data as [],
    padding: [30, 0, 30, 50],
    xField: 'time',
    yField: 'value',
    groupField: 'name',
    conversionTag: { visible: false },
    color: ['#1ca9e6', '#f88c24'],
  };

  return (
    <div style={{ height: '400px' }}>
      <GroupedColumn {...config} />
    </div>
  );
};

export interface ChangingTrend {
  name: string;
  time: string;
  value: number;
}

/**
 * 用户变化趋势
 */
const StackedColumnCharts: FC<{ data: ChangingTrend[] }> = props => {
  const config = {
    forceFit: true,
    title: {
      visible: true,
      text: '用户变化趋势',
    },
    padding: [15, 0, 30, 30],
    data: props.data as [],
    xField: 'time',
    yField: 'value',
    yAxis: { min: 0 },
    label: { visible: false },
    stackField: 'name',
    color: ['#ae331b', '#f27957', '#dadada', '#609db7', '#1a6179'],
    connectedArea: {
      visible: true,
      triggerOn: false,
      lineStyle: {
        stroke: '#afb1b5',
        opacity: 0.8,
      },
      areaStyle: {
        fill: '#e8e8e8',
        opacity: 0.5,
      },
    },
  };
  return <StackedColumn {...config} />;
};

export interface WordCloud {
  name: string;
  value: number;
}
/**
 *  词云
 */
const WordCloudChars: FC<{ data: WordCloud[] }> = props => {
  const data = props.data;
  const config: WordCloudConfig = getWordCloudConfig(data);
  function getDataList(data: any[]) {
    const list: any[] = [];
    data.forEach(d => {
      list.push({
        word: d.name,
        weight: d.value,
        id: list.length,
      });
    });
    return list;
  }
  function getWordCloudConfig(data: any): WordCloudConfig {
    return {
      width: 600,
      height: 400,
      data: getDataList(data),
      wordStyle: {
        rotation: [-Math.PI / 2, Math.PI / 2],
        rotateRatio: 0.5,
        rotationSteps: 4,
        fontSize: [10, 60],
        color: () => {
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
      //tooltip: { visible: true },
      selected: -1,
      //onWordCloudHover: hoverAction,
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
  // function hoverAction(item, dimension, evt, start) {}
  return <WordCloud {...config} />;
};

export interface TopicRelevance {
  name: string;
  value_x: number;
  value_y: number;
  rank: number;
}

/**
 *  多话题关联
 */
const BubbleCharts: FC<{ data: TopicRelevance[] }> = props => {
  const data = props.data as [];

  const config: BubbleConfig = {
    title: {
      visible: true,
      text: '多话题关联',
    },
    data,
    xField: 'value_x',
    yField: 'value_y',
    sizeField: 'rank',
    pointSize: [4, 30],
    colorField: 'name',
    color: ['#ffd500', '#82cab2', '#193442', '#d18768', '#7e827a'],
  };
  return <Bubble {...config} />;
};

export interface HotMessage {
  id: string;
  title: string;
  source: string;
  create_time: string;
  reposted: number;
}
/**
 * 热门信息
 * @param props
 */
const HotMessageTable: FC<{ data: HotMessage[] }> = props => {
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
    {
      title: '转发数',
      dataIndex: 'reposted',
      key: 'reposted',
    },
  ];

  return (
    <Table
      dataSource={props.data}
      columns={columns}
      rowKey={record => record.id}
    />
  );
};

/**
 * 热点网民
 */
interface Netizen {
  id: string | number;
  name: string;
  avatar: string;
  describe: string;
}
export interface HotNetizen {
  tab: string;
  key: string;
  content: Netizen[];
}

const HotNetizenTag: FC<{ data: HotNetizen[] }> = props => {
  if (!props.data || !props.data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const data = props.data;

  const tabList = data.map(item => ({
    tab: item.tab,
    key: item.key,
  }));

  const cardGrid = (list: Netizen[]) => {
    return (
      <Card bodyStyle={{ padding: 0 }}>
        {list.map((item, index) => {
          return (
            <Card.Grid style={{ width: '25%' }} key={index}>
              <Card.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.name}
                description={item.describe}
              />
            </Card.Grid>
          );
        })}
      </Card>
    );
  };

  let contentList = {};
  data.forEach(item => {
    contentList[item.key] = cardGrid(item.content);
  });

  const [key, setKey] = useState(tabList[0].key);

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

/**
 *  地图分布
 */
export interface MapNetizen {
  name: string;
  value: number;
}
const MapDistribution: FC<{ data: MapNetizen[] }> = props => {
  if (!props.data || !props.data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'blank',
        zoom: 3,
        minZoom: 0,
        maxZoom: 10,
      }),
    });

    scene.on('loaded', () => {
      new CountryLayer(scene, {
        data: props.data,
        joinBy: ['NAME_CHN', 'name'],
        depth: 1,
        provinceStroke: '#783D2D',
        cityStroke: '#EBCCB4',
        cityStrokeWidth: 1,
        fill: {
          color: {
            field: 'NAME_CHN',
            values: [
              '#feedde',
              '#fdd0a2',
              '#fdae6b',
              '#fd8d3c',
              '#e6550d',
              '#a63603',
            ],
          },
        },
        popup: {
          enable: true,
          Html: props => {
            console.log(props);
            return `<span>${props.NAME_CHN}:${props.value || '未知'}</span>`;
          },
        },
      });
    });

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div style={{ height: 400, position: 'relative' }}>
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  );
};

/**
 *  性别分布
 */
export interface GenderType {
  type: string;
  value: number;
}
const GenderDistribution: FC<{ data: GenderType[] }> = props => {
  if (!props.data || !props.data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  const config = {
    forceFit: true,
    title: {
      visible: true,
      text: '性别分布',
    },
    radius: 0.8,
    data: props.data as [],
    radiusField: 'value',
    categoryField: 'type',
    colorField: 'type',
    label: {
      visible: true,
      type: 'outer',
      content: (text: any) => text.value,
    },
  };
  return <Rose {...config} />;
};

/**
 * 评论情感
 */
export interface CommentEmotionalType extends GenderType {}

const CommentEmotional: FC<{ data: CommentEmotionalType[] }> = props => {
  if (!props.data || !props.data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  const config = {
    forceFit: true,
    title: {
      visible: true,
      text: '评论情感分析',
    },
    radius: 0.8,
    data: props.data as [],
    radiusField: 'value',
    categoryField: 'type',
    colorField: 'type',
    label: {
      visible: true,
      type: 'outer',
      content: (text: any) => text.value,
    },
  };
  return <Rose {...config} />;
};

interface AnalyticsPageProps {
  project: Topic;
  loading: Loading;
  analyticsData: AnalyticsData;
  dispatch: Dispatch;
}

const AnalyticsComponent: FC<AnalyticsPageProps> = props => {
  const { project, loading, dispatch, analyticsData } = props;
  const { status, progress, project_id } = project;
  const isLoading: boolean = loading.effects['analytics/getData'] || false;

  useEffect(() => {
    if (status == 'ok') {
      dispatch({
        type: 'analytics/getData',
        payload: { id: project_id },
      });
    }
  }, [status]);

  if (status == 'idle') {
    return (
      <Alert
        style={{ margin: 15, textAlign: 'center' }}
        type="error"
        message="未开始"
        description={`当前进度:${progress}`}
      />
    );
  }
  if (status == 'analysising') {
    return (
      <Alert
        style={{ margin: 15, textAlign: 'center' }}
        type="warning"
        message="正在分析"
        description={`当前进度:${progress}`}
      />
    );
  }
  if (isLoading || !analyticsData) {
    return (
      <div className="text-center p-4">
        <Spin />
      </div>
    );
  }

  const {
    general,
    hot_topic,
    hot_topic_ranking,
    changing_trend,
    word_cloud,
    topic_relevance,
    hot_message,
    hot_netizen,
    map_netizen,
    gender_type,
    comment_emotional_type,
  } = analyticsData;

  return (
    <div className="p-4">
      <Row className="mb-4" gutter={16}>
        {general.map(item => (
          <Col key={item.title} xs={24} sm={24} md={12} lg={6}>
            <Card>
              <div className="flex">
                <Avatar
                  className="mr-2"
                  size={60}
                  style={{
                    color: '#ffffff',
                    backgroundColor: item.brand_color,
                    marginRight: '6px',
                  }}
                >
                  {item.title.charAt(0)}
                </Avatar>
                <Statistic
                  title={item.title}
                  value={item.total_all}
                  valueStyle={{ color: 'black', fontSize: 30 }}
                />
              </div>
              <Divider style={{ margin: '5px' }} />
              <p className="m-0">
                周讨论量 <strong>{item.total_week}</strong>
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mb-4">
        <Card title="话题热度">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={18} lg={18}>
              <ColumnsCharts data={hot_topic} />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <List
                header={<div>热门话题排行</div>}
                dataSource={hot_topic_ranking}
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
            <StackedColumnCharts data={changing_trend} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <WordCloudChars data={word_cloud} />
          </Card>
        </Col>
      </Row>

      <div className="mb-4">
        <Card>
          <BubbleCharts data={topic_relevance} />
        </Card>
      </div>

      <div className="mb-4">
        <Card title="热门信息" bodyStyle={{ padding: 0 }}>
          <HotMessageTable data={hot_message} />
        </Card>
      </div>

      <div className="mb-4">
        <Card title="地理位置分布" bodyStyle={{ padding: 0 }}>
          <MapDistribution data={map_netizen} />
        </Card>
      </div>

      <Row className="mb-4" gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <GenderDistribution data={gender_type} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card>
            <CommentEmotional data={comment_emotional_type} />
          </Card>
        </Col>
      </Row>

      <div className="mb-4">
        <HotNetizenTag data={hot_netizen} />
      </div>
    </div>
  );
};

const mapStateToProps = (props: any): AnalyticsPageProps => {
  return {
    analyticsData: props.analytics.analyticsData,
    loading: props.loading,
  } as AnalyticsPageProps;
};

export default connect(mapStateToProps)(AnalyticsComponent);
