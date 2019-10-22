import { queryCurrent, query as queryUsers, queryCurrentUser } from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ callback }, { call, put }) {
      // const response = yield call(queryCurrent);
      const response = yield call(queryCurrentUser);
      if (!response) {
        yield put({
          type: 'saveCurrentUser',
          payload: {},
        });
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      callback && callback(response);
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
