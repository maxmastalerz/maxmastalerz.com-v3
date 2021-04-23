import React from 'react'
import { Link } from 'gatsby'
import { useRecoilState } from 'recoil'
import {sModalState} from '../../utils/recoil-atoms'

const SidebarDemosModal = () => {
    const [sidebarModal, setSidebarModal] = useRecoilState(sModalState)
 
    const closeModal = () => {
        setSidebarModal(!sidebarModal)
    }

    return (
        <React.Fragment>
            <div className={`demos-side-content ${sidebarModal ? 'show' : null}`}>
                <div className="modal-header">
                    <h2>View Demo</h2>
                    <button type="button" className="close" onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div className="modal-body">
                    <ul>
                        <li>
                            <div className="demo-item">
                                <Link to="/" onClick={closeModal}>
                                    <span>Demo - 1</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988722/demo1.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="demo-item">
                                <Link to="/demo-two" onClick={closeModal}>
                                    <span>Demo - 2</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988722/demo2.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="demo-item">
                                <Link to="/demo-three" onClick={closeModal}>
                                    <span>Demo - 3</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988723/demo3.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="demo-item">
                                <Link to="/demo-four" onClick={closeModal}>
                                    <span>Demo - 4</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988722/demo4.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="demo-item">
                                <Link to="/demo-five" onClick={closeModal}>
                                    <span>Demo - 5</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988723/demo5.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="demo-item">
                                <Link to="/demo-six" onClick={closeModal}>
                                    <span>Demo - 6</span>
                                    <img src="https://res.cloudinary.com/dev-empty/image/upload/v1604988724/demo6.jpg" alt="Demos" />
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SidebarDemosModal