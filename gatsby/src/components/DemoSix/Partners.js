import React from 'react'

import logo1 from '../../components/App/assets/images/logo/logo1.png'
import logo2 from '../../components/App/assets/images/logo/logo2.png'
import logo3 from '../../components/App/assets/images/logo/logo3.png'
import logo4 from '../../components/App/assets/images/logo/logo4.png'
import logo5 from '../../components/App/assets/images/logo/logo5.png'

import Loadable from "@loadable/component"
const OwlCarousel = Loadable(() => import("react-owl-carousel3"))

const options = {
    loop: true,
    margin: 30,
    nav: false,
    dots: false,
    smartSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:2,
        },
        600:{
            items:3,
        },
        1000:{
            items:5,
        }
    }
};

const Partners = () => {
    const [display, setDisplay] = React.useState(false);

    React.useEffect(() => {
        setDisplay(true);
    }, [])
    return (
        <div className="logo-area ptb-100">
            <div className="container">
                {display ? <OwlCarousel 
                    className="logo-slider owl-carousel owl-theme"
                    {...options}
                >  
                    <div className="logo-item">
                        <img src={logo1} alt="Logo" />
                    </div>

                    <div className="logo-item">
                        <img src={logo2} alt="Logo" />
                    </div>

                    <div className="logo-item">
                        <img src={logo3} alt="Logo" />
                    </div>

                    <div className="logo-item">
                        <img src={logo4} alt="Logo" />
                    </div>

                    <div className="logo-item">
                        <img src={logo5} alt="Logo" />
                    </div>
                </OwlCarousel> : ''}
            </div>
        </div>
    )
}

export default Partners