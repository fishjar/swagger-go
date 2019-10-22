import {
  findAndCountAll,
  findByPk,
  singleCreate,
  bulkCreate,
  bulkUpdate,
  updateByPk,
  bulkDestroy,
  destroyByPk,
  findOne,
  findOrCreate,
} from './service';

const initData = {
  list: [],
  pagination: {},
};

const Model = {
  namespace: 'users',
  state: initData,
  effects: {
    *fetch({ payload = {}, callback }, { call, put }) {
      const response = yield call(findAndCountAll, payload);
      if (!response) {
        yield put({
          type: 'save',
          payload: initData,
        });
        callback && callback(initData);
        return;
      }
      const data = {
        list: response.rows,
        pagination: {
          total: response.count,
          pageSize: parseInt(`${payload.pageSize}`, 10) || 10,
          current: parseInt(`${payload.pageNum}`, 10) || 1,
        },
      };
      yield put({
        type: 'save',
        payload: data,
      });
      callback && callback(data);
    },

    *fetchSingle({ payload, callback }, { call, put }) {
      const response = yield call(findByPk, payload.id);
      response && callback && callback(response);
    },

    *add({ payload, callback }, { call }) {
      const response = yield call(singleCreate, payload);
      response && callback && callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(destroyByPk, payload.id);
      response && callback && callback();
    },

    *removeBulk({ payload, callback }, { call, put }) {
      const response = yield call(bulkDestroy, payload.ids);
      response && callback && callback();
    },

    *update({ payload = {}, callback }, { call, put }) {
      const { id, ...fields } = payload;
      const response = yield call(updateByPk, id, fields);
      if (!response) {
        return;
      }
      yield put({
        type: 'pactch',
        payload: {
          ids: [id],
          fields,
        },
      });
      callback && callback();
    },

    *updateBulk({ payload = {}, callback }, { call, put }) {
      const { ids, fields } = payload;
      const response = yield call(bulkUpdate, ids, fields);
      if (!response) {
        return;
      }
      yield put({
        type: 'pactch',
        payload: {
          ids,
          fields,
        },
      });
      callback && callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    pactch(state, action) {
      return {
        ...state,
        list: state.list.map(item => {
          if (action.payload.ids.includes(item.id)) {
            return { ...item, ...action.payload.fields };
          }
          return item;
        }),
      };
    },
  },
};
export default Model;
