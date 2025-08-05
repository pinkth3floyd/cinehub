import React from 'react'
import { Footer, Header, Section } from '../core/ui'

const AllMovies = () => {
  return (
<>
<Header />
<Section title="All Movies" variant="border">
  <div className="row">
    <div className="col-12">
      <h1>All Movies</h1>
    </div>
  </div>
</Section>
<Footer/> 
</>
  )
}

export default AllMovies