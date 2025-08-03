"use client";

import React from "react";
import WorkCard from "@/reusable/WorkCard";
import {
  SiFlutter,
  SiReact,
  SiNextdotjs,
  SiFirebase,
  SiTailwindcss,
  SiDart,
  SiGoogleplay,
  SiAppstore,
  SiJavascript,
  SiTypescript,
  SiRazorpay,
  SiApple,
  SiAndroid,
} from "react-icons/si";
import {
  FaBell,
  FaCodeBranch,
  FaImage,
  FaCamera,
  FaDatabase,
  FaNetworkWired,
  FaChartLine,
  FaSearch,
  FaServer,
  FaUnlockAlt,
  FaTachometerAlt,
  FaCubes,
  FaWhatsapp,
} from "react-icons/fa";
import { SiHtml5, SiCss3, SiVercel, SiFramer } from "react-icons/si";
import { FaLink, FaRoute } from "react-icons/fa"; // for "deep linking" and "routes"
import TextBuilder from "@/reusable/TextBuilder";

const works = [
  {
    companyName: "Skillspe",
    companyLogo: "/skillspe.svg",
    projectName: "Skillspe App",
    description:
      "Led full-stack development of the Skillspe app using Flutter and Bloc, integrating Firebase for real-time data, background push notifications, analytics, and OTP-based authentication. Enabled GoRouter navigation, deep linking, third-party sharing (e.g., WhatsApp), and UPI payments via Razorpay. Published to Play Store and App Store with production-ready performance and UX.",

    iframeSrc:
      "https://play.google.com/store/apps/details?id=com.application.skillspe",
    fallbackImageSrc: "/playstore.gif",
    fallbackImageSrcMobile: "/playstore.gif",

    overview:
      "Discover SkillsPe, the ultimate opinion trading platform where your insights can turn into real rewards. Engage with friends and family in private challenges, or join the broader community in public challenges and quizzes. SkillsPe offers a unique blend of excitement, strategy, and knowledge, allowing you to bid on opinions and earn money.",

    objectivePoints: [
      "Allow users to create and join opinion-based challenges",
      "Support private and public gameplay with real rewards",
      "Ensure real-time data sync for live bidding experience",
      "Provide seamless UPI payments across Android and iOS",
      "Offer a reliable wallet system for transactions and settlements",
    ],

    challenges: [
      "Building private challenges flow — where users can create challenges, invite others, and declare winning opinions",
      "Managing 9 states with 3 challenge types (Challenge, Moderator, Motivator) and 3 statuses (Live, Results Pending, Completed)",
      "Updating wallet history accurately across challenge state transitions (credit/debit logic)",
      "Developing a registry-based architecture using enums to map types/statuses to screens for scalable and modular screen rendering",
      "Implementing UPI integration with app-specific intent-based launching (Android supported generic UPI link; iOS required specific deep links)",
      "Creating a UPI app scraper system to detect installed apps, match with mapped intent URLs, and dynamically build a UPI bottom sheet",
      "Fetching real-time order book data without manual refresh using Bloc pattern at the root level with timed polling and state syncing",
      "Fixing push notification deep linking issue (Android opened Play Store instead of app); resolved via `assetlinks.json`, intent filters, and certificate handling",
    ],

    issuesSolved: [
      "Built enum-based architecture for clean state handling and dynamic screen routing",
      "Introduced intent-based UPI logic to overcome platform differences in payment workflows",
      "Implemented Bloc at root for state sharing and real-time data refresh",
      "Fixed deep linking bug in push notifications by configuring `assetlinks.json` and Android manifest",
    ],

    learnings: [
      "Mastered Bloc pattern for scalable state management",
      "Learned to architect using layered architecture and enum-driven logic",
      "Implemented advanced UPI workflows with intent scrapers",
      "Handled deep linking and app association for push notifications",
      "Improved debugging skills for complex cross-platform issues",
      "Gained experience deploying production-ready apps on Android and iOS",
    ],

    techStack: [
      { name: "Flutter", icon: <SiFlutter /> },
      { name: "Dart", icon: <SiDart /> },
      { name: "Firebase", icon: <SiFirebase /> },
      { name: "Push Notifications", icon: <FaBell /> },
      { name: "Bloc (State Management)", icon: <FaCodeBranch /> },
      { name: "GoRouter", icon: <FaRoute /> },
      { name: "Deep Linking", icon: <FaLink /> },
      { name: "Dio (API Client)", icon: <FaNetworkWired /> },
      { name: "Analytics", icon: <FaChartLine /> },
      { name: "Razorpay (Payments)", icon: <SiRazorpay /> },
      { name: "UPI Intent (Android)", icon: <SiAndroid /> },
      { name: "App-Switch Flow (iOS)", icon: <SiApple /> },
      { name: "App Sharing (WhatsApp)", icon: <FaWhatsapp /> },
      { name: "Play Store", icon: <SiGoogleplay /> },
      { name: "App Store", icon: <SiAppstore /> },
    ],
  },
  {
    companyName: "Skillspe",
    companyLogo: "/skillspe.svg",
    description:
      "Designed, developed, and deployed the official website of Skillspe using modern web technologies. Delivered a fast, responsive UI with TailwindCSS, integrated smooth animations via Framer Motion, and implemented SEO-friendly dynamic routing with deep linking support. Ensured high Lighthouse scores for performance and accessibility, with zero downtime deployment through Vercel and robust production optimization.",
    projectName: "Skillspe Website",
    iframeSrc: "https://www.skillspe.com/",
    fallbackImageSrc: "",
    overview:
      "The official website of Skillspe, built using Next.js, is designed to inform users about the Skillspe app and its unique features. It provides a fast, SEO-optimized, and responsive experience, with support for deep linking, user-triggered app interactions, and dynamically generated streamer pages.",
    objectivePoints: [
      "Provide an informative, user-friendly website for Skillspe's mobile app.",
      "Enable deep linking from web to app with platform-specific handling.",
      "Support SEO and fast performance despite dynamic visuals.",
      "Serve unique challenge pages for individual streamers to boost user engagement.",
      "Ensure seamless routing using Next.js dynamic and static strategies.",
    ],
    techStack: [
      { name: "React", icon: <SiReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "TailwindCSS", icon: <SiTailwindcss /> },
      { name: "CSS", icon: <SiCss3 /> },
      { name: "HTML", icon: <SiHtml5 /> },
      { name: "Next.js Routing", icon: <FaRoute /> },
      { name: "Vercel", icon: <SiVercel /> },
      { name: "Framer Motion", icon: <SiFramer /> },
      { name: "Deep Linking", icon: <FaLink /> },
    ],
    challenges: [
      "Implemented deep linking from website to app with fallbacks for non-installed users.",
      "Created dynamic and static routing for streamer-specific challenge pages.",
      "Optimized performance despite large visual and background assets.",
      "Handled Play Store not installed fallback logic on 'Join Now' buttons.",
    ],
    issuesSolved: [
      "Solved deep linking redirection using intent links, with fallback UI when Play Store is unavailable.",
      "Enabled streamer challenge pages via dynamic routes using `getStaticPaths` and JSON-based slugs.",
      "Improved SEO despite dark backgrounds and animations by configuring Next.js SSR and preloading.",
      "Lazy loaded animation-heavy components using `dynamic()` and `use client` to speed up initial paint.",
    ],
    learnings: [
      "Deep understanding of Next.js routing patterns: dynamic vs static rendering.",
      "Practical experience in handling app/web integration using intent-based deep links.",
      "SEO optimization techniques for dark-themed, animation-heavy websites.",
      "Improved proficiency with code-splitting, SSR strategies, and performance tuning in Next.js.",
    ],
  },

  {
    description:
      "Engineered and deployed a scalable Admin Console for Skillspe to manage user data, app content, and analytics — including support for push notifications to the mobile app and real-time reporting. Implemented secure authentication, role-based access control, and modular architecture to ensure maintainability and future scalability. Optimized for performance and deployed seamlessly using Vercel.",

    projectName: "Skillspe Admin Console",
    iframeSrc: "https://www.skillspe.com", // Update if different
    fallbackImageSrc: "/admin_console.png", // Add a real image in /public/images
    fallbackImageSrcMobile: "/admin_console_mobile.png",

    companyName: "Skillspe",
    companyLogo: "/skillspe.svg",
    overview:
      "A powerful internal dashboard built for Skillspe to manage users, app content, campaigns, public opinion data, push notifications, and track engagement analytics. Designed with scalability, security, and performance in mind for the business and moderation team.",
    objectivePoints: [
      "Enable admins to manage user profiles, campaigns, and public opinion data.",
      "Trigger push notifications directly from the console to the mobile app.",
      "Track real-time analytics including opinion trends and engagement statistics.",
      "Ensure secure, role-based access and modular architecture.",
    ],
    techStack: [
      { name: "React", icon: <SiReact /> },
      { name: "Redux (State Management)", icon: <FaCodeBranch /> },
      { name: "TailwindCSS", icon: <SiTailwindcss /> },
      { name: "Vercel", icon: <SiVercel /> },
      { name: "Analytics", icon: <FaChartLine /> },
      { name: "Push Notifications", icon: <FaBell /> },
    ],
    challenges: [
      "Synchronizing campaign and public opinion data across multiple screens.",
      "Implementing Redux slices and thunks to handle complex data flows.",
      "Creating real-time, visually meaningful admin analytics dashboards.",
      "Maintaining consistency of date/time-based data throughout the app.",
    ],
    issuesSolved: [
      "Introduced global Redux store with properly scoped slices for modular data access.",
      "Integrated graph components to represent complex user engagement analytics like win rates, participation, and click-through behavior.",
      "Ensured secure updates (create, update, delete) to campaign/public entities via controlled UI layers.",
      "Optimized state updates for high-volume data without performance lag.",
    ],
    learnings: [
      "Practical Redux Toolkit implementation with middleware (thunks) for async data flows.",
      "Learned to maintain data integrity across deeply nested React components using shared state.",
      "Handled admin analytics and graph rendering using reusable component patterns.",
      "Designed scalable, secure internal tools using modular design architecture.",
    ],
  },
  {
    companyName: "Service Hive",
    companyLogo: "/servicehive.png",
    projectName: "Official Website of Service Hive",
    fallbackImageSrcMobile: "/servicehive_website_mobile.png",

    description:
      "Redesigned and rebuilt the entire Service Hive website with a modern UI, dynamic service pages (14+), scroll-based animations, call scheduling, timely popups, and a fully responsive theme. Implemented dynamic routing using Next.js, integrated Framer Motion for smooth transitions, and optimized SEO to achieve a 100/100 score on Lighthouse audits. The project was deployed on Hostinger.",
    iframeSrc: "https://www.servicehive.com",
    fallbackImageSrc: "/servicehive_website.png",

    overview:
      "Official website of Service Hive, redesigned from scratch with a modern UI, scroll animations, SEO optimization, and dynamic service-based pages. Built with Next.js and deployed on Hostinger, it showcases the services while integrating scheduling, popups, and app integration.",
    objectivePoints: [
      "Provide a seamless experience for users to explore 14+ services.",
      "Allow users to book services or schedule calls via dynamic CTAs.",
      "Improve performance and achieve high Lighthouse audit scores.",
      "Integrate app-level redirection with fallback for non-installed apps.",
    ],
    techStack: [
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "React", icon: <SiReact /> },
      { name: "TailwindCSS", icon: <SiTailwindcss /> },
      { name: "Framer Motion", icon: <SiFramer /> },
      { name: "HTML", icon: <SiHtml5 /> },
      { name: "CSS", icon: <SiCss3 /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "Dynamic Routing", icon: <FaRoute /> },
      { name: "SEO Optimization", icon: <FaSearch /> },
      { name: "Hostinger", icon: <FaServer /> },
    ],
    challenges: [
      "Built dynamic service pages with scroll-based UI transitions.",
      "Implemented static routing for each service using dynamic route slugs.",
      "Added app redirection with fallback logic in case Play Store was unavailable.",
      "Maintained fast load speed despite using animation-heavy design.",
    ],
    issuesSolved: [
      "SEO performance tuned to reach perfect Lighthouse scores across metrics.",
      "Lazy loaded animation-heavy components using Next.js `dynamic()`.",
      "Used `use client` only when needed and leveraged static site generation (SSG) effectively.",
      "Enabled app-to-web and web-to-app deep linking with fallback handling.",
    ],
    learnings: [
      "Handled complex SEO scenarios using structured metadata and SSR.",
      "Improved mastery over scroll-based UX and Framer Motion integration.",
      "Learned static routing strategies for scale and maintainability.",
      "Connected frontend routing with mobile app deep link triggers.",
    ],
  },
  {
    companyName: "Service Hive",
    companyLogo: "/servicehive.png",
    projectName: "Praxis forge website ",
    description:
      "Developed the Praxis Forge website using Next.js with a clean architecture, dynamic routing, and SEO optimization through keyword targeting. Implemented smooth UI animations, scroll-based motion effects, and full support for both dark and light themes to enhance user experience.",

    iframeSrc: "https://www.praxisforge.com",
    fallbackImageSrc: "",

    overview:
      "Official website of Praxis Forge, built to reflect a modern, clean, and brand-consistent experience with light/dark theming, scroll-based animations, and full SEO optimization for professional visibility. Focused on delivering a smooth, responsive UI powered by Next.js and TailwindCSS.",
    objectivePoints: [
      "Present Praxis Forge’s brand and services with professional UI/UX.",
      "Ensure visibility through SEO-friendly routing and metadata.",
      "Support both light and dark themes dynamically across all components.",
      "Deliver smooth animations and scroll-based interactions.",
    ],
    techStack: [
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "React", icon: <SiReact /> },
      { name: "TailwindCSS", icon: <SiTailwindcss /> },
      { name: "Framer Motion", icon: <SiFramer /> },
      { name: "HTML", icon: <SiHtml5 /> },
      { name: "CSS", icon: <SiCss3 /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "Dynamic Routing", icon: <FaRoute /> },
      { name: "SEO Optimization", icon: <FaSearch /> },
      { name: "Hostinger", icon: <FaServer /> },
    ],
    challenges: [
      "Creating a consistent visual experience across dark and light themes.",
      "Implementing scroll-based motion effects without compromising performance.",
      "Structuring the routing architecture for scalable SEO and content delivery.",
      "Maintaining a clean component structure while supporting rich UI elements.",
    ],
    issuesSolved: [
      "Added theme context and local storage support for persistent light/dark mode.",
      "Utilized Framer Motion with optimized motion paths and lazy-loading to keep performance high.",
      "Applied semantic HTML and Next.js head metadata for better SEO crawling.",
      "Refactored animation-heavy pages using `use client` and dynamic imports where necessary.",
    ],
    learnings: [
      "Implemented a scalable dark/light theming system using Tailwind and React context.",
      "Improved Next.js SEO strategies including dynamic routing and meta tag configuration.",
      "Learned how to structure scroll animation in a performance-conscious way.",
      "Applied clean architecture and reusable components for long-term maintainability.",
    ],
  },
  {
    companyName: "Ridvig",
    companyLogo: "/ridvig.png",
    projectName: "Drive Dosti",
    description:
      "Built a cross-platform ride-booking app for Drive Dosti using Flutter, designed to connect drivers and consumers for airport, outstation, or local travel. The app supports time-slot based bookings, deep linking, OTP-based authentication, and clean navigation with GoRouter. Architected with SOLID principles and layered structure (data, domain, presentation), integrated Firebase for backend services, and optimized API handling to reduce performance overhead.",

    iframeSrc: "", 
    fallbackImageSrc: "/cab.webp", 
        fallbackImageSrcMobile: "/cab.webp",

    overview:
      "Drive Dosti is a cross-platform ride-booking app enabling users to book airport, outstation, or local rides via time-slot selection. Built using Flutter, the app emphasizes clean architecture, modular code, and smooth user experience with real-time services integrated via Firebase.",
    objectivePoints: [
      "Enable users to book local, airport, or outstation rides with time-slot selection.",
      "Integrate deep linking and OTP-based secure authentication.",
      "Provide seamless cross-platform support for both Android and iOS.",
      "Optimize performance and API efficiency with clean separation of concerns.",
    ],
    techStack: [
      { name: "Flutter", icon: <SiFlutter /> },
      { name: "Dart", icon: <SiDart /> },
      { name: "Bloc (State Management)", icon: <FaCodeBranch /> },
      { name: "GoRouter (Navigation)", icon: <FaRoute /> },
      { name: "Firebase", icon: <SiFirebase /> },
      { name: "Deep Linking", icon: <FaLink /> },
      { name: "OTP Authentication", icon: <FaUnlockAlt /> },
      { name: "Backend API Calls", icon: <FaNetworkWired /> },
      { name: "Performance Optimization", icon: <FaTachometerAlt /> },
      { name: "SOLID Architecture", icon: <FaCubes /> },
    ],
    challenges: [
      "Applied clean architecture using SOLID principles to separate data, domain, and presentation layers.",
      "Implemented GoRouter for scalable, nested navigation with route guards and deep linking support.",
      "Ensured time-slot selection logic remained consistent across different ride types and screen flows.",
      "Maintained responsive UX across iOS and Android with consistent API latency handling.",
    ],
    issuesSolved: [
      "Created a reusable base structure for network and repository layers to reduce boilerplate.",
      "Handled deep link transitions across multiple app states and authentication flows.",
      "Introduced modular widgets to optimize rebuilds and state updates using Bloc.",
      "Integrated OTP login with fallback handling for poor internet and device-level issues.",
    ],
    learnings: [
      "Mastered implementation of the SOLID architecture in a real-world Flutter application.",
      "Gained hands-on experience using Bloc pattern effectively at scale.",
      "Enhanced understanding of GoRouter navigation and deep linking scenarios.",
      "Learned how to architect an app for performance and maintainability from the ground up.",
    ],
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="w-full  flex flex-col items-center">
      <TextBuilder text="Work" isMain={true} className="text-[30px] mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {works.map((work, idx) => (
          <div key={idx} className="h-full">
            <WorkCard
              companyName={work.companyName}
              companyLogo={work.companyLogo}
              projectName={work.projectName}
              description={work.description}
              techStack={work.techStack}
              iframeSrc={work.iframeSrc}
              overview={work.overview}
              objectivePoints={work.objectivePoints}
              challenges={work.challenges}
              issuesSolved={work.issuesSolved}
              learnings={work.learnings}
              fallbackImageSrc={work.fallbackImageSrc}
              fallbackImageSrcMobile={work.fallbackImageSrcMobile}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
