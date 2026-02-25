// Sample Resume Templates Library

export const sampleResumeTemplates = [
  {
    id: 'software-engineer-1',
    name: 'Senior Software Engineer',
    role: 'Software Engineer',
    category: 'tech',
    experience: '5+ years',
    icon: '💻',
    description: 'Full-stack developer with cloud expertise',
    data: {
      personalInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        portfolio: 'alexjohnson.dev',
        summary: 'Results-driven Full Stack Developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact solutions that improve user experience and business outcomes.'
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Stanford University',
          location: 'Stanford, CA',
          startDate: '2015',
          endDate: '2019',
          gpa: '3.8/4.0'
        }
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: 'Jan 2021',
          endDate: 'Present',
          description: '• Led development of microservices architecture serving 10M+ users\n• Improved application performance by 40% through code optimization\n• Mentored team of 5 junior developers\n• Implemented CI/CD pipeline reducing deployment time by 60%'
        },
        {
          title: 'Software Engineer',
          company: 'StartupXYZ',
          location: 'San Francisco, CA',
          startDate: 'Jun 2019',
          endDate: 'Dec 2020',
          description: '• Developed RESTful APIs using Node.js and Express\n• Built responsive web applications with React and TypeScript\n• Collaborated with product team to define technical requirements\n• Reduced bug count by 35% through comprehensive testing'
        }
      ],
      skills: [
        { category: 'Programming Languages', items: 'JavaScript, TypeScript, Python, Java, Go' },
        { category: 'Frontend', items: 'React, Vue.js, Next.js, TailwindCSS, Redux' },
        { category: 'Backend', items: 'Node.js, Express, Django, REST APIs, GraphQL' },
        { category: 'Database', items: 'PostgreSQL, MongoDB, Redis, MySQL' },
        { category: 'Cloud & DevOps', items: 'AWS, Docker, Kubernetes, CI/CD, Jenkins' },
        { category: 'Tools', items: 'Git, Jira, Agile/Scrum, VS Code' }
      ],
      projects: [
        {
          name: 'E-Commerce Platform',
          technologies: 'React, Node.js, MongoDB, AWS',
          link: 'github.com/alex/ecommerce',
          description: '• Built full-stack e-commerce platform with payment integration\n• Implemented real-time inventory management\n• Achieved 99.9% uptime with load balancing'
        }
      ]
    }
  },
  {
    id: 'data-scientist-1',
    name: 'Data Scientist',
    role: 'Data Scientist',
    category: 'tech',
    experience: '3-5 years',
    icon: '📊',
    description: 'ML engineer with Python and AI expertise',
    data: {
      personalInfo: {
        fullName: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 (555) 234-5678',
        address: 'New York, NY',
        linkedin: 'linkedin.com/in/sarahchen',
        portfolio: 'sarahchen.ai',
        summary: 'Data Scientist with 4+ years of experience in machine learning, statistical analysis, and predictive modeling. Skilled in Python, R, and SQL with a proven ability to translate complex data into actionable business insights. Passionate about leveraging AI to solve real-world problems.'
      },
      education: [
        {
          degree: 'Master of Science in Data Science',
          institution: 'MIT',
          location: 'Cambridge, MA',
          startDate: '2017',
          endDate: '2019',
          gpa: '3.9/4.0'
        },
        {
          degree: 'Bachelor of Science in Mathematics',
          institution: 'UC Berkeley',
          location: 'Berkeley, CA',
          startDate: '2013',
          endDate: '2017',
          gpa: '3.7/4.0'
        }
      ],
      experience: [
        {
          title: 'Senior Data Scientist',
          company: 'DataTech Inc',
          location: 'New York, NY',
          startDate: 'Mar 2021',
          endDate: 'Present',
          description: '• Developed ML models improving customer retention by 25%\n• Led A/B testing initiatives resulting in $2M revenue increase\n• Built recommendation system serving 5M+ users\n• Collaborated with engineering team to deploy models in production'
        },
        {
          title: 'Data Scientist',
          company: 'Analytics Corp',
          location: 'New York, NY',
          startDate: 'Jul 2019',
          endDate: 'Feb 2021',
          description: '• Created predictive models for sales forecasting\n• Performed statistical analysis on large datasets (10M+ records)\n• Automated data pipelines reducing processing time by 50%\n• Presented insights to C-level executives'
        }
      ],
      skills: [
        { category: 'Programming', items: 'Python, R, SQL, Scala' },
        { category: 'ML/AI', items: 'TensorFlow, PyTorch, Scikit-learn, Keras, NLP' },
        { category: 'Data Analysis', items: 'Pandas, NumPy, Matplotlib, Seaborn' },
        { category: 'Big Data', items: 'Spark, Hadoop, Hive, Kafka' },
        { category: 'Cloud', items: 'AWS SageMaker, Google Cloud AI, Azure ML' },
        { category: 'Tools', items: 'Jupyter, Git, Docker, Tableau, Power BI' }
      ],
      projects: [
        {
          name: 'Customer Churn Prediction',
          technologies: 'Python, TensorFlow, AWS',
          link: 'github.com/sarah/churn-prediction',
          description: '• Built ML model with 92% accuracy for predicting customer churn\n• Deployed model using AWS SageMaker\n• Reduced churn rate by 18% through targeted interventions'
        }
      ]
    }
  },
  {
    id: 'product-manager-1',
    name: 'Product Manager',
    role: 'Product Manager',
    category: 'business',
    experience: '5+ years',
    icon: '📱',
    description: 'Strategic PM with technical background',
    data: {
      personalInfo: {
        fullName: 'Michael Rodriguez',
        email: 'michael.r@email.com',
        phone: '+1 (555) 345-6789',
        address: 'Seattle, WA',
        linkedin: 'linkedin.com/in/michaelrodriguez',
        portfolio: 'michaelrodriguez.pm',
        summary: 'Strategic Product Manager with 6+ years of experience driving product vision and execution. Proven track record of launching successful products that generate millions in revenue. Strong technical background combined with business acumen and user-centric approach to product development.'
      },
      education: [
        {
          degree: 'MBA - Product Management',
          institution: 'Harvard Business School',
          location: 'Boston, MA',
          startDate: '2016',
          endDate: '2018',
          gpa: ''
        },
        {
          degree: 'B.S. in Computer Engineering',
          institution: 'University of Washington',
          location: 'Seattle, WA',
          startDate: '2012',
          endDate: '2016',
          gpa: '3.6/4.0'
        }
      ],
      experience: [
        {
          title: 'Senior Product Manager',
          company: 'Amazon',
          location: 'Seattle, WA',
          startDate: 'Jan 2020',
          endDate: 'Present',
          description: '• Led product strategy for e-commerce platform serving 50M+ users\n• Launched 3 major features increasing conversion rate by 35%\n• Managed cross-functional team of 15 engineers and designers\n• Drove $10M in annual revenue through product innovations\n• Conducted user research and data analysis to inform product decisions'
        },
        {
          title: 'Product Manager',
          company: 'Microsoft',
          location: 'Redmond, WA',
          startDate: 'Jun 2018',
          endDate: 'Dec 2019',
          description: '• Owned product roadmap for cloud services product\n• Collaborated with engineering to define technical requirements\n• Increased user engagement by 45% through feature optimization\n• Presented product vision to stakeholders and executives'
        }
      ],
      skills: [
        { category: 'Product Management', items: 'Product Strategy, Roadmapping, User Research, A/B Testing' },
        { category: 'Technical Skills', items: 'SQL, Python, APIs, Agile/Scrum, Jira' },
        { category: 'Analytics', items: 'Google Analytics, Mixpanel, Amplitude, Tableau' },
        { category: 'Design', items: 'Figma, Wireframing, User Flows, Prototyping' },
        { category: 'Business', items: 'Market Analysis, Competitive Research, P&L Management' }
      ],
      projects: []
    }
  },
  {
    id: 'ux-designer-1',
    name: 'UX/UI Designer',
    role: 'UX/UI Designer',
    category: 'creative',
    experience: '3-5 years',
    icon: '🎨',
    description: 'Creative designer with user-centered approach',
    data: {
      personalInfo: {
        fullName: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1 (555) 456-7890',
        address: 'Los Angeles, CA',
        linkedin: 'linkedin.com/in/emmawilson',
        portfolio: 'emmawilson.design',
        summary: 'Creative UX/UI Designer with 4+ years of experience crafting intuitive and visually stunning digital experiences. Passionate about user-centered design and creating products that delight users. Proficient in Figma, Adobe Creative Suite, and modern design systems.'
      },
      education: [
        {
          degree: 'Bachelor of Fine Arts in Graphic Design',
          institution: 'Rhode Island School of Design',
          location: 'Providence, RI',
          startDate: '2016',
          endDate: '2020',
          gpa: '3.8/4.0'
        }
      ],
      experience: [
        {
          title: 'Senior UX/UI Designer',
          company: 'Design Studio',
          location: 'Los Angeles, CA',
          startDate: 'Mar 2022',
          endDate: 'Present',
          description: '• Led design for mobile app with 2M+ downloads\n• Created design system used across 10+ products\n• Conducted user research and usability testing\n• Improved user satisfaction score from 3.5 to 4.7 stars\n• Collaborated with product and engineering teams'
        },
        {
          title: 'UX/UI Designer',
          company: 'Creative Agency',
          location: 'Los Angeles, CA',
          startDate: 'Jul 2020',
          endDate: 'Feb 2022',
          description: '• Designed websites and mobile apps for 15+ clients\n• Created wireframes, prototypes, and high-fidelity mockups\n• Increased conversion rates by 40% through design optimization\n• Presented design concepts to clients and stakeholders'
        }
      ],
      skills: [
        { category: 'Design Tools', items: 'Figma, Sketch, Adobe XD, Photoshop, Illustrator' },
        { category: 'Prototyping', items: 'InVision, Principle, Framer, ProtoPie' },
        { category: 'UX Research', items: 'User Interviews, Usability Testing, A/B Testing' },
        { category: 'Frontend', items: 'HTML, CSS, JavaScript, React basics' },
        { category: 'Other', items: 'Design Systems, Accessibility, Responsive Design' }
      ],
      projects: [
        {
          name: 'E-Commerce Mobile App',
          technologies: 'Figma, React Native',
          link: 'behance.net/emma/ecommerce',
          description: '• Designed complete mobile shopping experience\n• Created interactive prototypes for user testing\n• Achieved 4.8-star rating on App Store'
        }
      ]
    }
  },
  {
    id: 'marketing-manager-1',
    name: 'Marketing Manager',
    role: 'Marketing Manager',
    category: 'business',
    experience: '5+ years',
    icon: '📈',
    description: 'Digital marketing expert with ROI focus',
    data: {
      personalInfo: {
        fullName: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 567-8901',
        address: 'Austin, TX',
        linkedin: 'linkedin.com/in/davidkim',
        portfolio: '',
        summary: 'Results-oriented Marketing Manager with 6+ years of experience driving growth through data-driven strategies. Expertise in digital marketing, content strategy, and campaign management. Proven track record of increasing brand awareness and generating qualified leads while optimizing marketing ROI.'
      },
      education: [
        {
          degree: 'MBA - Marketing',
          institution: 'University of Texas',
          location: 'Austin, TX',
          startDate: '2015',
          endDate: '2017',
          gpa: ''
        },
        {
          degree: 'B.A. in Communications',
          institution: 'UCLA',
          location: 'Los Angeles, CA',
          startDate: '2011',
          endDate: '2015',
          gpa: '3.7/4.0'
        }
      ],
      experience: [
        {
          title: 'Marketing Manager',
          company: 'Tech Startup',
          location: 'Austin, TX',
          startDate: 'Jan 2020',
          endDate: 'Present',
          description: '• Increased website traffic by 150% through SEO and content marketing\n• Managed $500K annual marketing budget with 300% ROI\n• Led team of 5 marketing specialists\n• Launched successful product campaigns generating $2M in revenue\n• Implemented marketing automation increasing lead conversion by 45%'
        },
        {
          title: 'Digital Marketing Specialist',
          company: 'Marketing Agency',
          location: 'Austin, TX',
          startDate: 'Jun 2017',
          endDate: 'Dec 2019',
          description: '• Managed social media campaigns for 10+ clients\n• Increased engagement rates by 80% through targeted content\n• Created email marketing campaigns with 25% open rate\n• Analyzed campaign performance and provided strategic recommendations'
        }
      ],
      skills: [
        { category: 'Digital Marketing', items: 'SEO, SEM, PPC, Social Media Marketing, Email Marketing' },
        { category: 'Analytics', items: 'Google Analytics, Google Ads, Facebook Ads, HubSpot' },
        { category: 'Content', items: 'Content Strategy, Copywriting, Blog Management' },
        { category: 'Tools', items: 'Salesforce, Mailchimp, Hootsuite, Canva, WordPress' },
        { category: 'Skills', items: 'Campaign Management, A/B Testing, Marketing Automation' }
      ],
      projects: []
    }
  },
  {
    id: 'student-cs-1',
    name: 'Computer Science Student',
    role: 'CS Student',
    category: 'student',
    experience: 'Entry Level',
    icon: '🎓',
    description: 'Recent graduate seeking first role',
    data: {
      personalInfo: {
        fullName: 'Jessica Martinez',
        email: 'jessica.martinez@university.edu',
        phone: '+1 (555) 678-9012',
        address: 'Boston, MA',
        linkedin: 'linkedin.com/in/jessicamartinez',
        portfolio: 'github.com/jessicam',
        summary: 'Motivated Computer Science graduate with strong foundation in software development and problem-solving. Completed multiple internships and academic projects demonstrating proficiency in full-stack development. Eager to contribute technical skills and learn from experienced professionals in a dynamic tech environment.'
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Boston University',
          location: 'Boston, MA',
          startDate: '2020',
          endDate: '2024',
          gpa: '3.7/4.0'
        }
      ],
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'Tech Company',
          location: 'Boston, MA',
          startDate: 'Jun 2023',
          endDate: 'Aug 2023',
          description: '• Developed features for web application using React and Node.js\n• Collaborated with team of 8 engineers using Agile methodology\n• Wrote unit tests achieving 85% code coverage\n• Participated in code reviews and daily standups'
        },
        {
          title: 'Web Development Intern',
          company: 'Local Startup',
          location: 'Boston, MA',
          startDate: 'Jun 2022',
          endDate: 'Aug 2022',
          description: '• Built responsive websites for small business clients\n• Implemented RESTful APIs using Express.js\n• Improved website load time by 30% through optimization\n• Learned version control with Git and GitHub'
        }
      ],
      skills: [
        { category: 'Programming', items: 'Python, Java, JavaScript, C++, HTML/CSS' },
        { category: 'Web Development', items: 'React, Node.js, Express, MongoDB' },
        { category: 'Tools', items: 'Git, VS Code, Linux, Docker' },
        { category: 'Coursework', items: 'Data Structures, Algorithms, Database Systems, Web Development' }
      ],
      projects: [
        {
          name: 'Social Media Dashboard',
          technologies: 'React, Node.js, MongoDB',
          link: 'github.com/jessica/social-dashboard',
          description: '• Built full-stack web application for tracking social media metrics\n• Implemented user authentication and authorization\n• Deployed on Heroku with CI/CD pipeline'
        },
        {
          name: 'Task Management App',
          technologies: 'Python, Flask, SQLite',
          link: 'github.com/jessica/task-manager',
          description: '• Created web app for managing tasks and projects\n• Implemented CRUD operations and search functionality\n• Designed responsive UI with Bootstrap'
        }
      ]
    }
  }
];
