import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Image from 'gatsby-image'
import ModalVideo from 'react-modal-video'
import awardMain from '../App/assets/images/awards/award-main.jpg'

const query = graphql`
{
    allStrapiAward {
      nodes {
        header
        desc
        id
        youtube_id
        awards {
          id
          name
          year
          image {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

const AwardsWon = () => {
    const {allStrapiAward: { nodes }} = useStaticQuery(query)
    // Popup Video
	const [isOpen, setIsOpen] = React.useState(true);
    const openModal = () => {
        setIsOpen(!isOpen);
    }
    return (
        <React.Fragment>
            {/* If you want to change the video need to update videoID */}
            <ModalVideo 
                channel='youtube' 
                isOpen={!isOpen} 
                videoId={`${nodes[0].youtube_id}`}
                onClose={() => setIsOpen(!isOpen)} 
            />
            
            <div className="awards-area border-bottom pt-100 pb-70">
                <div className="common-right-text">
                    <span>AWARDS</span>
                </div>

                <div className="container">
                    <div className="section-title">
                        <span className="sub-title">AWARDS</span>
                        <h2 dangerouslySetInnerHTML={{__html: nodes[0].header}} />
                        <p>{nodes[0].desc}</p>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-sm-6 col-lg-6">
                            {nodes[0].awards.map((award) => {
                                return(
                                    <div className="awards-inner" key={award.id}>
                                        <ul className="align-items-center">
                                            <li>
                                                <Image fluid={award.image.childImageSharp.fluid} />
                                            </li>
                                            <li>
                                                <h3>{award.name}</h3>
                                                <span>{award.year}</span>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })}

                        </div>

                        <div className="col-sm-6 col-lg-6">
                            <div className="awards-video">
                                <img src={awardMain} alt="Award" />
                                <div className="video-wrap">
                                    <Link 
                                        to="#"
                                        onClick={e => {e.preventDefault(); openModal()}}
                                        className="popup-youtube"
                                    >
                                        <i className='bx bx-play'></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AwardsWon