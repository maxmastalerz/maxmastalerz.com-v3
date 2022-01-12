import React from 'react'
import {Link} from 'gatsby'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import logo from '../../assets/images/logo.png';

const Navbar = () => {
    const [collapsed, setCollapsed] = React.useState(true)

    const toggleNavbar = () => {
        setCollapsed(!collapsed)
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

        menuActiveClass();
    }, []);

    const menuActiveClass = () => {
        let mainNavLinks = document.querySelectorAll(".navbar-nav li a");
        window.addEventListener("scroll", () => {
            let fromTop = window.scrollY;
            mainNavLinks.forEach(link => {
                if (link.hash){
                    let section = document.querySelector(link.hash);
            
                    if(section) {
                        if (
                            section.offsetTop <= fromTop &&
                            section.offsetTop + section.offsetHeight > fromTop
                        ) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    }
                }
            });
        });
    };

    const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
        <React.Fragment>
            <nav id="navbar" className="navbar navbar-expand-lg pufo-aside bg-0f1d22">
                <div className="container">
                    <Link to="/" className="navbar-brand logo">
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
                                    onClick={toggleNavbar}
                                    offset={() => 100} 
                                    className="nav-link active"
                                    href="#home"
                                >
                                    Home
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#about"
                                >
                                    About
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#services"
                                >
                                    Services
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#experience"
                                >
                                    Experience
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#projects"
                                >
                                    Projects
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#blog-preview"
                                >
                                    Blog
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#testimonials"
                                >
                                    Testimonials
                                </AnchorLink>
                            </li>
                            <li className="nav-item">
                                <AnchorLink 
                                    onClick={toggleNavbar}
                                    offset={() => -1} 
                                    className="nav-link" 
                                    href="#contact"
                                >
                                    Contact
                                </AnchorLink>
                            </li>
                        </ul>

                        <div className="aside-footer">
                            <a href="/api/downloads/Max%20Mastalerz%20Resume.pdf" className="common-btn three">
                                Download CV <i className='bx bxs-download'></i>
                            </a>
                            <ul className="social">
                                <li>
                                    <a href="https://www.linkedin.com/in/max-mastalerz/" target="_blank" rel="noopener noreferrer">
                                        <i className='bx bxl-linkedin'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/maxmastalerz" target="_blank" rel="noopener noreferrer">
                                        <i className='bx bxl-github'></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://stackoverflow.com/users/3960404/max" target="_blank" rel="noopener noreferrer">
                                        <i className='bx bxl-stack-overflow'></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Navbar