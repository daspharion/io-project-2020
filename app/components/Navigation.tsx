import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './styles/navigation.scss'

interface State {
  toggle: boolean;
}

export class Navigation extends Component<{}, State> {
  constructor (props: Readonly<{}>) {
    super(props)

    this.state = {
      toggle: false
    }
  }

  onLink () {
    const { toggle } = this.state

    if (toggle) this.setState({ toggle: false })
  }

  onToggle () {
    const { toggle } = this.state

    this.setState({ toggle: !toggle })
  }

  render () {
    const { toggle } = this.state

    return (
      <nav className={`${toggle ? 'on' : ''}`}>
        <div>
          <Link to='/'><img src='images/logo.svg' /></Link>
          <ul onClick={() => this.onLink()}>
            <li><Link to='/pricing'>Cennik</Link></li>
            <li><Link to='/about'>O Nas</Link></li>
          </ul>
        </div>
        <div className={`nav-toogle${toggle ? ' on' : ''}`} onClick={() => this.onToggle()}>
          <span /><span /><span /><span />
        </div>
      </nav>
    )
  }
}
