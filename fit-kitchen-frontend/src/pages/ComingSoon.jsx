import { ArrowLeft, Calendar, Github, Linkedin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ComingSoon.module.css';

const ComingSoon = () => {
    const [countdown, setCountdown] = useState({
        days: 30,
        hours: 24,
        minutes: 60,
        seconds: 60
    });
    
    const [dots, setDots] = useState('');
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length < 3 ? prev + '.' : '');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => ({
                ...prev,
                seconds: prev.seconds > 0 ? prev.seconds - 1 : 60
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Generate random floating particles
    const particles = Array.from({ length: 20 }, (_, index) => ({
        id: index,
        size: Math.random() * 10 + 5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
    }));

    return (
        <div className={styles.coming_soon_container}>
            {/* Background Particles */}
            <div className={styles.background_animation}>
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className={styles.floating_particle}
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            top: `${particle.top}%`,
                            left: `${particle.left}%`,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className={styles.content_wrapper}>
                <h1 className={styles.title}>
                    Coming Soon{dots}
                </h1>
                
                <p className={styles.subtitle}>
                    We're working on something exciting! Our new features will be ready in:
                </p>

                {/* Countdown Timer */}
                <div className={styles.countdown_grid}>
                    {Object.entries(countdown).map(([unit, value]) => (
                        <div key={unit} className={styles.countdown_item}>
                            <div className={styles.countdown_number}>{value}</div>
                            <div className={styles.countdown_label}>{unit}</div>
                        </div>
                    ))}
                </div>

                {/* Features Preview */}
                <div className={styles.features_grid}>
                    <div className={styles.feature_card}>
                        <Calendar className={styles.feature_icon} />
                        <h3 className={styles.feature_title}>Launch Date</h3>
                        <p className={styles.feature_description}>
                            Mark your calendar for our big reveal!
                        </p>
                    </div>
                    <div className={styles.feature_card}>
                        <Calendar className={styles.feature_icon} />
                        <h3 className={styles.feature_title}>New Features</h3>
                        <p className={styles.feature_description}>
                            Exciting updates coming your way!
                        </p>
                    </div>
                </div>

                {/* Social Links & Back Button */}
                <div className={styles.footer_actions}>
                    <div className={styles.social_links}>
                        <a 
                            href="https://github.com/your-github" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.social_link}
                        >
                            <Github />
                        </a>
                        <a 
                            href="https://linkedin.com/in/your-linkedin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.social_link}
                        >
                            <Linkedin />
                        </a>
                    </div>
                    
                    <Link to="/" className={styles.back_button}>
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;