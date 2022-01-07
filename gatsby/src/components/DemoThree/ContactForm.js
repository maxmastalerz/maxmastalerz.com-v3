import React, { useState } from 'react'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import { useForm } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import useScript from "react-script-hook";
const MySwal = withReactContent(Swal)

const alertSuccessful = () => {
    MySwal.fire({
        title: 'Thanks!',
        text: "Your message has been sent and I'll get back to you soon.",
        icon: 'success',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
    })
}

const alertFailure = () => {
    MySwal.fire({
        title: 'Sorry!',
        text: "Your message couldn't be delivered.",
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
    })
}

const alertHCaptchaLoadingError = () => {
    MySwal.fire({
        title: 'Error',
        text: "We couldn't load our captcha service. Refresh the page to try again.",
        icon: 'error',
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}

const alertHCaptchaStillLoading = () => {
    MySwal.fire({
        title: 'Sorry!',
        text: "We are still loading our captcha service to check if you're able to send your message. You can try submitting the form again.",
        icon: 'error',
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: false,
    });
}

// Form initial state
const INITIAL_STATE = {
    name: "",
    email: "",
    number: "",
    subject: "",
    text: ""
};

const ContactForm = () => {
    const [contact, setContact] = useState(INITIAL_STATE);
    const [contactFormFieldChanged, setContactFormFieldChanged] = useState(false);
    const [loadedHCaptcha, setLoadedHCaptcha] = useState(false);

    const { register, handleSubmit, errors } = useForm({reValidateMode: 'onBlur'});

    const [, hCaptchaLoadingError] = useScript({
        src: contactFormFieldChanged===true ? 'https://js.hcaptcha.com/1/api.js' : null,
        onload: () => {
            setLoadedHCaptcha(true);
            window.hcaptcha.render('captcha');
        }
    });

    //This onSubmit is only hit if the useForm checks passed.
    const onSubmit = () => {
        if(hCaptchaLoadingError) {
            alertHCaptchaLoadingError();
        } else if(loadedHCaptcha === false) {
            alertHCaptchaStillLoading();
        } else {
            window.hcaptcha.execute({ async: true })
            .then(({ response }) => {
                sendContactFormForProcessing(response);
                window.hcaptcha.reset();
            })
            .catch(err => {
                console.error(err);
            });
        }
    };

    const sendContactFormForProcessing = async (hCaptchaValue) => {
        const { name, email, number, subject, text } = contact;

        const url = `${baseUrl}/api/contact`;
        const payload = { name, email, number, subject, text, hCaptchaValue };

        try {
            let axiosRes = await axios.post(url, payload);
            let res = axiosRes.data || {};

            if(res.data) {
                setContact(INITIAL_STATE);
                alertSuccessful();
            } else if(res.error) {
                alertFailure();
            }
        } catch (error) {
            alertFailure();
        }
    }

    const contactFormFieldChange = e => {
        setContactFormFieldChanged(true);
        const { name, value } = e.target;
        setContact(prevState => ({ ...prevState, [name]: value }));
    }

    return (
        <div id="contact" className="contact-area three border-bottom-two pt-100 pb-100">
            <div className="container">
                <div className="section-title three">
                    <span className="sub-title">CONTACT ME</span>
                    <h2>Let's Get in Touch</h2>
                    <p>Just send me an email or a text message and I'll get back to you as soon as I can.</p>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-7 col-lg-6">
                        <form id="contactForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <input 
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Name"
                                    value={contact.name}
                                    onChange={contactFormFieldChange}
                                    ref={register({ required: true })}
                                />
                                <div className='invalid-feedback' style={{display: 'block'}}>
                                    {errors.name && 'Name is required.'}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <input 
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={contact.email}
                                    onChange={contactFormFieldChange}
                                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                                />
                                <div className='invalid-feedback' style={{display: 'block'}}>
                                    {errors.email && 'Email is required.'}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <input 
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    placeholder="Subject"
                                    value={contact.subject}
                                    onChange={contactFormFieldChange}
                                    ref={register({ required: true })}
                                />
                                <div className='invalid-feedback' style={{display: 'block'}}>
                                    {errors.subject && 'Subject is required.'}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <input 
                                    type="text"
                                    name="number"
                                    className="form-control"
                                    placeholder="Phone (Optional)"
                                    value={contact.number}
                                    onChange={contactFormFieldChange}
                                    ref={register({ required: false })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <textarea 
                                    name="text"
                                    className="form-control"
                                    cols="30" 
                                    rows="6" 
                                    placeholder="Your Message"
                                    value={contact.text}
                                    onChange={contactFormFieldChange}
                                    ref={register({ required: true })}
                                />
                                <div className='invalid-feedback' style={{display: 'block'}}>
                                    {errors.text && 'Text body is required.'}
                                </div>
                            </div>
                            <div
                                id="captcha"
                                data-size="invisible"
                                data-sitekey={process.env.GATSBY_HCAPTCHA_SITE_KEY}
                            >    
                            </div>
                            <button type="submit" className="btn common-btn three">
                                Send Message <span></span>
                            </button>
                        </form>
                    </div>

                    <div className="col-md-5 col-lg-6">
                        <div className="contact-content">
                            <div className="top">
                                <ul>
                                    <li>
                                        <span>Phone:</span>
                                        <a href="tel:+1 905 299 7222">+1 905 299 7222</a>
                                    </li>
                                    <li>
                                        <span>Email:</span>
                                        <a href="mailto:contact@maxmastalerz.com">contact@maxmastalerz.com</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="bottom">
                                <ul>
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
                </div>
            </div>
        </div>
    )
}

export default ContactForm