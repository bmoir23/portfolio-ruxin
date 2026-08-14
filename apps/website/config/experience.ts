export type ExperiencePositionIcon =
  /** Icon key used to render the position category in the UI. */
  'code' | 'design' | 'education' | 'business' | 'idea';

export type ExperiencePosition = {
  id: string;
  title: string;
  /**
   * Employment period of the position.
   * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
   */
  employmentPeriod: {
    /** Start date (e.g., "10.2022" or "2020"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** Full-time | Part-time | Contract | Internship, etc. */
  employmentType?: string;
  description?: string;
  /** UI icon to represent the role type. */
  icon?: ExperiencePositionIcon;
  skills?: string[];
  /** Whether the position is expanded by default in the UI. */
  isExpanded?: boolean;
};

export type Experience = {
  id: string;
  companyName: string;
  companyUrl: string;
  city: string;
  /** URL to the company logo (absolute URL or path under /public). */
  companyLogo?: string;
  /** Roles held at this company; keep newest first for display. */
  positions: ExperiencePosition[];
  /** Marks the company as the current employer for highlighting. */
  isCurrentEmployer?: boolean;
};

export const experiences: Experience[] = [
  {
    id: 'liinkd',
    companyName: "Liink'd",
    companyUrl: 'https://get.liinkd.xyz/',
    city: 'Remote',
    companyLogo: 'https://www.google.com/s2/favicons?domain=liinkd.xyz&sz=128',
    isCurrentEmployer: true,
    positions: [
      {
        id: 'liinkd-cto',
        title: 'CTO & Principal AI Architect',
        employmentPeriod: { start: '01.2025' },
        employmentType: 'Full-time',
        icon: 'code',
        isExpanded: true,
        description:
          'Designed the Syncc Executive Agent OS — a production multi-agent platform built on LangChain orchestration, the MCP protocol, n8n agentic workflows, and vector database retrieval. Own product strategy, delivery execution, and the AI operating model: evaluation frameworks, governance controls, observability, and scale-ready deployment on GCP and Vertex AI.',
        skills: [
          'LangChain',
          'MCP Protocol',
          'n8n',
          'Next.js',
          'Supabase',
          'Cloudflare Workers',
          'Vertex AI',
          'RAG',
        ],
      },
    ],
  },
  {
    id: 'benzinga',
    companyName: 'Benzinga',
    companyUrl: 'https://www.benzinga.com/',
    city: 'Detroit, MI',
    companyLogo:
      'https://www.google.com/s2/favicons?domain=benzinga.com&sz=128',
    positions: [
      {
        id: 'benzinga-csm',
        title: 'Customer Success & Technical Solutions Manager',
        employmentPeriod: { start: '01.2020', end: '05.2023' },
        employmentType: 'Full-time',
        icon: 'business',
        description:
          'Owned technical solutions and customer success for a financial media and data platform. Translated product capabilities into delivery plans, unblocked enterprise integrations, and aligned cross-functional roadmaps from discovery to launch.',
        skills: [
          'Technical Solutions',
          'Customer Success',
          'SaaS',
          'Enterprise Delivery',
        ],
      },
    ],
  },
  {
    id: 'storetasker',
    companyName: 'Storetasker / Ask Lorem',
    companyUrl: 'https://www.storetasker.com/',
    city: 'Remote',
    companyLogo:
      'https://www.google.com/s2/favicons?domain=storetasker.com&sz=128',
    positions: [
      {
        id: 'storetasker-csm',
        title: 'Customer Success Manager & Project Manager',
        employmentPeriod: { start: '08.2018', end: '01.2020' },
        employmentType: 'Full-time',
        icon: 'business',
        description:
          'Ran delivery for Shopify and digital-commerce projects: scoping, vendor coordination, and launch execution. Bridged clients, engineers, and designers so work shipped on time without losing product intent.',
        skills: [
          'Project Management',
          'Customer Success',
          'eCommerce',
          'Delivery',
        ],
      },
    ],
  },
  {
    id: 'freelance',
    companyName: 'Freelance / Upwork',
    companyUrl: 'https://www.upwork.com/',
    city: 'Remote',
    companyLogo: 'https://www.google.com/s2/favicons?domain=upwork.com&sz=128',
    positions: [
      {
        id: 'freelance-eng',
        title:
          'Full-Stack Developer · AI/ML Enablement · Automation Engineer',
        employmentPeriod: { start: '01.2015' },
        employmentType: 'Contract',
        icon: 'code',
        description:
          'Ongoing independent work across full-stack product builds, digital marketing systems, AI/ML enablement, and automation/system flows for SaaS and enterprise clients.',
        skills: [
          'TypeScript',
          'Python',
          'Next.js',
          'Automation',
          'AI Enablement',
        ],
      },
    ],
  },
  {
    id: 'umd',
    companyName: 'University of Maryland',
    companyUrl: 'https://www.umd.edu/',
    city: 'College Park, MD',
    companyLogo: 'https://www.google.com/s2/favicons?domain=umd.edu&sz=128',
    positions: [
      {
        id: 'umd-bs',
        title: 'B.S. Computer Science — AI Engineering',
        employmentPeriod: { start: '2023', end: '05.2026' },
        employmentType: 'Education',
        icon: 'education',
        description:
          'Computer Science with a focus on AI engineering — agent systems, retrieval, and production ML infrastructure.',
        skills: ['Computer Science', 'AI Engineering'],
      },
    ],
  },
  {
    id: 'certifications',
    companyName: 'Certifications',
    companyUrl: 'https://www.credly.com/users/bmoir',
    city: 'Remote',
    companyLogo:
      'https://www.google.com/s2/favicons?domain=coursera.org&sz=128',
    positions: [
      {
        id: 'certs',
        title: 'Professional certificates',
        employmentPeriod: { start: '2023', end: '2026' },
        employmentType: 'Certification',
        icon: 'education',
        description:
          'Google AI Professional Certificate · Google DeepMind for Developers · Microsoft AI / ML · Google Project Management · IBM Cybersecurity (SkillShare / University of the People).',
        skills: [
          'Google AI',
          'DeepMind',
          'Microsoft AI/ML',
          'Project Management',
          'Cybersecurity',
        ],
      },
    ],
  },
];
