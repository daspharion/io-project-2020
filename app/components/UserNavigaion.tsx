import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

import './styles/userNavigaion.scss'

type Props = {
  rank: number;
  path: string;
  disabled: boolean;
}

const logout = () => {
  localStorage.clear()
  location.replace('/')
  location.reload()
}

const i11n = new Map([
  ['dashboard', 'Mój Panel'],
  ['residents', 'Rezydenci'],
  ['requests', 'Oczekujące'],
  ['announcements', 'Ogłoszenia'],
  ['laundry', 'Pralnia'],
  ['tools', 'Narzędzia']
])

export class UserNavigaion extends Component<Props, {}> {
  render () {
    const { path, disabled } = this.props

    return (
      <Navbar className='user-navigaion justify-content-between' bg='dark' variant='dark'>
        <Navbar.Brand>
          {path.slice(1) ? i11n.get(path.slice(1)) : 'Mój Panel'}
        </Navbar.Brand>

        <Nav>
          <NavDropdown title={<img src='images/icon-settings.svg' />} id={null} disabled={disabled}>
            <NavDropdown.Item as={NavLink} to='/settings'>Ustawienia</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link onClick={logout}>Wyloguj</Nav.Link>
        </Nav>
      </Navbar>
    )
  }
}
