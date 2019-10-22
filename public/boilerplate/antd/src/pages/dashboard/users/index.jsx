import React, { Component, Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import DateSelect from '@/components/DateSelect';
import JSONEdit from '@/components/JSONEdit';
import ObjectArrayEdit from '@/components/ObjectArrayEdit';
import ObjectArraySelect from '@/components/ObjectArraySelect';
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
} from 'antd';

const modelKey = 'users';

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
  formData: {
    id,
    name,
    nickname,
    gender,
    avatar,
    mobile,
    email,
    homepage,
    birthday,
    height,
    bloodType,
    notice,
    address,
    lives = [],
    tags,
    luckyNumbers,
    score,
    userNo,
    createdAt,
    updatedAt,
    auths = [],
    roles = [],
    groups = [],
    friends = [],
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
          <FormItem label="名称">{name}</FormItem>
          <FormItem label="绑定帐号">
            {auths.map(item => (
              <div key={item.id}>{`帐号类型: ${item.authType}, 帐号名称: ${item.authName} (${
                item.isEnabled ? '启用' : '禁用'
              })`}</div>
            ))}
          </FormItem>
          <FormItem label="角色">{roles.map(item => item.name).join(', ')}</FormItem>
          <FormItem label="组">{groups.map(item => item.name).join(', ')}</FormItem>
          <FormItem label="朋友">{friends.map(item => item.name).join(', ')}</FormItem>
          <FormItem label="昵称">{nickname}</FormItem>
          <FormItem label="性别">{enumMaps['gender'][gender]}</FormItem>
          <FormItem label="头像">{avatar}</FormItem>
          <FormItem label="手机">{mobile}</FormItem>
          <FormItem label="邮箱">{email}</FormItem>
          <FormItem label="主页">{homepage}</FormItem>
          <FormItem label="生日">{birthday && moment(birthday).format('YYYY-MM-DD')}</FormItem>
          <FormItem label="身高(cm)">{height}</FormItem>
          <FormItem label="血型(ABO)">{enumMaps['bloodType'][bloodType]}</FormItem>
          <FormItem label="备注">{notice}</FormItem>
          <FormItem label="地址">{address && JSON.stringify(address)}</FormItem>
          <FormItem label="生活轨迹">{lives && JSON.stringify(lives)}</FormItem>
          <FormItem label="标签">{tags && tags.join(', ')}</FormItem>
          <FormItem label="幸运数字">{luckyNumbers && luckyNumbers.join(', ')}</FormItem>
          <FormItem label="积分">{score}</FormItem>
          <FormItem label="编号">{userNo}</FormItem>
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
    formData: {
      id,
      name,
      nickname,
      gender,
      avatar,
      mobile,
      email,
      homepage,
      birthday,
      height,
      bloodType,
      notice,
      intro,
      address,
      lives = [],
      tags,
      luckyNumbers,
      score,
      roles = [],
      groups = [],
      friends = [],
    },
    dispatch,
    handleRefresh,
  }) => {
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allRoles, setAllRoles] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [allFriends, setAllFriends] = useState([]);

    const handleShow = () => {
      setVisible(true);
      dispatch({
        type: 'roles/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllRoles(res.list);
        },
      });
      dispatch({
        type: 'groups/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllGroups(res.list);
        },
      });
      dispatch({
        type: 'users/fetch',
        payload: { pageSize: 0 },
        callback: res => {
          setAllFriends(res.list);
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
            type: 'users/update',
            payload: {
              id,
              ...fields,
              gender: fields.gender || null,
              bloodType: fields.bloodType || null,
            },
            callback: () => {
              message.success('更新成功');
              handleHide();
            },
          });
        } else {
          dispatch({
            type: 'users/add',
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
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ required: true, message: '请输入！', min: 3, max: 20 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="关联角色">
              {getFieldDecorator('roles', {
                initialValue: roles,
              })(<ObjectArraySelect listData={allRoles} />)}
            </FormItem>
            <FormItem label="关联组">
              {getFieldDecorator('groups', {
                initialValue: groups,
              })(<ObjectArraySelect listData={allGroups} />)}
            </FormItem>
            <FormItem label="关联组">
              {getFieldDecorator('friends', {
                initialValue: friends,
              })(<ObjectArraySelect listData={allFriends} />)}
            </FormItem>
            <FormItem label="昵称">
              {getFieldDecorator('nickname', {
                initialValue: nickname,
                rules: [{ max: 64 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('gender', {
                initialValue: gender,
              })(
                <Select placeholder="请选择" allowClear>
                  {Object.entries(enumMaps['gender']).map(([key, val]) => (
                    <Option key={key} value={Number.isNaN(parseInt(key)) ? key : parseInt(key)}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="头像">
              {getFieldDecorator('avatar', {
                initialValue: avatar,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="手机">
              {getFieldDecorator('mobile', {
                initialValue: mobile,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: email,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="主页">
              {getFieldDecorator('homepage', {
                initialValue: homepage,
                rules: [{ max: 16 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="生日">
              {getFieldDecorator('birthday', {
                initialValue: birthday,
              })(<DateSelect />)}
            </FormItem>
            <FormItem label="身高(cm)">
              {getFieldDecorator('height', {
                initialValue: height,
              })(<InputNumber min={0.01} max={250} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="血型">
              {getFieldDecorator('bloodType', {
                initialValue: bloodType,
              })(
                <Select placeholder="请选择" allowClear>
                  {Object.entries(enumMaps['bloodType']).map(([key, val]) => (
                    <Option key={key} value={Number.isNaN(parseInt(key)) ? key : parseInt(key)}>
                      {val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('notice', {
                initialValue: notice,
              })(<TextArea autosize placeholder="请输入" />)}
            </FormItem>
            <FormItem label="介绍">
              {getFieldDecorator('intro', {
                initialValue: intro || '',
              })(<ReactQuill placeholder="请输入" />)}
            </FormItem>
            <FormItem label="地址">
              <FormItem>
                {getFieldDecorator('address.province', {
                  initialValue: address && address.province,
                })(<Input addonBefore="省" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('address.city', {
                  initialValue: address && address.city,
                })(<Input addonBefore="市" />)}
              </FormItem>
            </FormItem>
            <FormItem label="生活轨迹">
              {getFieldDecorator('lives', {
                initialValue: lives,
              })(
                <ObjectArrayEdit
                  fieldsDefine={{
                    x: { type: 'number', description: 'X坐标' },
                    y: { type: 'number', description: 'Y坐标' },
                  }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
            <FormItem label="标签">
              {getFieldDecorator('tags', {
                initialValue: tags || undefined,
              })(
                <Select mode="tags" tokenSeparators={[',']} placeholder="请输入">
                  {(tags || []).map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="幸运数字">
              {getFieldDecorator('luckyNumbers', {
                initialValue: luckyNumbers || undefined,
              })(
                <Select mode="tags" tokenSeparators={[',']} placeholder="请输入">
                  {(luckyNumbers || []).map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="积分">
              {getFieldDecorator('score', {
                initialValue: score,
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
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('gender')(
                <Select allowClear placeholder="请选择">
                  {Object.entries(enumMaps['gender']).map(([key, val]) => (
                    <Option value={key} key={key}>
                      {val}
                    </Option>
                  ))}
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
        title: '姓名',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '角色',
        dataIndex: 'roles',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '组',
        dataIndex: 'groups',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '友',
        dataIndex: 'friends',
        render: val => val && val.map(item => item.name).join(', '),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        filters: Object.entries(enumMaps['gender']).map(([key, val]) => ({
          text: val,
          value: key,
        })),
        render: val => enumMaps['gender'][val],
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        sorter: true,
        render: val => val && moment(val).format('YYYY-MM-DD'),
      },
      {
        title: '地址',
        dataIndex: 'address',
        render: val => val && JSON.stringify(val),
      },
      {
        title: '标签',
        dataIndex: 'tags',
        render: val => val && val.join(', '),
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
