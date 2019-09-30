import React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { AzureAD, LoginType, AuthenticationState } from 'react-aad-msal';
import { authProvider } from '../authProvider';

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
                <AzureAD provider={authProvider} forceLogin={false}>
                  {
                    ({login, logout, authenticationState, accountInfo}) => {
                      if (authenticationState === AuthenticationState.Authenticated) {
                        return (
                          <ul className="nav-item dropdown-menu">Welcome, {accountInfo.account.name}!
                            <li><a href="#books">Books</a></li>
                            <li><a href="#podcasts">Podcasts</a></li>
                          </ul>
                        );
                      } else if (authenticationState === AuthenticationState.Unauthenticated) {
                        return (
                          <NavItem>
                            <button onClick={login}>Login</button>
                          </NavItem>
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
