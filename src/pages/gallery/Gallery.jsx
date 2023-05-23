import Header from '../../compnents/Header'
import HeaderImage from '../../image/header_bg_3.jpg'
import './gallery.css'


const Gallery = () => {
  const gallerylength = 15;
  const images = [];

  for (let i = 1; i <= gallerylength; i++) {
    images.push(require(`../../image/gallery${i}.jpg`));
  }

  console.log(images);
  return (
    <>
      <Header title="Our Gallery" image={HeaderImage}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit enim vel sequi illo animi. Corporis asperiores non a consequatur quidem.
      </Header>
      <section className="gallery">
        <div className="container gallery__container">
          {
            images.map((image, index) => {
              return <article key={index}>
                <img src={image} alt={`Gallery Image ${index + 1}`} />
              </article>
            })
          }
        </div>
      </section>
    </>
  )
}

export default Gallery