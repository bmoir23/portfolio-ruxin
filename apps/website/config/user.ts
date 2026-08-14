import { type Experience, experiences } from './experience';

export type User = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  location: string;
  domain: string;
  website?: string;
  description: string;
  jobTitle: string;
  twitterHandle: string;
  namePronunciationUrl: string;
  username: string;
  tagline: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    bluesky: string;
  };
  image: {
    profile: string;
  };
  flipSentences: string[];
  experiences?: Experience[];
  resumeUrl: string;
};

const USER: User = {
  firstName: 'Brian',
  lastName: 'Moir',
  name: 'Brian Moir',
  email: 'bmoirdev@gmail.com',
  domain: 'portfolio.brianmoir.dev',
  jobTitle: 'AI Solutions Architect',
  username: 'bmoir23',
  tagline:
    'AI Solutions Architect specializing in multi-agent systems, RAG pipelines, and enterprise AI orchestration.',
  twitterHandle: '',
  location: 'United States',
  description:
    "CTO & Principal AI Architect at Liink'd. I design production multi-agent platforms, RAG pipelines, and enterprise AI operating models — including evaluation, governance, observability, and scale-ready cloud deployment across GCP and Vertex AI.",
  namePronunciationUrl: '',
  resumeUrl:
    'https://docs.google.com/document/d/1b1bkDDj_6spetyCchz22X0rbsx7bbKB1bb2YbwD3JYI/edit?usp=sharing',
  social: {
    twitter: '',
    github: 'https://github.com/bmoir23',
    linkedin: 'https://linkedin.com/in/brian-moir',
    bluesky: '',
  },
  flipSentences: [
    'Multi-agent systems & RAG pipelines.',
    'Enterprise AI orchestration.',
    'LangChain, MCP, and n8n.',
    'Production agent platforms that ship.',
    'Governance, eval, and cost control.',
  ],
  image: {
    profile: 'https://portfolio.brianmoir.dev/brian-moir.png',
  },
  experiences: experiences,
};

USER.website = `https://${USER.domain}`;

export { USER };
