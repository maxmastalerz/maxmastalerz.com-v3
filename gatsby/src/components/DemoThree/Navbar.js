import React from 'react'
import {Link} from 'gatsby'
import { useRecoilState } from 'recoil'
import {sModalState} from '../../utils/recoil-atoms'
import SidebarDemosModal from '../App/SidebarDemosModal'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import logo from '../../components/App/assets/images/logo-four.png'

const Navbar = () => {
    const [collapsed, setCollapsed] = React.useState(true)
    const [sidebarModal, setSidebarModal] = useRecoilState(sModalState)

    const toggleNavbar = () => {
        setCollapsed(!collapsed)
    }

    const toggleModal = () => {
        setSidebarModal(!sidebarModal)
    }

    React.useEffect(() => {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                elementId.classList.add("is-sticky");
            } else {
                elementId.classList.remove("is-sticky");
            }
        });
        window.scrollTo(0, 0);
    })

    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
        <React.Fragment>
            <nav id="navbar" className="navbar navbar-expand-lg pufo-aside bg-0f1d22">
                <div className="container">
                    <Link to="/demo-three" className="navbar-brand logo">
                        <img src={logo} alt="logo" />
                    </Link>

                    <button 
                        onClick={toggleNavbar}
                        className={classTwo} 
                        type="button" 
                        data-toggle="collapse" 
                        data-target="#navbarSupportedContent" 
                        aria-controls="navbarSupportedContent" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="icon-bar top-bar"></span>
                        <span className="icon-bar middle-bar"></span>
                        <span className="icon-bar bottom-bar"></span>
                    </button>

                    <div className={classOne} id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <AnchorLink 
                                    // onClick={toggleNavbar} 
                                    offset={() => 100} 
                                    className="nav-link active" 
                                    href="#home"
                                >
                                    Home
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    // onClick={toggleNavbar} 
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#about"
                                >
                                    About
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    // onClick={toggleNavbar} 
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#portfolio"
                                >
                                    Portfolio
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    // onClick={toggleNavbar} 
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#blog"
                                >
                                    Blog
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    // onClick={toggleNavbar} 
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#contact"
                                >
                                    Contact
                                </AnchorLink>
                            </li>
                        </ul>

                        <div className="aside-footer">
                            <Link to="#" className="common-btn three">
                                Download CV <i className='bx bxs-download'></i>
                            </Link>
                            <ul className="social">
                                <li><a href="#" target="_blank"><i className='bx bxl-facebook'></i></a></li>
                                <li><a href="#" target="_blank"><i className='bx bxl-twitter'></i></a></li>
                                <li><a href="#" target="_blank"><i className='bx bxl-linkedin'></i></a></li>
                                <li><a href="#" target="_blank"><i className='bx bxl-behance'></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar Demos Modal */}
            <div className="demo-side-icon">
                <button type="button" className="modal-btn" 
                    onClick={toggleModal}
                >
                    <span>Demos</span>
                </button>
            </div>

            <SidebarDemosModal />
        </React.Fragment>
    )
}

export default Navbar