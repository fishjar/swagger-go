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
  TreeSelect,
} from 'antd';

const modelKey = 'menus';

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
};

const ViewModal = ({
  children,
  modalTitle = '编辑',
  modalWith = 720,
  formData: { id, name, parent, path, icon, sort, createdAt, updatedAt },
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
          <FormItem label="名称">{name}</FormItem>
          <FormItem label="父级名称">{parent && parent.name}</FormItem>
          <FormItem label="路径">{path}</FormItem>
          <FormItem label="图标">{icon}</FormItem>
          <FormItem label="排序">{sort}</FormItem>
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
    formData: { id, name, parentId, path, icon, sort },
    dispatch,
    handleRefresh,
  }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState([]);

    const buildTree = (list, pid) =>
      list
        .filter(item => item.parentId === pid)
        .sort((a, b) => a.sort - b.sort)
        .map(item => ({
          title: item.name,
          value: item.id,
          key: item.id,
          children: buildTree(list, item.id),
        }));

    const handleShow = () => {
      setVisible(true);
      dispatch({
        type: 'menus/fetch',
        payload: {
          pageSize: 0,
        },
        callback: res => {
          setMenus(res.list);
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
          fields.parentId = fields.parentId || null;
          dispatch({
            type: `${modelKey}/update`,
            payload: { id, ...fields, parent: menus.find(item => item.id === fields.parentId) },
            callback: () => {
              message.success('更新成功');
              handleHide();
            },
          });
        } else {
          dispatch({
            type: `${modelKey}/add`,
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
            <FormItem label="名称">
              {form.getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '请输入！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="父菜单">
              {form.getFieldDecorator('parentId', {
                initialValue: parentId,
              })(
                // <Select placeholder="请选择" allowClear>
                //   {menus.map(item => (
                //     <Option key={item.id} value={item.id}>
                //       {item.name}
                //     </Option>
                //   ))}
                // </Select>,
                <TreeSelect
                  allowClear
                  placeholder="请选择"
                  treeData={buildTree(menus, null)}
                  treeDefaultExpandAll
                />,
              )}
            </FormItem>
            <FormItem label="路径">
              {form.getFieldDecorator('path', {
                initialValue: path,
                rules: [{ required: true, message: '请输入！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="图标">
              {form.getFieldDecorator('icon', {
                initialValue: icon,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="排序">
              {form.getFieldDecorator('sort', {
                initialValue: sort,
                rules: [{ required: true, message: '请输入！' }],
              })(<InputNumber placeholder="请输入" parser={input => input && ~~input} />)}
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
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
        title: '名称',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '父级名称',
        dataIndex: 'parentId',
        render: (_, record) => record.parent && record.parent.name,
      },
      {
        title: '路径',
        dataIndex: 'path',
        sorter: true,
      },
      {
        title: '图标',
        dataIndex: 'icon',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        sorter: true,
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
                <Popconfirm title="确定删除？" onConfirm={() => this.handleDeleteMultiple()}>
                  <Button icon="delete">删除</Button>
                </Popconfirm>
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
