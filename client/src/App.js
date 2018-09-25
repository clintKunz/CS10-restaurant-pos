import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { setInitialAuth } from './redux/actions/auth';
import * as s from './styles';
import Landing from './components/Landing';
import Logout from './components/Logout';
import Login from './components/Login';
import Register from './components/Register';
import RegistrationSuccess from './components/RegistrationSuccess';
import LoginEmployee from './components/LoginEmployee';
import CreateEmployee from './components/CreateEmployee';
import Servers from './components/Servers';
import TablesPage from './components/TablesPage';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import PartyPage from './components/PartyPage';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import NewRestaurant from './components/NewRestaurant';
import RequireNotAuth from './components/HOC/RequireNotAuth';
import RequireAuth from './components/HOC/RequireAuth';
import { theme } from './global-styles/variables';

const SidebarWithRouter = withRouter(props => <Sidebar {...props} />);
const AuthedPartyPage = RequireAuth(PartyPage);

class App extends Component {
  componentDidMount() {
    this.props.setInitialAuth();
  }

  render() {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <s.Container>
            <Navbar modalIsOpen={this.props.modalIsOpen} />
            <s.Main>
              <SidebarWithRouter modalIsOpen={this.props.modalIsOpen} role={this.props.role} />
              <Switch>
                <Route path="/" component={Landing} exact />
                <Route path="/logout" component={Logout} />
                <Route path="/login" component={RequireNotAuth(Login)} />
                <Route path="/register" component={RequireNotAuth(Register)} />
                <Route path="/success" component={RegistrationSuccess} />
                <Route path="/login-employee" component={RequireAuth(LoginEmployee)} />
                <Route path="/new-restaurant" component={RequireAuth(NewRestaurant)} />
                <Route path="/new-employee" component={RequireAuth(CreateEmployee)} />
                <Route path="/tables" component={RequireAuth(TablesPage)} />
                <Route path="/servers" component={RequireAuth(Servers)} />
                <Route
                  path="/party/:id"
                  render={props => (
                    <AuthedPartyPage {...props} modalIsOpen={this.props.modalIsOpen} />
                  )}
                />
                <Route path="/settings" component={RequireAuth(Settings)} />
                <Route path="/404" component={NotFound} exact />
                <Redirect to="/404" />
              </Switch>
            </s.Main>
          </s.Container>
        </ThemeProvider>
      </Router>
    );
  }
}

App.propTypes = {
  modalIsOpen: PropTypes.bool,
  role: PropTypes.shape({
    admin: PropTypes.bool,
    manager: PropTypes.bool
  }),
  setInitialAuth: PropTypes.func
};

App.defaultProps = {
  modalIsOpen: false,
  role: { admin: false, manager: false },
  setInitialAuth: () => {}
};

const mapStateToProps = state => ({
  modalIsOpen: state.modal.isOpen,
  role: state.auth.role
});

export default connect(
  mapStateToProps,
  { setInitialAuth }
)(App);
