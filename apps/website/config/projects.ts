export type Project = {
  /** Stable unique identifier (used as list key/anchor). */
  id: string;
  title: string;
  /**
   * Project period for display and sorting.
   * Use "MM.YYYY" format. Omit `end` for ongoing projects.
   */
  period: {
    /** Start date (e.g., "05.2025"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** Public URL (site, repository, demo, or video). */
  link: string;
  /** Github repository URL. */
  github?: string;
  /** Tags/technologies for chips or filtering. */
  skills: string[];
  /** Short one-line description for list view. */
  shortDescription?: string;
  /** Optional rich description; Markdown and line breaks supported. */
  description?: string;
  /** Logo image URL (absolute or path under /public). */
  logo?: string;
  /** Whether the project card is expanded by default in the UI. */
  isExpanded?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: 'syncc-executive-agent-os',
    title: 'Syncc Executive Agent OS',
    period: {
      start: '2023',
    },
    link: '/projects/syncc-executive-agent-os',
    github: 'https://github.com/bmoir23/syncc-liinkd-frontend',
    logo: 'https://www.google.com/s2/favicons?domain=liinkd.xyz&sz=128',
    skills: [
      'LangChain',
      'MCP Protocol',
      'n8n',
      'Next.js 15',
      'Supabase',
      'Cloudflare Workers',
      'AI Gateway',
      'Vector DB',
    ],
    shortDescription:
      'A production-grade multi-agent AI platform enabling enterprise autonomous task execution with human-in-the-loop oversight and AI Gateway routing.',
    description: `A production-grade multi-agent AI platform enabling enterprise autonomous task execution. Integrates LangChain orchestration, MCP servers, n8n automation, and vector retrieval, with configurable human-in-the-loop oversight, behavioral governance, and AI Gateway routing for cost and latency control.`,
    isExpanded: true,
  },
  {
    id: 'rag-document-qa-pipeline',
    title: 'RAG Document Q&A Pipeline',
    period: {
      start: '2024',
      end: '2024',
    },
    link: '/projects/rag-document-qa-pipeline',
    logo: 'https://www.google.com/s2/favicons?domain=liinkd.xyz&sz=128',
    skills: [
      'Python',
      'LangChain',
      'OpenAI Embeddings',
      'DeepEval',
      'Vector DB',
      'RAG',
    ],
    shortDescription:
      'A retrieval-augmented generation pipeline for high-fidelity enterprise knowledge extraction, built with a DeepEval-based evaluation framework.',
    description: `A retrieval-augmented generation pipeline for high-fidelity enterprise knowledge extraction, built with a DeepEval-based evaluation framework. Implements OpenAI embeddings, cosine-similarity search, and tuned chunking strategies for accurate, grounded document Q&A.`,
  },
  {
    id: 'structured-data-extraction-pipeline',
    title: 'Structured Data Extraction Pipeline',
    period: {
      start: '2024',
      end: '2024',
    },
    link: '/projects/structured-data-extraction-pipeline',
    logo: 'https://www.google.com/s2/favicons?domain=liinkd.xyz&sz=128',
    skills: ['AWS Lambda', 'Terraform', 'Python', 'CI/CD', 'Schema Validation'],
    shortDescription:
      'An MLOps-style pipeline that turns unstructured inputs into governed, schema-validated data outputs on AWS Lambda with Terraform IaC.',
    description: `An MLOps-style pipeline that turns unstructured inputs into governed, schema-validated data outputs. Runs on AWS Lambda with Terraform infrastructure-as-code, automated quality controls, and CI/CD deployment.`,
  },
  {
    id: 'mcp-enterprise-integration-layer',
    title: 'MCP Enterprise Integration Layer',
    period: {
      start: '2024',
      end: '2024',
    },
    link: '/projects/mcp-enterprise-integration-layer',
    logo: 'https://www.google.com/s2/favicons?domain=liinkd.xyz&sz=128',
    skills: ['MCP Protocol', 'TypeScript', 'Notion', 'Jira', 'ClickUp', 'Confluence'],
    shortDescription:
      'An integration layer built on the MCP server protocol connecting AI agents to Notion, Jira, ClickUp, and Confluence with governed access and audit logging.',
    description: `An integration layer built on the MCP server protocol that connects AI agents to Notion, Jira, ClickUp, and Confluence — enabling cross-system agentic orchestration with governed data access and full audit logging.`,
  },
];
