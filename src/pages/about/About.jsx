import Header from '../../compnents/Header'
import HeaderImage from '../../image/header_bg_1.jpg'
import StoryImage from '../../image/about1.jpg'
import VisionImage from '../../image/about2.jpg'
import MissionImage from '../../image/about3.jpg'
import './about.css'



const About = () => {
  return (
  <>
    <Header title='About Us' image={HeaderImage}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem commodi fugit doloremque pariatur obcaecati. At perspiciatis nostrum consequuntur consectetur natus.
    </Header>

    <section className="about__story">
      <div className="container about__story-container">
        <div className="about__section-image">
          <img src={StoryImage} alt="Our Story Image" />
        </div>
        <div className="about__section-content">
          <h1>Our Story</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid possimus enim voluptate fuga magnam. Labore cum soluta reiciendis odit quisquam eius, cupiditate, beatae, omnis distinctio animi repellendus. At iusto illo placeat, sit quos hic officia omnis eaque sapiente explicabo!
            </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ab illo alias quis sed ea a odio nostrum dolore laborum.alias quis sed ea a odio nostrum dolore laborum
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, repudiandae.Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, repudiandae.
            </p>
        </div>
      </div>
    </section>
    
    <section className="about__Vision">
      <div className="container about__Vision-container">
        <div className="about__section-content">
          <h1>Our Vision</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid possimus enim voluptate fuga magnam. Labore cum soluta reiciendis odit quisquam eius, cupiditate, beatae, omnis distinctio animi repellendus. At iusto illo placeat, sit quos hic officia omnis eaque sapiente explicabo!
            </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ab illo alias quis sed ea a odio nostrum dolore laborum.alias quis sed ea a odio nostrum dolore laborum.nostrum dolore laborum.
            </p>
        </div>
        <div className="about__section-image">
          <img src={VisionImage} alt="Our Vision Image" />
        </div>
      </div>
    </section>


    <section className="about__mission">
      <div className="container about__mission-container">
        <div className="about__section-image">
          <img src={MissionImage} alt="Our Mission Image" />
        </div>
        <div className="about__section-content">
          <h1>Our Mission</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid possimus enim voluptate fuga magnam. Labore cum soluta reiciendis odit quisquam eius, cupiditate, beatae, omnis distinctio animi repellendus. At iusto illo placeat, sit quos hic officia omnis eaque sapiente explicabo!
            </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium ab illo alias quis sed ea a odio nostrum dolore laborum.alias quis sed ea a odio nostrum dolore laborum
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, repudiandae.Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, repudiandae.
            </p>
        </div>
      </div>
    </section>
  </>
  )
}

export default About