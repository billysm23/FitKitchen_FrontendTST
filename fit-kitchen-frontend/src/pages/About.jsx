import { Code, Github, Linkedin, Mail, User } from 'lucide-react';
import React from 'react';
import '../styles/About.css';

export default function About() {
    return (
        <div className="about">
            <div className="about-container">
                <div className="about-header">
                    <h1 className="title">About FitKitchen</h1>
                    <p className="description">
                        FitKitchen is a personalized catering system designed to provide healthy,
                        customized meals based on your individual health needs and preferences.
                        We combine nutritional science with culinary excellence to deliver the
                        perfect meal plan for you.
                    </p>
                </div>

                <section className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        At FitKitchen, we believe that healthy eating should be both delicious
                        and convenient. Our mission is to make personalized nutrition accessible
                        to everyone through innovative technology and expert culinary craftsmanship.
                        We analyze your unique health profile to create meal plans that not only
                        taste great but also support your wellness goals.
                    </p>
                </section>

                <div className="profile-section">
                    <div className="about-content">
                        <div className="dev-info">
                            <h2 className="dev-title">
                                <User className="detail-icon" size={40} />
                                Developer Profile
                            </h2>
                            <div className="dev-details">
                                <div className="detail-item">
                                    <User className="detail-icon" size={30} />
                                    <span>Billy Samuel (18222039)</span>
                                </div>
                                <div className="detail-item">
                                    <Code className="detail-icon" size={30} />
                                    <span>Full Stack Developer</span>
                                </div>
                                <div className="detail-item">
                                    <Mail className="detail-icon" size={30} />
                                    <a href="mailto:bllysm23@gmail.com" className="detail-link">
                                        bllysm23@gmail.com
                                    </a>
                                </div>
                                <div className="detail-item">
                                    <Github className="detail-icon" size={30} />
                                    <a 
                                        href="https://github.com/billysm23" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="detail-link"
                                    >
                                        github.com/billysm23
                                    </a>
                                </div>
                                <div className="detail-item">
                                    <Linkedin className="detail-icon" size={30} />
                                    <a 
                                        href="https://linkedin.com/in/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="detail-link"
                                    >
                                        linkedin.com/in/
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="image-container">
                            <div className="image-wrapper">
                                <img 
                                    src="/../../../Billy.jpg"
                                    alt="Developer Profile"
                                    className="profile-image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}