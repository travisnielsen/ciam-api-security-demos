import React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { AzureAD, LoginType, AuthenticationState } from 'react-aad-msal';
import { authProvider } from '../authProvider';
import store from '../store/store';

export default class NavMenu extends React.Component {
  constructor (props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    authProvider.setLoginType(LoginType.Popup);

  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  editProfile() {
    authProvider.setLoginType(LoginType.Redirect);
    var authParams = authProvider.getAuthenticationParameters();
    authParams.authority = "https://nielskilab.b2clogin.com/tfp/nielskilab.onmicrosoft.com/B2C_1A_ProfileEdit";
    authProvider.setAuthenticationParameters(authParams);
    authProvider.login();
    authParams.authority = "https://nielskilab.b2clogin.com/tfp/nielskilab.onmicrosoft.com/B2C_1A_SUSI'";
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light >
          <Container>
            <NavbarBrand tag={Link} to="/">nielskilab</NavbarBrand>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                <AzureAD provider={authProvider} reduxStore={store}>
                  {
                    ({login, logout, authenticationState, accountInfo }) => {
                      if (authenticationState === AuthenticationState.Authenticated) {
                        return (
                          <React.Fragment>
                            <div class="btn-group">
                              <button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {accountInfo.account.idToken.given_name} {accountInfo.account.idToken.family_name}
                              </button>
                              <div class="dropdown-menu dropdown-menu-right">
                                <button onClick={this.editProfile} className="dropdown-item" type="button">Profile</button>
                                <div class="dropdown-divider"></div>
                                <button onClick={logout} className="dropdown-item" type="button">Sign Out</button>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      } else if (authenticationState === AuthenticationState.Unauthenticated) {
                        return (
                          <React.Fragment>
                            <button onClick={login} className="nav-link text-dark">Login</button>
                          </React.Fragment>
                        );
                      }
                    }
                  }
                </AzureAD>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
