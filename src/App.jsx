import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { 
  FaLinkedinIn, 
  FaGithub, 
  FaTwitter, 
  FaInstagram,
  FaDownload,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaMobileAlt,
  FaPhoneAlt,
  FaExternalLinkAlt,
  FaCode,
  FaCertificate,
  FaBriefcase,
  FaHeart,
  FaEye,
  FaUsers,
  FaUserPlus,
  FaRegHeart,
  FaTrophy,
  FaCheckCircle,
  FaStar,
  FaFire,
  FaFolderOpen,
  FaAward,
  FaPaperPlane,
  FaGraduationCap,
  FaRocket,
  FaCodeBranch,
  FaLaptopCode,
  FaUniversity,
  FaBook
} from 'react-icons/fa';
import { 
  SiReact, 
  SiJavascript, 
  SiPython, 
  SiHtml5, 
  SiCss3, 
  SiGit,
  SiTailwindcss,
  SiMysql,
  SiLeetcode,
  SiFramer,
  SiTypescript,
  SiNextdotjs,
  SiRedux,
  SiNodedotjs,
  SiMongodb,
  SiFirebase,
  SiPandas,
  SiNumpy
} from 'react-icons/si';
import { FaJava, FaUserGraduate } from 'react-icons/fa6';
import myImg from './assets/my_img.png';
import hbProject from './assets/projects_img/HB.png';
import chemProject from './assets/projects_img/chem.png';
import parivartanProject from './assets/projects_img/parivartan.png';
// Certificate images
import hackathon0Img from './assets/certificates/hackathon0.png';
import hackathon1Img from './assets/certificates/Hackathon1.jpg';
import hackathon2Img from './assets/certificates/hackathon2.jpg';
import hackathon3Img from './assets/certificates/hackathon3.jpg';
import gssocImg from './assets/certificates/gssoc.jpg';
import arLearnImg from './assets/certificates/AR-learn.png';
import googleLearnImg from './assets/certificates/google-learn.png';
import linuxLearnImg from './assets/certificates/linux-learn.png';
import python1LearnImg from './assets/certificates/python1-learn.png';
import python2LearnImg from './assets/certificates/python2-learn.png';
import webdevLearnImg from './assets/certificates/webdev-learn.png';
import sqlLearnImg from './assets/certificates/sql-learn.png';
import GooeyNav from './components/GooeyNav';
import BackToTop from './components/BackToTop';
import { getProjectLikes, incrementProjectLike, decrementProjectLike } from './firebase';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('github'); // 'github' or 'leetcode'
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [aboutTab, setAboutTab] = useState('education'); // 'hackathon', 'education'
  const [projectLikes, setProjectLikes] = useState({});
  const [likesLoading, setLikesLoading] = useState(true);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // Project IDs for Firebase
  const projectIds = ['hb-project', 'chemlab-manager', 'parivartan'];

  // Fetch likes from Firebase on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesData = {};
        for (let i = 0; i < projectIds.length; i++) {
          const count = await getProjectLikes(projectIds[i]);
          // Check localStorage for user's liked status
          const hasLiked = localStorage.getItem(`liked_${projectIds[i]}`) === 'true';
          likesData[i] = { liked: hasLiked, count };
        }
        setProjectLikes(likesData);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLikesLoading(false);
      }
    };
    fetchLikes();
  }, []);

  // Handle contact form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowMessagePopup(true);
    e.target.reset();
    // Auto hide popup after 3 seconds
    setTimeout(() => {
      setShowMessagePopup(false);
    }, 3000);
  };

  // Handle project like toggle with Firebase
  const handleProjectLike = async (index) => {
    const projectId = projectIds[index];
    const currentLikes = projectLikes[index];
    const isLiked = currentLikes?.liked;

    // Optimistic update
    setProjectLikes(prev => ({
      ...prev,
      [index]: {
        liked: !isLiked,
        count: isLiked ? (prev[index]?.count || 1) - 1 : (prev[index]?.count || 0) + 1
      }
    }));

    try {
      let newCount;
      if (isLiked) {
        // Unlike
        newCount = await decrementProjectLike(projectId);
        localStorage.removeItem(`liked_${projectId}`);
      } else {
        // Like
        newCount = await incrementProjectLike(projectId);
        localStorage.setItem(`liked_${projectId}`, 'true');
      }

      // Update with actual count from Firebase
      if (newCount !== null) {
        setProjectLikes(prev => ({
          ...prev,
          [index]: {
            liked: !isLiked,
            count: newCount
          }
        }));
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setProjectLikes(prev => ({
        ...prev,
        [index]: currentLikes
      }));
    }
  };

  // GitHub stats state
  const [githubStats, setGithubStats] = useState({
    followers: 0,
    following: 0,
    public_repos: 0,
    totalStars: 0
  });

  // GitHub contributions state
  const [contributions, setContributions] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);

  // LeetCode stats state
  const [leetcodeStats, setLeetcodeStats] = useState({
    totalSolved: 0,
    totalQuestions: 3763,
    easySolved: 0,
    easyTotal: 915,
    mediumSolved: 0,
    mediumTotal: 1960,
    hardSolved: 0,
    hardTotal: 888,
    ranking: 0,
    contributionPoints: 0,
    reputation: 0,
    totalActiveDays: 0,
    maxStreak: 0,
    badges: 0
  });
  const [leetcodeCalendar, setLeetcodeCalendar] = useState({});
  const [selectedYear, setSelectedYear] = useState('Current');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'projects', 'skills', 'certifications', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch GitHub stats including stars (love count)
  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('https://api.github.com/users/Aditya00038');
        const userData = await userResponse.json();
        
        // Fetch repos to calculate total stars
        const reposResponse = await fetch('https://api.github.com/users/Aditya00038/repos?per_page=100');
        const reposData = await reposResponse.json();
        const totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        
        setGithubStats({
          followers: userData.followers || 0,
          following: userData.following || 0,
          public_repos: userData.public_repos || 0,
          totalStars: totalStars
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      }
    };
    fetchGithubStats();
  }, []);

  // Fetch GitHub contributions
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('https://github-contributions-api.jogruber.de/v4/Aditya00038?y=last');
        const data = await response.json();
        if (data.contributions) {
          setContributions(data.contributions);
          setTotalContributions(data.total?.lastYear || 0);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };
    fetchContributions();
  }, []);

  // Fetch LeetCode stats
  const LEETCODE_USERNAME = 'Aditya_Suryawanshi';
  
  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        // Fetch basic stats - this also contains submissionCalendar
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setLeetcodeStats({
            totalSolved: data.totalSolved || 0,
            totalQuestions: data.totalQuestions || 3763,
            easySolved: data.easySolved || 0,
            easyTotal: data.totalEasy || 915,
            mediumSolved: data.mediumSolved || 0,
            mediumTotal: data.totalMedium || 1960,
            hardSolved: data.hardSolved || 0,
            hardTotal: data.totalHard || 888,
            ranking: data.ranking || 0,
            contributionPoints: data.contributionPoints || 0,
            reputation: data.reputation || 0,
            totalActiveDays: Object.keys(data.submissionCalendar || {}).length,
            maxStreak: 1,
            badges: 0
          });
          
          // Set submission calendar from the stats API
          if (data.submissionCalendar) {
            let calendar = data.submissionCalendar;
            if (typeof calendar === 'string') {
              calendar = JSON.parse(calendar);
            }
            console.log('LeetCode Calendar:', calendar);
            setLeetcodeCalendar(calendar);
          }
        }
      } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
      }
    };
    fetchLeetCodeStats();
  }, []);

  // Get LeetCode contribution data for the calendar
  const getLeetcodeWeeksData = () => {
    const weeks = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    let currentWeek = [];
    let currentDate = new Date(oneYearAgo);
    
    // Adjust to start from Sunday
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (currentDate <= today) {
      let count = 0;
      
      // Get the date string for comparison (YYYY-MM-DD)
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check all calendar entries
      Object.keys(leetcodeCalendar).forEach(key => {
        const keyNum = parseInt(key);
        // Convert timestamp to date and compare
        const keyDate = new Date(keyNum * 1000);
        const keyDateStr = keyDate.toISOString().split('T')[0];
        
        if (keyDateStr === dateStr) {
          count += leetcodeCalendar[key];
        }
      });
      
      currentWeek.push({
        date: dateStr,
        count: count
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  // Get contribution level (0-4) based on count
  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  // Get months for contribution graph
  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      result.push(months[date.getMonth()]);
    }
    return result;
  };

  // Group contributions by week
  const getWeeksData = () => {
    if (!contributions.length) return [];
    
    const weeks = [];
    let currentWeek = [];
    
    contributions.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const skills = [
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Framer Motion', icon: SiFramer, color: '#0055FF' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'Java', icon: FaJava, color: '#ED8B00' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
    { name: 'Pandas', imgUrl: 'https://pandas.pydata.org/static/img/favicon_white.ico' },
    { name: 'NumPy', imgUrl: 'https://www.pythontutorial.net/wp-content/uploads/2022/08/numpy-tutorial.svg' },
  ];

  const projects = [
    {
      title: 'HB Project',
      description: 'A feature-rich application built with modern technologies and best practices. Features responsive design and seamless user experience...',
      techIcons: [
        { icon: SiReact, color: '#61DAFB' },
        { icon: SiTailwindcss, color: '#06B6D4' },
        { icon: SiFramer, color: '#0055FF' },
        { imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Firebase_icon.svg/2048px-Firebase_icon.svg.png' }
      ],
      image: hbProject,
      liveLink: 'https://hb-marketing-proto-kvmh9vhir-adityas-projects-9c9aa8cb.vercel.app/',
      githubLink: 'https://github.com/Aditya00038'
    },
    {
      title: 'ChemLab Manager',
      description: 'A comprehensive chemical and chemistry equipment management system. Features inventory tracking, equipment scheduling, safety data sheets, and lab resource optimization for educational and research institutions.',
      techIcons: [
        { icon: SiReact, color: '#61DAFB' },
        { icon: SiTailwindcss, color: '#06B6D4' },
        { imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Firebase_icon.svg/2048px-Firebase_icon.svg.png' }
      ],
      image: chemProject,
      liveLink: 'https://chem-stock.vercel.app/cart',
      githubLink: 'https://github.com/Aditya00038'
    },
    {
      title: 'Parivartan - Swachh',
      description: 'An intelligent waste management web application powered by AI. Features smart waste categorization using Gemini AI, real-time tracking, recycling insights, and gamification to promote sustainable waste management practices.',
      techIcons: [
        { icon: SiReact, color: '#61DAFB' },
        { icon: SiTailwindcss, color: '#06B6D4' },
        { imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Firebase_icon.svg/2048px-Firebase_icon.svg.png' },
        { icon: SiFramer, color: '#0055FF' }
      ],
      image: parivartanProject,
      liveLink: 'https://parivatran-swachh.vercel.app/auth',
      githubLink: 'https://github.com/Aditya00038'
    }
  ];

  const certifications = [
    // Top 4 certificates
    { 
      name: 'Complete JavaScript Programming', 
      issuer: 'Udemy', 
      date: '2024', 
      image: webdevLearnImg
    },
    { 
      name: 'Google Certificate', 
      issuer: 'Google', 
      date: '2024', 
      image: googleLearnImg
    },
    { 
      name: 'Python Certificate', 
      issuer: 'HackerRank', 
      date: '2024', 
      image: python1LearnImg
    },
    { 
      name: 'SQL Certificate', 
      issuer: 'Course Certificate', 
      date: '2024', 
      image: sqlLearnImg
    },
    // Other certificates
    { 
      name: 'Job Ready Cohort', 
      issuer: 'Sheryians Coding School', 
      date: '2025', 
      image: hackathon0Img
    },
    { 
      name: 'JavaScript Intermediate', 
      issuer: 'HackerRank', 
      date: '2025', 
      image: hackathon1Img
    },
    { 
      name: 'Frontend Developer (React)', 
      issuer: 'HackerRank', 
      date: '2024', 
      image: arLearnImg
    },
    { 
      name: 'Linux Certificate', 
      issuer: 'Linux Foundation', 
      date: '2024', 
      image: linuxLearnImg
    },
    { 
      name: 'Python Advanced', 
      issuer: 'Course Certificate', 
      date: '2024', 
      image: python2LearnImg
    },
    { 
      name: 'GSSoC 2024 Contributor', 
      issuer: 'GirlScript Summer of Code', 
      date: '2024', 
      image: gssocImg
    },
    { 
      name: 'Hackathon Certificate', 
      issuer: 'Hackathon', 
      date: '2024', 
      image: hackathon2Img
    },
    { 
      name: 'Hackathon Certificate', 
      issuer: 'Hackathon', 
      date: '2024', 
      image: hackathon3Img
    }
  ];

  const displayedCertifications = showAllCerts ? certifications : certifications.slice(0, 4);

  return (
    <div className="portfolio">
      {/* Message Sent Toast Notification */}
      <AnimatePresence>
        {showMessagePopup && (
          <motion.div 
            className="toast-notification"
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="toast-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="toast-content">
              <h4>Message Sent!</h4>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
            <button className="toast-close" onClick={() => setShowMessagePopup(false)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            As
          </motion.div>
          <GooeyNav
            items={[
              { label: 'Home', href: '#home' },
              { label: 'Projects', href: '#projects' },
              { label: 'Skills', href: '#skills' },
              { label: 'Certifications', href: '#certifications' },
              { label: 'Contact', href: '#contact' }
            ]}
            initialActiveIndex={['home', 'projects', 'skills', 'certifications', 'contact'].indexOf(activeSection)}
            onItemClick={(item) => scrollToSection(item.label.toLowerCase())}
            animationTime={600}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-image"
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            <motion.div 
              className="image-container"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={myImg} 
                alt="Aditya Suryawanshi"
              />
            </motion.div>
            <div className="hero-location">
              <FaMapMarkerAlt /> Pune, Maharashtra, India
            </div>
            <div className="social-follow-btns">
              <a href="https://www.linkedin.com/in/aditya-suryawanshi-20b60930a/" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                <svg className="svgIcon" viewBox="0 0 448 512" height="1.5em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
                <span className="text">LinkedIn</span>
              </a>
              <a href="https://github.com/Aditya00038" target="_blank" rel="noopener noreferrer" className="social-btn github">
                <svg className="svgIcon" viewBox="0 0 496 512" height="1.5em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
                <span className="text">GitHub</span>
              </a>
              <a href="https://www.instagram.com/_aditya_038/" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                <svg className="svgIcon" viewBox="0 0 448 512" height="1.5em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
                <span className="text">Instagram</span>
              </a>
            </div>
          </motion.div>
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="hero-name" variants={fadeInUp}>
              Aditya Suryawanshi
            </motion.h1>
            <motion.div className="hero-title" variants={fadeInUp}>
              <TypeAnimation
                sequence={[
                  'Data Science Learner',
                  2000,
                  'Modern Web Developer',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="typed-text"
                repeat={Infinity}
              />
            </motion.div>
            <motion.p className="hero-description" variants={fadeInUp}>
              Driven by curiosity, I explore how data fuels intelligent systems and how AI can automate complex real-life tasks. I enjoy turning raw data into insights and writing code that becomes useful products. With interests spanning machine learning, analytics, and modern web development, I'm constantly expanding my skill set to build meaningful, scalable, and intelligent applications.
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeInUp}>
              <a href="/Aditya Resume.pdf" download="Aditya Resume.pdf" className="resume-btn">
                <span className="resume-btn__text">Resume</span>
                <span className="resume-btn__icon">
                  <svg className="resume-svg" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z" />
                    <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z" />
                    <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z" />
                  </svg>
                </span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="section-title-row">
              <span className="section-icon"><FaUserGraduate /></span>
              <h2>Journey</h2>
            </div>
            <div className="section-divider"></div>
          </motion.div>

          <motion.div 
            className="about-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="about-tabs">
              <button 
                className={`about-tab ${aboutTab === 'education' ? 'active' : ''}`}
                onClick={() => setAboutTab('education')}
              >
                <FaUniversity /> Education
              </button>
            </div>
          </motion.div>

          {/* Education Content */}
          {aboutTab === 'education' && (
            <motion.div 
              className="about-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="education-grid">
                <motion.div 
                  className="education-card current-edu"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <div className="edu-card-header">
                    <div className="edu-status-badge">
                      <span className="pulse-dot"></span>
                      Currently Studying
                    </div>
                    <div className="edu-year">2024 - 2028</div>
                  </div>
                  <div className="edu-card-body">
                    <div className="edu-logo-wrapper">
                      <img src="https://play-lh.googleusercontent.com/TsNBFHfNVRjYO6ssNxZpsA_sbwUQYkGKhGsKYsCe4B8Tz5E0wlw-IfW7iUe0IOWSjmI=w600-h300-pc0xffffff-pd" alt="MIT AOE" className="edu-logo" />
                    </div>
                    <div className="edu-info">
                      <h4>MIT Academy of Engineering</h4>
                      <p className="edu-degree-title">B.Tech in Computer Science & Engineering</p>
                      <p className="edu-description">Second Year (SY) student actively participating in hackathons and building innovative projects.</p>
                    </div>
                  </div>
                  <div className="edu-card-footer">
                    <span className="edu-location"><FaMapMarkerAlt /> Pune, Maharashtra</span>
                  </div>
                  <div className="edu-card-glow"></div>
                </motion.div>

                <motion.div 
                  className="education-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <div className="edu-card-header">
                    <div className="edu-badge hsc">📚 HSC</div>
                    <div className="edu-year">2022 - 2024</div>
                  </div>
                  <div className="edu-card-body">
                    <div className="edu-logo-wrapper">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXExPajyuetpEPCMPP6bCpQhVFeEd7UElrbg&s" alt="Nowrosjee Wadia College" className="edu-logo" />
                    </div>
                    <div className="edu-info">
                      <h4>Nowrosjee Wadia College</h4>
                      <p className="edu-degree-title">Higher Secondary Certificate (11th-12th)</p>
                      <p className="edu-description">Science stream with focus on Physics, Chemistry, and Mathematics.</p>
                    </div>
                  </div>
                  <div className="edu-card-footer">
                    <span className="edu-location"><FaMapMarkerAlt /> Pune, Maharashtra</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="education-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <div className="edu-card-header">
                    <div className="edu-badge ssc">🏅 SSC</div>
                    <div className="edu-year">2017 - 2022</div>
                  </div>
                  <div className="edu-card-body">
                    <div className="edu-logo-wrapper">
                      <img src="https://www.schoolsuniverse.com/_next/image?url=https%3A%2F%2Fcdn.schoolsuniverse.com%2Fmedia%2Fuploads%2F2025-03-02-08-50-18-910400-download%2520-%25202025-03-02T141845.459.jfif&w=256&q=80" alt="New English School Ramanbaug" className="edu-logo" />
                    </div>
                    <div className="edu-info">
                      <h4>New English School, Ramanbaug</h4>
                      <p className="edu-degree-title">Secondary School Certificate (5th-10th)</p>
                      <p className="edu-description"><strong>Kabaddi Player</strong> - Qualified for ZP level & selected for Mumbai Training Camp!</p>
                    </div>
                  </div>
                  <div className="edu-card-footer">
                    <span className="edu-location"><FaMapMarkerAlt /> Pune, Maharashtra</span>
                    <span className="edu-tag sports">🏆 Sports Achievement</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="section-title-row">
              <span className="section-icon"><FaFolderOpen /></span>
              <h2>Featured Projects</h2>
            </div>
            <div className="section-divider"></div>
          </motion.div>
          <motion.div 
            className="projects-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                className="project-card"
                variants={scaleIn}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 30px 60px rgba(0,0,0,0.3)" 
                }}
              >
                <div className="project-image-container">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="project-image" />
                  ) : (
                    <div className="project-placeholder">
                      <FaCode />
                      <span>Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <div className="tech-icons">
                      {project.techIcons.map((tech, i) => (
                        <span key={i} className="tech-icon" style={{ color: tech.color }}>
                          {tech.icon ? <tech.icon /> : <img src={tech.imgUrl} alt="tech" className="tech-img" />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-links">
                    <motion.a 
                      href={project.liveLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link live-demo"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </motion.a>
                    <motion.a 
                      href={project.githubLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link github-link"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub /> GitHub
                    </motion.a>
                    <button 
                      className={`project-like-btn ${projectLikes[index]?.liked ? 'liked' : ''}`} 
                      aria-label="like" 
                      type="button"
                      onClick={() => handleProjectLike(index)}
                    >
                      <span className="like-icon-wrap">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={20} height={20} strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                          <path d="m8.05,11.99c0-.84.28-1.07,1.2-1.25,1.6-.31,2.35-.74,3.14-1.54,1.19-1.21,1.58-1.97,2.18-3.24.66-1.69,1.55-2.82,3.04-2.76.9.03,2.33.8,1.67,2.72-.31.9-1.98,3.61-2.23,4.23-.18.46.4.8.8.8h2.5c1.2,0,2.2,1,2.2,2.2l-1.1,5.6c-.3,1.5-1.02,2.23-2.2,2.2h-7.6c-2,0-3.6-1.6-3.6-3.6v-5.35Z" className="thumb-path" />
                          <path d="m5.4,19.9c0,.6-.5,1.1-1.1,1.1h-1c-1,0-1.9-.9-1.9-1.9v-6.3c0-1,.9-1.9,1.9-1.9h.9c.7,0,1.2.6,1.2,1.2v7.7Z" className="sleeve-path" />
                        </svg>
                      </span>
                      <span className="like-count-display">
                        {projectLikes[index]?.count || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="section-title-row">
              <span className="section-icon"><FaCode /></span>
              <h2>Skills</h2>
            </div>
            <div className="section-divider"></div>
          </motion.div>
          <motion.div 
            className="skills-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={index}
                className="skill-card"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: `0 10px 30px ${skill.color || '#ffffff'}30`
                }}
              >
                <motion.div 
                  className="skill-icon"
                  style={{ color: skill.color }}
                >
                  {skill.icon ? <skill.icon /> : <img src={skill.imgUrl} alt={skill.name} />}
                </motion.div>
                <span className="skill-name">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coding Profiles Section */}
      <section id="github" className="github-section">
        <div className="section-container">
          <motion.div 
            className="github-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="platform-tabs">
              <button 
                className={`platform-tab ${activeTab === 'github' ? 'active' : ''}`}
                onClick={() => setActiveTab('github')}
              >
                <FaGithub /> GitHub
              </button>
              <button 
                className={`platform-tab ${activeTab === 'leetcode' ? 'active' : ''}`}
                onClick={() => setActiveTab('leetcode')}
              >
                <SiLeetcode /> LeetCode
              </button>
            </div>
          </motion.div>
          
          {/* GitHub Content */}
          {activeTab === 'github' && (
            <>
              <motion.div 
                className="github-graph-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <div className="github-graph">
                  <div className="contribution-months">
                    {getMonthLabels().map((month, i) => (
                      <span key={i}>{month}</span>
                    ))}
                  </div>
                  <div className="contribution-chart">
                    <div className="contribution-wrapper">
                      <div className="day-labels">
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                      </div>
                      <div className="contribution-grid">
                        {getWeeksData().map((week, weekIndex) => (
                          <div key={weekIndex} className="contribution-week">
                            {week.map((day, dayIndex) => (
                              <div 
                                key={dayIndex} 
                                className={`contribution-day level-${getContributionLevel(day.count)}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="graph-footer">
                    <span className="contributions-text">{totalContributions} contributions in the last year</span>
                    <div className="graph-legend">
                      <span>Less</span>
                      <div className="legend-squares">
                        <div className="legend-day level-0"></div>
                        <div className="legend-day level-1"></div>
                        <div className="legend-day level-2"></div>
                        <div className="legend-day level-3"></div>
                        <div className="legend-day level-4"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* LeetCode Content */}
          {activeTab === 'leetcode' && (
            <>
              <motion.div 
                className="leetcode-stats-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <div className="leetcode-main-stats">
                  <div className="leetcode-progress-ring">
                    <svg viewBox="0 0 120 120">
                      <circle className="progress-bg" cx="60" cy="60" r="50" />
                      <circle 
                        className="progress-fill" 
                        cx="60" cy="60" r="50"
                        style={{
                          strokeDasharray: `${(leetcodeStats.totalSolved / leetcodeStats.totalQuestions) * 314} 314`
                        }}
                      />
                    </svg>
                    <div className="progress-text">
                      <span className="solved-count">{leetcodeStats.totalSolved}</span>
                      <span className="total-count">/{leetcodeStats.totalQuestions}</span>
                      <span className="solved-label">✓ Solved</span>
                    </div>
                    <span className="attempting-label">0 Attempting</span>
                  </div>
                  
                  <div className="difficulty-stats">
                    <div className="difficulty-item easy">
                      <span className="diff-label">Easy</span>
                      <span className="diff-value">{leetcodeStats.easySolved}/{leetcodeStats.easyTotal}</span>
                    </div>
                    <div className="difficulty-item medium">
                      <span className="diff-label">Med.</span>
                      <span className="diff-value">{leetcodeStats.mediumSolved}/{leetcodeStats.mediumTotal}</span>
                    </div>
                    <div className="difficulty-item hard">
                      <span className="diff-label">Hard</span>
                      <span className="diff-value">{leetcodeStats.hardSolved}/{leetcodeStats.hardTotal}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="github-graph-container leetcode-calendar"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <div className="github-graph">
                  <div className="contribution-months">
                    {getMonthLabels().map((month, i) => (
                      <span key={i}>{month}</span>
                    ))}
                  </div>
                  <div className="contribution-chart">
                    <div className="contribution-wrapper">
                      <div className="day-labels">
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                      </div>
                      <div className="contribution-grid">
                        {getLeetcodeWeeksData().map((week, weekIndex) => (
                          <div key={weekIndex} className="contribution-week">
                            {week.map((day, dayIndex) => (
                              <div 
                                key={dayIndex} 
                                className={`contribution-day leetcode-day level-${getContributionLevel(day.count)}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="leetcode-calendar-header">
                    <span className="submissions-text">
                      <span className="submissions-count">{Object.values(leetcodeCalendar).reduce((a, b) => a + b, 0)}</span> submissions in the past one year
                    </span>
                    <div className="calendar-stats">
                      <span>Total active days: <strong>{leetcodeStats.totalActiveDays}</strong></span>
                      <span>Max streak: <strong>{leetcodeStats.maxStreak}</strong></span>
                      <select 
                        className="year-selector"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <option value="Current">Current</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>
                  </div>
                  <div className="graph-footer">
                    <div className="graph-legend">
                      <span>Less</span>
                      <div className="legend-squares">
                        <div className="legend-day leetcode-legend level-0"></div>
                        <div className="legend-day leetcode-legend level-1"></div>
                        <div className="legend-day leetcode-legend level-2"></div>
                        <div className="legend-day leetcode-legend level-3"></div>
                        <div className="legend-day leetcode-legend level-4"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="certifications-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="section-title-row">
              <span className="section-icon"><FaAward /></span>
              <h2>Certifications</h2>
            </div>
            <div className="section-divider"></div>
          </motion.div>

          <motion.div 
            className="certifications-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <AnimatePresence>
              {displayedCertifications.map((cert, index) => (
                <motion.div 
                  key={cert.name + index}
                  className="certification-card"
                  variants={fadeInUp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
                  }}
                >
                  <div className="cert-image-container">
                    <img src={cert.image} alt={cert.name} className="cert-image" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {certifications.length > 4 && (
            <motion.div 
              className="view-more-container"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span
                className="view-more-text"
                onClick={() => setShowAllCerts(!showAllCerts)}
              >
                {showAllCerts ? 'Show Less' : 'View More →'}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="section-title-row">
              <span className="section-icon"><FaPaperPlane /></span>
              <h2>Get In Touch</h2>
            </div>
            <div className="section-divider"></div>
          </motion.div>
          <div className="contact-container">
            <motion.div 
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
            >
              <h3>Let's talk about your project</h3>
              <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
              <div className="contact-details">
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 10 }}
                >
                  <FaEnvelope />
                  <span>adityasuryawanshi038@gmail.com</span>
                </motion.div>
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 10 }}
                >
                  <FaPhone className="phone-icon" />
                  <span>+91 8010340843</span>
                </motion.div>
                <motion.div 
                  className="contact-item"
                  whileHover={{ x: 10 }}
                >
                  <FaMapMarkerAlt />
                  <span>Pune, Maharashtra, India</span>
                </motion.div>
              </div>
              
              {/* Social Links */}
              <div className="contact-social-links">
                <a href="https://www.linkedin.com/in/aditya-suryawanshi-20b60930a/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn />
                </a>
                <a href="https://github.com/Aditya00038" target="_blank" rel="noopener noreferrer">
                  <FaGithub />
                </a>
                <a href="https://www.instagram.com/_aditya_038/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
              </div>
            </motion.div>
            <motion.form 
              className="contact-form"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              onSubmit={handleFormSubmit}
            >
              <div className="form-group">
                <motion.input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  whileFocus={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}
                />
              </div>
              <div className="form-group">
                <motion.input 
                  type="email" 
                  placeholder="Your Email" 
                  required
                  whileFocus={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}
                />
              </div>
              <div className="form-group">
                <motion.input 
                  type="text" 
                  placeholder="Subject"
                  whileFocus={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}
                />
              </div>
              <div className="form-group">
                <motion.textarea 
                  placeholder="Your Message" 
                  rows="5" 
                  required
                  whileFocus={{ scale: 1.02, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" }}
                ></motion.textarea>
              </div>
              <motion.button 
                type="submit" 
                className="btn btn-primary"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <motion.div 
            className="footer-top"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-section">
              <h3 className="footer-brand">Aditya Suryawanshi</h3>
              <p className="footer-tagline">Building innovative solutions driven by passion and creativity</p>
              <div className="footer-social">
                <motion.a 
                  href="https://www.linkedin.com/in/aditya-suryawanshi-20b60930a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedinIn />
                </motion.a>
                <motion.a 
                  href="https://github.com/Aditya00038" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/_aditya_038/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a 
                  href="mailto:adityasuryawanshi038@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEnvelope />
                </motion.a>
              </div>
            </div>

            <div className="footer-section footer-links-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
              </ul>
            </div>

            <div className="footer-section footer-services-section">
              <h4>What I Do</h4>
              <ul className="footer-links">
                <li><a href="#projects">Web Development</a></li>
                <li><a href="#projects">UI/UX Design</a></li>
              </ul>
            </div>

            <div className="footer-section footer-contact-section">
              <h4>Get In Touch</h4>
              <ul className="footer-contact">
                <li>
                  <FaEnvelope />
                  <a href="mailto:adityasuryawanshi038@gmail.com">adityasuryawanshi038@gmail.com</a>
                </li>
                <li>
                  <FaPhoneAlt />
                  <a href="tel:+918010340843">+91 8010340843</a>
                </li>
                <li>
                  <FaMapMarkerAlt />
                  <span>Pune, Maharashtra, India</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="footer-divider"></div>
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                © {new Date().getFullYear()} Aditya Suryawanshi. All rights reserved.
              </p>
              <p className="footer-built">
                Built with <motion.span 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ display: 'inline-block', color: '#ff4444' }}
                >❤️</motion.span> using React & Framer Motion
              </p>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Back to Top Button - Mobile Only */}
      <BackToTop />
    </div>
  );
}

export default App;
