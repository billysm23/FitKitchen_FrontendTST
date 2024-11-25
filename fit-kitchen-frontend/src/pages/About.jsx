import { Code, Github, Linkedin, Mail, User } from 'lucide-react';
import React from 'react';
import styles from '../styles/About.module.css';

const About = () => {
    return (
        <div className={styles.about}>
            <div className={styles.about_container}>
                <div className={styles.about_header}>
                    <h1 className={styles.title}>About CT Lab</h1>
                    <p className={styles.description}>
                        CT Lab is an innovative virtual laboratory designed to enhance your
                        understanding of Computational Thinking through interactive learning
                        experiences. Our platform provides accessible, engaging, and effective
                        tools for learning computational thinking concepts, preparing students
                        for the challenges of tomorrow's digital world.
                    </p>
                </div>

                <section className={styles.mission}>
                    <h2>Our Mission</h2>
                    <p>
                        To provide accessible, engaging, and effective tools for learning
                        computational thinking concepts, preparing students for the challenges
                        of tomorrow's digital world.
                    </p>
                </section>

                <div className={styles.profile_section}>
                    <div className={styles.about_content}>
                        <div className={styles.dev_info}>
                            <h2 className={styles.dev_title}>
                                <User size={20} />
                                Developer Profile
                            </h2>
                            <div className={styles.dev_details}>
                                <div className={styles.detail_item}>
                                    <User size={18} />
                                    <span>Billy Samuel (18222039)</span>
                                </div>
                                <div className={styles.detail_item}>
                                    <Code size={18} />
                                    <span>Full Stack Developer</span>
                                </div>
                                <div className={styles.detail_item}>
                                    <Mail size={18} />
                                    <a href="mailto:your.email@example.com">billysam@gmail.com</a>
                                </div>
                                <div className={styles.detail_item}>
                                    <Github size={18} />
                                    <a href="https://github.com/billysm23" target="_blank" rel="noopener noreferrer">
                                        github.com/billysm23
                                    </a>
                                </div>
                                <div className={styles.detail_item}>
                                    <Linkedin size={18} />
                                    <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">
                                        linkedin.com/in/billysamuel
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className={styles.image_container}>
                            <div className={styles.image_wrapper}>
                                <img 
                                    src="/images/Billy.jpg"
                                    alt="Developer Profile"
                                    className={styles.profile_image}
                                />
                                <img
                                    src="/images/bayibiksu.jpeg"
                                    alt="Baby Profile"
                                    className={styles.baby_image}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;