import React, { Component } from 'react'

import './styles/about.scss'

export class About extends Component<{}, {}> {
  render () {
    return (
      <main className='about'>
        <h1>This is the About page</h1>
        <p>
          Nam erat justo, venenatis eget lobortis sit amet, posuere in purus. Integer dapibus, mi aliquam posuere luctus, mauris dolor mollis mauris, sed ullamcorper quam tortor non nisi. Donec in libero vitae ligula feugiat elementum vitae vel neque. Duis et risus eu felis dapibus posuere sed at lacus. Fusce ut nibh tortor. Phasellus volutpat tortor non libero venenatis commodo. Sed faucibus faucibus nunc, non pharetra arcu accumsan nec. Nam ac orci quis enim porta molestie quis sagittis velit. Curabitur at lectus posuere, dignissim velit non, rhoncus enim. Nam id aliquam risus. Sed sodales rutrum pulvinar. Maecenas bibendum ipsum in eros varius maximus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec rhoncus a nisi eu pharetra. Pellentesque aliquet ipsum quis felis tristique, id luctus mi auctor. In tincidunt, libero id elementum imperdiet, sem libero porttitor erat, at suscipit nunc turpis quis enim.
        </p>
      </main>
    )
  }
}
