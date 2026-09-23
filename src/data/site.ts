import type { ImageMetadata } from 'astro';

import chamsi from '../assets/work/chamsi.png';
import chamsiPhone from '../assets/work/chamsi-m.png';
import maskr from '../assets/work/maskr.png';
import maskrPhone from '../assets/work/maskr-m.png';
import mida from '../assets/work/mida.png';
import midaPhone from '../assets/work/mida-m.png';
import kifach from '../assets/work/kifach.png';
import kifachPhone from '../assets/work/kifach-m.png';
import noor from '../assets/work/noor.png';
import noorPhone from '../assets/work/noor-m.png';

import hotel from '../assets/archive/hotel.png';
import dailyWorker from '../assets/archive/daily-worker.png';
import deNft from '../assets/archive/de-nft.png';

import certAws from '../assets/certs/devops-aws.png';
import certUx from '../assets/certs/ux-google.png';
import certPython from '../assets/certs/python-umich.png';
import certUml from '../assets/certs/uml-hkust.png';
import certUnix from '../assets/certs/unix-codio.png';
import certTerraform from '../assets/certs/terraform-orange.png';

export { person, emailjs } from './person';

export interface SelectedProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  stack: string[];
  url: string;
  /** The product's own colours, so each card reads as that product. */
  theme: { bg: string; ink: string; muted: string; line: string };
  desktop: ImageMetadata;
  phone: ImageMetadata;
}

const darkTheme = (bg: string) => ({
  bg,
  ink: '#eef1ee',
  muted: 'rgba(238, 241, 238, 0.72)',
  line: 'rgba(238, 241, 238, 0.16)',
});

export const selectedWork: SelectedProject[] = [
  {
    slug: 'chamsi',
    name: 'Chamsi',
    tagline: 'Solar power for Moroccan businesses',
    description:
      'Photograph an electricity bill and get the right solar size, the investment and the yearly savings in about two minutes. An AI step reads ONEE and Lydec bills, and PVGIS gives the yield for each city.',
    role: 'Product, design and engineering',
    year: '2026',
    stack: ['Cloudflare Workers', 'Hono', 'D1 + Drizzle', 'Workers AI', 'Astro', 'Kotlin Multiplatform'],
    url: 'https://chamsi.kiifach0.workers.dev',
    theme: darkTheme('#101a15'),
    desktop: chamsi,
    phone: chamsiPhone,
  },
  {
    slug: 'maskr',
    name: 'Maskr',
    tagline: 'Redact screenshots without uploading them',
    description:
      'Drop a screenshot and Maskr finds emails, phone numbers, IBANs and card numbers, then blacks them out. The OCR runs in WebAssembly, so nothing leaves the device. It also ships as a browser extension.',
    role: 'Design and engineering',
    year: '2026',
    stack: ['JavaScript', 'Tesseract.js', 'WebAssembly', 'Browser extension', 'Cloudflare'],
    url: 'https://maskr.mestafa-wydad66.workers.dev',
    theme: {
      bg: '#efe8dd',
      ink: '#171513',
      muted: 'rgba(23, 21, 19, 0.72)',
      line: 'rgba(23, 21, 19, 0.14)',
    },
    desktop: maskr,
    phone: maskrPhone,
  },
  {
    slug: 'mida',
    name: 'Mida',
    tagline: 'Meal subscriptions in Casablanca',
    description:
      'Breakfast, lunch or dinner, cooked the same day and delivered to the office or home at a chosen time. A subscription builder with delivery slots, in five languages including Arabic from right to left.',
    role: 'Design and engineering',
    year: '2026',
    stack: ['Astro', 'React', 'GSAP', 'Hono', 'Cloudflare D1'],
    url: 'https://mida.kiifach0.workers.dev/en',
    theme: darkTheme('#10130d'),
    desktop: mida,
    phone: midaPhone,
  },
  {
    slug: 'kifach',
    name: 'Kifach',
    tagline: 'Moroccan paperwork, explained',
    description:
      'Step-by-step guides for administrative procedures in French, Arabic and Darija, with the official sources and a checklist you can tick off: which papers, where, how much and how long.',
    role: 'Product, design and engineering',
    year: '2026',
    stack: ['Astro', 'Cloudflare Pages Functions', 'D1', 'Turnstile'],
    url: 'https://kiifach.pages.dev',
    theme: darkTheme('#0d1f3b'),
    desktop: kifach,
    phone: kifachPhone,
  },
  {
    slug: 'noor',
    name: 'Noor Al-Islam',
    tagline: 'Quran, hadith and prayer times',
    description:
      'A progressive web app with three Quran readings and colour-coded tajweed, ten hadith collections, prayer times and the qibla direction, in 14 languages.',
    role: 'Design and engineering',
    year: '2026',
    stack: ['JavaScript', 'PWA', 'Cloudflare Pages', 'REST APIs'],
    url: 'https://noor-al-islam-2cg.pages.dev',
    theme: darkTheme('#0b1711'),
    desktop: noor,
    phone: noorPhone,
  },
];

export interface Role {
  title: string;
  org: string;
  place: string;
  start: string;
  end: string;
  points: string[];
  stack: string[];
}

export const experience: Role[] = [
  {
    title: 'Data & AI Engineer',
    org: 'JESA',
    place: 'Casablanca',
    start: 'Mar 2025',
    end: 'Sep 2025',
    points: [
      'Built a multi-agent conversational interface on LLMs with Groq, LangChain and FastAPI.',
      'SQL agent that queries SQL Server databases from plain questions.',
      'CSV agent that ingests and syncs files with Pandas and charts the results.',
      'API graph agent that brings external data in through APIs.',
    ],
    stack: ['LangChain', 'Groq', 'FastAPI', 'SQL Server', 'Pandas'],
  },
  {
    title: 'DevOps & Full-Stack Engineer',
    org: 'Nomatis',
    place: 'Rabat',
    start: 'Jul 2024',
    end: 'Sep 2024',
    points: [
      'CI/CD pipelines with Azure DevOps and GitHub Actions: deployment time down 40%, release frequency up 60%.',
      'Spring Boot and Angular apps that made B2B and B2C account management 30% more efficient.',
      'A real-time dashboard that sped up decisions by 25%.',
    ],
    stack: ['Azure DevOps', 'GitHub Actions', 'Spring Boot', 'Angular'],
  },
  {
    title: 'Data Science Intern',
    org: 'CodSoft',
    place: 'India, remote',
    start: 'Jul 2024',
    end: 'Aug 2024',
    points: [
      'ML models for movie rating prediction and credit card fraud detection.',
      'Data pipelines in Python and scikit-learn, then tuned for performance.',
    ],
    stack: ['Python', 'scikit-learn', 'Pandas'],
  },
  {
    title: 'Web Developer',
    org: 'Extra Room',
    place: 'Casablanca',
    start: 'Jul 2023',
    end: 'Aug 2023',
    points: [
      'Stock management application in PHP and Bootstrap.',
      'Unit tests with PHPUnit and performance work that cut errors by 15%.',
    ],
    stack: ['PHP', 'Bootstrap', 'PHPUnit'],
  },
];

export const education = [
  {
    title: 'Master in MIAGE, MBDS track',
    detail: 'Mobility, Big Data and Systems Integration',
    school: "Université Côte d'Azur",
    years: '2021 to 2025',
  },
  {
    title: 'Engineering degree, Computer Science and Networks',
    detail: 'MIAGE option',
    school: 'EMSI Casablanca',
    years: '2021 to 2025',
  },
  {
    title: 'Scientific Baccalaureate',
    detail: '',
    school: 'Groupe Scolaire Cordoba',
    years: '2019',
  },
];

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'Advanced' },
  { name: 'French', level: 'Intermediate' },
];

export const facts = [
  { value: '4', label: 'companies' },
  { value: '5', label: 'live products' },
  { value: '10', label: 'certifications' },
  { value: '40+', label: 'GitHub repositories' },
];

export type Category = 'ai' | 'web' | 'mobile' | 'devops';

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'devops', label: 'DevOps' },
];

export interface ArchiveProject {
  name: string;
  description: string;
  year: string;
  cats: Category[];
  tags: string[];
  url?: string;
  image?: ImageMetadata;
  /** simple-icons slug shown on the tile when there is no screenshot */
  logo?: string;
}

const repo = (name: string) => `https://github.com/elm-dak/${name}`;

export const archive: ArchiveProject[] = [
  {
    name: 'Hotel Casanegra',
    description: 'Hotel booking and management app in Django, deployed on AWS EC2 with Terraform.',
    year: '2023',
    cats: ['web', 'devops'],
    tags: ['Django', 'Terraform', 'AWS EC2'],
    url: repo('booking-hotel'),
    image: hotel,
  },
  {
    name: 'Productivity platform',
    description:
      'MERN web app and React Native mobile app with an AI chatbot for productivity advice, a habit dashboard and proactive alerts.',
    year: 'Academic',
    cats: ['ai', 'web', 'mobile'],
    tags: ['MongoDB', 'Express', 'React', 'React Native'],
    logo: 'react',
  },
  {
    name: 'Smart ML mobile app',
    description:
      'Flutter app with Firebase sign-in and three models: fruit classification, fashion recognition and card fraud detection.',
    year: '2025',
    cats: ['ai', 'mobile'],
    tags: ['Flutter', 'Firebase', 'TensorFlow'],
    url: repo('App_DL_ML_Flutter'),
    logo: 'flutter',
  },
  {
    name: 'Daily A Worker',
    description: 'PHP platform that connects customers with workers for day jobs.',
    year: '2023',
    cats: ['web'],
    tags: ['PHP', 'MySQL', 'CSS'],
    url: repo('Daily-a-worker'),
    image: dailyWorker,
  },
  {
    name: 'Student document requests',
    description:
      'Spring Boot microservices for requesting school documents, containerised with Docker and shipped by CI/CD to Azure Container Registry.',
    year: 'Academic',
    cats: ['web', 'devops'],
    tags: ['Spring Boot', 'Docker', 'Azure', 'Bootstrap'],
    logo: 'springboot',
  },
  {
    name: 'Movie recommender',
    description:
      'Pulls popular films and series from the TMDB API into a clean dataset and recommends titles from a description.',
    year: '2024',
    cats: ['ai'],
    tags: ['Python', 'Pandas', 'scikit-learn', 'Streamlit'],
    url: repo('movie-recom-chatdak'),
    logo: 'streamlit',
  },
  {
    name: 'Infrastructure as code',
    description:
      'Terraform and Kubernetes labs: static sites on AWS S3, EC2 servers and a React app on Docker and Kubernetes.',
    year: '2024',
    cats: ['devops'],
    tags: ['Terraform', 'AWS', 'Docker', 'Kubernetes'],
    url: repo('static-web-terraform'),
    logo: 'terraform',
  },
  {
    name: 'Skin tone and clothing colours',
    description: 'Detects faces and skin tone with OpenCV, then suggests clothing colours that match.',
    year: '2024',
    cats: ['ai'],
    tags: ['OpenCV', 'NumPy', 'Streamlit'],
    url: repo('colors-cloths-match-face'),
    logo: 'opencv',
  },
  {
    name: 'DE-nft',
    description: 'Landing page for a blockchain and NFT collection with an illustrated hero.',
    year: '2023',
    cats: ['web'],
    tags: ['HTML', 'CSS', 'JavaScript'],
    url: repo('DE-nft'),
    image: deNft,
  },
  {
    name: 'Stock management',
    description: 'PHP and MySQL stock system with PHPUnit tests and a GitHub Actions workflow.',
    year: '2023',
    cats: ['web', 'devops'],
    tags: ['PHP', 'MySQL', 'PHPUnit', 'GitHub Actions'],
    url: repo('Gestion-stock'),
    logo: 'php',
  },
  {
    name: 'CodSoft ML projects',
    description: 'Credit card fraud detection, movie rating prediction and classic classification tasks.',
    year: '2024',
    cats: ['ai'],
    tags: ['scikit-learn', 'Pandas', 'Jupyter'],
    url: repo('CODSOFT'),
    logo: 'scikitlearn',
  },
  {
    name: 'Fruit classifier',
    description: 'A Keras CNN that recognises seven fruits from a photo, served with Streamlit.',
    year: '2025',
    cats: ['ai'],
    tags: ['Keras', 'TensorFlow', 'Streamlit'],
    url: repo('fruits_classifiy'),
    logo: 'keras',
  },
  {
    name: 'Spring Boot microservices',
    description: 'Service discovery with Consul, messaging with Kafka and security with Keycloak.',
    year: '2024',
    cats: ['web', 'devops'],
    tags: ['Spring Boot', 'Kafka', 'Consul', 'Keycloak'],
    url: repo('App_microservices'),
    logo: 'apachekafka',
  },
  {
    name: 'Mobile e-commerce app',
    description: 'Flutter shop on Firebase with payments and order management.',
    year: 'Academic',
    cats: ['mobile'],
    tags: ['Flutter', 'Dart', 'Firebase'],
    logo: 'firebase',
  },
];

export interface ToolGroup {
  name: string;
  tools: { name: string; logo?: string }[];
}

export const toolbox: ToolGroup[] = [
  {
    name: 'AI & ML',
    tools: [
      { name: 'LangChain', logo: 'langchain' },
      { name: 'RAG' },
      { name: 'Groq' },
      { name: 'ChromaDB' },
      { name: 'scikit-learn', logo: 'scikitlearn' },
      { name: 'TensorFlow', logo: 'tensorflow' },
      { name: 'Keras', logo: 'keras' },
      { name: 'PyTorch', logo: 'pytorch' },
      { name: 'OpenCV', logo: 'opencv' },
    ],
  },
  {
    name: 'Data',
    tools: [
      { name: 'Python', logo: 'python' },
      { name: 'Pandas', logo: 'pandas' },
      { name: 'NumPy', logo: 'numpy' },
      { name: 'SQL' },
      { name: 'Apache Spark', logo: 'apachespark' },
      { name: 'Hadoop', logo: 'apachehadoop' },
      { name: 'Airflow', logo: 'apacheairflow' },
      { name: 'BigQuery', logo: 'googlebigquery' },
      { name: 'ETL and warehousing' },
    ],
  },
  {
    name: 'Web',
    tools: [
      { name: 'Spring Boot', logo: 'springboot' },
      { name: 'FastAPI', logo: 'fastapi' },
      { name: 'Django', logo: 'django' },
      { name: 'Node.js', logo: 'nodedotjs' },
      { name: 'Hono', logo: 'hono' },
      { name: 'Angular', logo: 'angular' },
      { name: 'React', logo: 'react' },
      { name: 'Astro', logo: 'astro' },
      { name: 'TypeScript', logo: 'typescript' },
    ],
  },
  {
    name: 'Mobile',
    tools: [
      { name: 'Flutter', logo: 'flutter' },
      { name: 'Dart', logo: 'dart' },
      { name: 'React Native', logo: 'react' },
      { name: 'Kotlin Multiplatform', logo: 'kotlin' },
      { name: 'Android', logo: 'android' },
    ],
  },
  {
    name: 'DevOps & Cloud',
    tools: [
      { name: 'Docker', logo: 'docker' },
      { name: 'Kubernetes', logo: 'kubernetes' },
      { name: 'Terraform', logo: 'terraform' },
      { name: 'Jenkins', logo: 'jenkins' },
      { name: 'GitLab CI', logo: 'gitlab' },
      { name: 'GitHub Actions', logo: 'githubactions' },
      { name: 'AWS' },
      { name: 'Azure' },
      { name: 'Cloudflare', logo: 'cloudflare' },
    ],
  },
  {
    name: 'Databases',
    tools: [
      { name: 'PostgreSQL', logo: 'postgresql' },
      { name: 'SQL Server' },
      { name: 'MySQL', logo: 'mysql' },
      { name: 'MongoDB', logo: 'mongodb' },
      { name: 'SQLite and D1', logo: 'sqlite' },
      { name: 'Firebase', logo: 'firebase' },
    ],
  },
];

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  verify?: string;
  image?: ImageMetadata;
}

export const certificates: Certificate[] = [
  {
    title: 'DevOps on AWS, 4-course specialization',
    issuer: 'Amazon Web Services',
    date: 'Aug 2023',
    verify: 'https://coursera.org/verify/specialization/MHZ45YSEQYQX',
    image: certAws,
  },
  {
    title: 'Foundations of User Experience (UX) Design',
    issuer: 'Google',
    date: 'Jul 2023',
    verify: 'https://coursera.org/verify/MX3WP5T9JB4E',
    image: certUx,
  },
  {
    title: 'Retrieving, Processing and Visualizing Data with Python',
    issuer: 'University of Michigan',
    date: 'Mar 2023',
    verify: 'https://coursera.org/verify/55RNKX5DKQLW',
    image: certPython,
  },
  {
    title: 'Modeling Software Systems using UML',
    issuer: 'HKUST',
    date: 'Mar 2023',
    verify: 'https://coursera.org/verify/JFZFPVXAXQYA',
    image: certUml,
  },
  {
    title: 'Unix System Basics',
    issuer: 'Codio',
    date: 'Apr 2023',
    verify: 'https://coursera.org/verify/LRL4G6YT9TUW',
    image: certUnix,
  },
  {
    title: 'Terraform with AWS, 3-day training',
    issuer: 'Orange Digital Center',
    date: 'January',
    image: certTerraform,
  },
  { title: 'Certified Artificial Intelligence Practitioner', issuer: 'CertNexus', date: '' },
  { title: 'IBM DevOps and Software Engineering', issuer: 'IBM', date: '' },
  { title: 'Virtual Networks in Azure', issuer: 'Whizlabs', date: '' },
  { title: 'Cloud Data Engineer', issuer: 'Google Cloud', date: '' },
];
