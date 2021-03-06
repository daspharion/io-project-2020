import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './extra/Button'

import './styles/welcome.scss'

export class Welcome extends Component<{}, {}> {
  render () {
    return (
      <div className='welcome-component'>
        <span>A K A D E M I K</span>
        <span>w twojej komórce</span>
        <Link to='/login'><Button type='1' value='Zaloguj' /></Link>
      </div>
    )
  }
}
