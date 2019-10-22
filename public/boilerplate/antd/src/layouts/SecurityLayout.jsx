import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isUserReady: false,
    isMenuReady: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        callback: () => {
          this.setState({
            isUserReady: true,
          });
        },
      });
      dispatch({
        type: 'global/fetchMenus',
        callback: () => {
          this.setState({
            isMenuReady: true,
          });
        },
      });
    }
  }

  render() {
    const { isUserReady, isMenuReady } = this.state;
    const { children, loading, currentUser, status } = this.props;

    if ((!currentUser.id && loading) || !isUserReady || !isMenuReady) {
      return <PageLoading />;
    }

    // if (status !== 'ok') {
    //   return <Redirect to="/user/login"></Redirect>;
    // }

    // if (!currentUser.id) {
    //   return <Redirect to="/user/login"></Redirect>;
    // }

    return children;
  }
}

export default connect(({ user, login, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  status: login.status,
}))(SecurityLayout);
