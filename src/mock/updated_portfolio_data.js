import githubIcon from '../assets/github.svg';
import linkedinIcon from '../assets/linkedin.png';
import instagramIcon from '../assets/instagram.png';
import messageboard from '../assets/messageboard.png';
import mernAuthS from '../assets/mernAuthS.png';
import studentteacherportalimg from '../assets/student-teacher-portal.png';
import jewelryWebsiteImg from '../assets/jewelry-website.png';
import lokachakraImg from '../assets/lokachakra.svg';


const portfolioData = {
    projects: [

        {
            id: 1,
            title: 'Student&Teachet portal',
            description: 'This MERN stack portal features Teacher Login for adding students and creating dynamic exams. Students log in to a Personal Dashboard, take any pending quizzes, and receive Instant Results with their score percentage.',
            screenshotUrl: studentteacherportalimg,
            liveUrl: 'https://mern-student-teacher-app-1.onrender.com',
            technologies: ['Node.js', 'React', 'Tailwind CSS', 'JWT', 'MongoDB', 'Express']
        }, {
            id: 2,
            title: 'MERN-Email-authetication',
            description: 'A full-stack email authentication application, login,signUp,Verify using email  authentication using OTP. The backend is powered by Node.js and Express, with a MongoDB database.',
            screenshotUrl: mernAuthS,
            liveUrl: 'https://mern-auth-two-murex.vercel.app/',
            technologies: ['nodemailer', 'React', 'Brevo', 'JWT', 'MongoDB', 'Express']
        }, {
            id: 3,
            title: 'Message Board--MERN',
            description: 'I created a message board any one with the link can post the meaasge. it stores the messages in mongoDb',
            screenshotUrl: messageboard,
            liveUrl: 'https://mern-message-board.vercel.app/',
            technologies: ['React', 'Tailwind CSS', 'MongoDb', 'Git']
        },
        {
            id: 4,
            title: 'ISHAANI - Jewelry E-commerce',
            description: 'A modern, full-stack jewelry e-commerce platform. Features include a responsive design with Tailwind CSS, animated UI with Framer Motion, secure user authentication (JWT), product management, and a functional shopping cart. The backend is powered by Node.js and Express with MongoDB.',
            screenshotUrl: jewelryWebsiteImg,
            liveUrl: 'https://jewelry-website-sepia.vercel.app/',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'JWT']
        },
        {
            id: 5,
            title: 'Lokachakra - Blockchain Verification',
            description: 'A decentralized application (DApp) for document verification on the Solana blockchain. Users can upload documents to mint proofs, ensuring immutability and authenticity. Integrates Supabase for metadata and Phantom Wallet for transactions.',
            screenshotUrl: lokachakraImg,
            liveUrl: 'https://lokachakra-superbase-blockchain.vercel.app/',
            technologies: ['React', 'Solana (Devnet)', 'Anchor', 'Rust', 'Supabase', 'Tailwind CSS', 'Phantom Wallet']
        }

    ],
    skills: [
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg' },
        { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg' },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg' },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg' },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
        { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    ],
    socials: [
        { name: 'GitHub', url: 'https://github.com/sagar00praveen', icon: githubIcon },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sagar-praveen', icon: linkedinIcon },
        { name: 'Instagram', url: 'https://instagram.com/___sagar_sagar__', icon: instagramIcon },
    ],
    personalInfo: {
        name: "Sagar Praveen",
        phone: "8978539071",
        email: "sagar.y.praveen@gmail.com",
        education: {
            degree: "B.Tech in Computer Science and Engineering",
            year: "2022 - 2026",
            college: "NRI Institute of Technology",
            location: "Pothavarappadu, Krishna, Andhra Pradesh"
        }
    },
    internships: [
        {
            company: "CODEGNAN IT SOLUTIONS PVT LTD (APSCHE)",
            role: "Intern",
            link: "https://drive.google.com/file/d/16n3rmsIrj2nqI2ZrxwhTiUbVWgf6rDqc/view?usp=sharing"
        },
        {
            company: "CodSoft",
            role: "Web Development Intern",
            link: "https://drive.google.com/file/d/1EinJrSJRyMwdQgAmUal1-gA1x0tdihno/view?usp=sharing"
        }
    ],
    certifications: [
        {
            name: "JavaScript Algorithms and Data Structures",
            issuer: "freeCodeCamp",
            link: "https://www.freecodecamp.org/certification/sagar_praveen/javascript-algorithms-and-data-structures-v8"
        },
        {
            name: "Responsive Web Design",
            issuer: "freeCodeCamp",
            link: "https://www.freecodecamp.org/certification/sagar_praveen/responsive-web-design"
        }
    ]
};


export default portfolioData;
