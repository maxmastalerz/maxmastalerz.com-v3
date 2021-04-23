import React from 'react'

const GoTop = ({scrollStepInPx, delayInMs}) => {

    const [thePosition, setThePosition] = React.useState(false);
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        let isMounted = true;

        document.addEventListener("scroll", () => {
            if (isMounted) {
                if (window.scrollY > 170) {
                    setThePosition(true)
                } else {
                    setThePosition(false);
                }
            }
        });

        return () => { isMounted = false };
    }, [])
    
    const onScrollStep = () => {
        if (window.pageYOffset === 0){
            clearInterval(timeoutRef.current);
        }
        window.scroll(0, window.pageYOffset - scrollStepInPx);
    }

    const scrollToTop = () => {
        timeoutRef.current = setInterval(onScrollStep, delayInMs);
    }

    const renderGoTopIcon = () => {
        return (
            <div className={`go-top ${thePosition ? 'active' : ''}`} onClick={scrollToTop}>
                <i className='bx bxs-up-arrow-alt'></i>
                <i className='bx bxs-up-arrow-alt'></i>
            </div>
        )
    }

    return (
        <React.Fragment>
            {renderGoTopIcon()}
        </React.Fragment>
    )
}

export default GoTop