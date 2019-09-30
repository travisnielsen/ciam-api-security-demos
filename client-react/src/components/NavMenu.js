import React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { AzureAD, LoginType, AuthenticationState } from 'react-aad-msal';
import { authProvider } from '../authProvider';
import store from '../store/configureStore';

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
                <AzureAD provider={authProvider}>
                  {
                    ({login, logout, authenticationState, accountInfo}) => {
                      if (authenticationState === AuthenticationState.Authenticated) {
                        return (
                          <React.Fragment>
                            <button onClick={logout} className="nav-link text-dark">Logout</button>
                          </React.Fragment>
                        )
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
