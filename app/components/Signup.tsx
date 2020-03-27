import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './styles/signup.scss'

export class Signup extends Component<{}, {}> {
  render () {
    return (
      <div className='signup-component'>
        <div className='labels'>
          <span>Rejestracja</span>
          <span>wypełnij poniższe pola</span>
        </div>
        <div className='input-field email'>
          <div>
            <img src='images/icon-mail.svg' />
            <input
              type='text' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false'
              placeholder='adres e-mail' maxLength={32}
            />
          </div>
        </div>
        <div className='input-field password'>
          <div>
            <img src='images/icon-lock.svg' />
            <input
              type='password' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false'
              placeholder='hasło' maxLength={32}
            />
          </div>
        </div>
        <div className='input-field password'>
          <div>
            <img src='images/icon-lock.svg' />
            <input
              type='password' autoCapitalize='off' autoComplete='off' autoCorrect='off' spellCheck='false'
              placeholder='Powtórz hasło' maxLength={32}
            />
          </div>
        </div>
        <span><Link to='/login'>{'Masz konto?'}</Link></span>
        <input type='button' value='Zarejestruj' />
      </div>
    )
  }
}
