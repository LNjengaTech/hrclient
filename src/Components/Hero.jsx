import React from 'react'
import bgimage from '../images/bgimage.png'
import heroImage from '../images/heroImage.png'

const Hero = () => {
  return (
    <div className=' h-[700px] flex items-center justify-center text-white' style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="font-bold p-[100px] m-3 max-w-[800px] text-3xl mb-8 ">
        <h1>We help you find the best hotel for your Stay, Faster. No long Serches again. </h1>
        <p>Leave a review for Other customers</p>
      </div>
      <img src={heroImage} alt="" className='h-[600px] min-w-[200px] '/>
    </div>
  )
}

export default Hero
