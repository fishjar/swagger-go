import React, { Component, Fragment, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import DateSelect from '@/components/DateSelect';
import JSONEdit from '@/components/JSONEdit';
import styles from './style.less';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Popconfirm,
  Modal,
  Switch,
} from 'antd';

const modelKey = 'auths';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const enumMaps = {
  gender: {
    0: '保密',
    1: '男',
    2: '女',
  },
  bloodType: {
    A: 'A型',
    B: 'B型',
    AB: 'AB型',
    O: 'O型',
  },
  authType: {
    account: '帐号',
    email: '邮箱',
    phone: '手机',
    wechat: '微信',
    weibo: '微博',
  },
};

const ViewModal = ({
  children,
  modalTitle = '编辑',
  modalWith = 720,
  formData: {
    id,
    userId,
    user = {},
    authType,
    authName,
    verifyTime,
    expireTime,
    isEnabled,
    createdAt,
    updatedAt,
  },
}) => {
  const [visible, setVisible] = useState(false);

  const handleShow = () => {
    setVisible(true);
  };

  const handleHide = () => {
    setVisible(false);
  };

  return (
    <span>
      <span onClick={handleShow}>{children}</span>
      <Modal
        destroyOnClose
        title={modalTitle}
        width={modalWith}
        visible={visible}
        onOk={handleHide}
        onCancel={handleHide}
        footer={null}
      >
        <Form {...formLayout}>
          <FormItem label="ID">{id}</FormItem>
          <FormItem label="关联用户ID">{userId}</FormItem>
          <FormItem label="关联用户姓名">{user.name}</FormItem>
          <FormItem label="鉴权类型">{enumMaps['authType'][authType]}</FormItem>
          <FormItem label="鉴权名称">{authName}</FormItem>
          <FormItem label="认证时间">
            {verifyTime && moment(verifyTime).format('YYYY-MM-DD HH:mm:ss')}
          </FormItem>
          <FormItem label="过期时间">
            {expireTime && moment(expireTime).format('YYYY-MM-DD HH:mm:ss')}
          </FormItem>
          <FormItem label="是否启用">{isEnabled ? '是' : '否'}</FormItem>
          <FormItem label="创建时间">{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</FormItem>
          <FormItem label="更新时间">{moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</FormItem>
        </Form>
      </Modal>
    </span>
  );
};

const EditModal = Form.create()(
  ({
    children,
    modalTitle = '编辑',
    modalWith = 720,
    form,
    formData: { id, userId, authType, authName, verifyTime, expireTime, isEnabled },
    dispatch,
    handleRefresh,
  }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const handleShow = () => {
      setVisible(true);
      dispatch({
        type: 'users/fetch',
        payload: {
          pageSize: 0,
        },
        callback: res => {
          setUsers(res.list);
        },
      });
    };

    const handleHide = () => {
      form.resetFields();
      setVisible(false);
      setLoading(false);
    };

    const handleOk = () => {
      form.validateFields((err, fields) => {
        if (err) return;
        console.log(fields);
        setLoading(true);
        if (id) {
          dispatch({
            type: 'auths/update',
            payload: { id, ...fields, user: users.find(item => item.id === fields.userId) },
            callback: () => {
              message.success('更新成功');
              handleHide();
            },
          });
        } else {
          dispatch({
            type: 'auths/add',
            payload: fields,
            callback: () => {
              message.success('添加成功');
              handleHide();
              handleRefresh();
            },
          });
        }
      });
    };

    return (
      <span>
        <span onClick={handleShow}>{children}</span>
        <Modal
          destroyOnClose
          title={modalTitle}
          width={modalWith}
          visible={visible}
          onOk={handleOk}
          onCancel={handleHide}
          confirmLoading={loading}
        >
          <Form {...formLayout} onSubmit={handleOk}>
            <FormItem label="关联用户">
              {form.getFieldDecorator('userId', {
                initialValue: userId,
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Select placeholder="请选择" showSearch optionFilterProp="children">
                  {users.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="鉴权类型">
              {form.getFieldDecorator('authType', {
                initialValue: authType,
                rules: [{ required: true, message: '请选择！' }],
              })(
                <Select placeholder="请选择">
                  {Object.entries(enumMaps['authType']).map(([key, val]) => (
                    <Option key={key} value={Number.isNaN(parseInt(key)) ? key : parseInt(key)}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="鉴权名称">
              {form.getFieldDecorator('authName', {
                initialValue: authName,
                rules: [{ required: true, message: '请输入！', min: 3, max: 20 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="认证时间">
              {form.getFieldDecorator('verifyTime', {
                initialValue: verifyTime,
              })(<DateSelect showTime />)}
            </FormItem>
            <FormItem label="过期时间">
              {form.getFieldDecorator('expireTime', {
                initialValue: expireTime,
              })(<DateSelect showTime />)}
            </FormItem>
            <FormItem label="是否启用">
              {form.getFieldDecorator('isEnabled', {
                initialValue: isEnabled,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  },
);

@connect(({ [modelKey]: data, loading }) => ({
  data,
  loading: loading.models[modelKey],
}))
@Form.create()
export default class ModelTable extends Component {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelKey}/fetch`,
      payload: params,
      callback: () => {
        this.setState({ selectedRows: [] });
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filtersArg,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}__${sorter.order.slice(0, -3)}`;
    }

    this.fetchData(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchData();
  };

  handleRefresh = () => {
    const { formValues } = this.state;
    this.fetchData(formValues);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      this.fetchData(values);
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: `${modelKey}/remove`,
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.handleRefresh();
      },
    });
  };

  handleDeleteMultiple = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    dispatch({
      type: `${modelKey}/removeBulk`,
      payload: {
        ids: selectedRows.map(item => item.id),
      },
      callback: () => {
        message.success('删除成功');
        this.handleRefresh();
      },
    });
  };

  handleUpdateMultiple = fields => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    dispatch({
      type: `${modelKey}/updateBulk`,
      payload: {
        ids: selectedRows.map(item => item.id),
        fields,
      },
      callback: () => {
        message.success('更新成功');
      },
    });
  };

  handleEnabledMultiple = () => {
    this.handleUpdateMultiple({ isEnabled: true });
  };

  handleDisabledMultiple = () => {
    this.handleUpdateMultiple({ isEnabled: false });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('isEnabled')(
                <Select allowClear placeholder="请选择">
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, loading, dispatch } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '关联用户',
        dataIndex: 'userId',
        render: (_, record) => record.user.name,
      },
      {
        title: '鉴权类型',
        dataIndex: 'authType',
        filters: Object.entries(enumMaps['authType']).map(([key, val]) => ({
          text: val,
          value: key,
        })),
        render: val => enumMaps['authType'][val],
      },
      {
        title: '鉴权名称',
        dataIndex: 'authName',
        sorter: true,
      },
      {
        title: '认证时间',
        dataIndex: 'verifyTime',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '过期时间',
        dataIndex: 'expireTime',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '是否启用',
        dataIndex: 'isEnabled',
        render: val => (val ? '是' : '否'),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <ViewModal modalTitle="查看" dispatch={dispatch} formData={record}>
              <a>查看</a>
            </ViewModal>
            <Divider type="vertical" />
            <EditModal modalTitle="编辑" dispatch={dispatch} formData={record}>
              <a>编辑</a>
            </EditModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <EditModal
                modalTitle="新建"
                dispatch={dispatch}
                formData={{}}
                handleRefresh={this.handleRefresh}
              >
                <Button icon="plus" type="primary">
                  新建
                </Button>
              </EditModal>
              {selectedRows.length > 0 && (
                <Fragment>
                  <Button icon="arrow-up" onClick={this.handleEnabledMultiple}>
                    启用
                  </Button>
                  <Button icon="arrow-down" onClick={this.handleDisabledMultiple}>
                    禁用
                  </Button>
                  <Popconfirm title="确定删除？" onConfirm={() => this.handleDeleteMultiple()}>
                    <Button icon="delete">删除</Button>
                  </Popconfirm>
                </Fragment>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey={'id'}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
