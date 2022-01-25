import React, {useEffect} from 'react';

const InTextAd = (props) => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <ins class="adsbygoogle" style={{display: 'block', textAlign:'center'}} data-ad-layout="in-article"
        data-ad-format="fluid" data-ad-client="ca-pub-9353388001568852" data-ad-slot={props.slot}></ins>
    );
}

export default InTextAd;