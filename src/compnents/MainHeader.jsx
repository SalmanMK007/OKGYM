import { Link } from "react-router-dom"
import Image from "../image/main__header.webp"
 
const MainHeader = () => {
  return (
    <header className="main__header">
      <div className="container main__header-container">
        <div className="main__header-left">
          <h4>#100DayofWorkOut</h4>
          <h1>Join The Legends Of the Fitness World</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut quo pariatur veritatis odit voluptates beatae?
          </p>
          <Link to='/plans' className="btn lg">Get Started</Link>
        </div>
        <div className="main__header-right">
          <div className="main__header-circle"></div>
          <div className="main__header-image">
            <img src={Image} alt="Mian Header Image" />
          </div>
        </div>
      </div>
    </header>
    )
}

export default MainHeader