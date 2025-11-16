import { Building2, GraduationCap, Users, Rocket, Shield, Heart } from 'lucide-react';

export type Proposal = {
  name: string;
  audience: string;
  summary: string;
  outcome: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
};

export const proposals: Proposal[] = [
  {
    name: 'Grant-ready Energy Narrative',
    audience: 'Facilities & Sustainability Teams',
    summary: 'Turn campus energy telemetry into a grant-ready narrative and visualization.',
    outcome: '4-week prototype + data narrative and grant-ready technical appendix.',
    icon: Building2,
    gradient: 'from-pink-400 to-rose-400'
  },
  {
    name: 'Student-Partner Match Pilot',
    audience: 'EdTech Program Leads',
    summary: 'Automated, privacy-preserving matching to pair students and partners for projects.',
    outcome: 'Pilot with teacher review workflow and admin time metrics.',
    icon: GraduationCap,
    gradient: 'from-purple-400 to-pink-400'
  },
  {
    name: 'Civic Sensing with Guardrails',
    audience: 'Coalitions & Program Directors',
    summary: 'Deploy ethical sensing experiments with clear consent and audit trails.',
    outcome: 'Transparent pilot, policy-ready documentation, and risk assessment.',
    icon: Users,
    gradient: 'from-blue-400 to-purple-400'
  },
  {
    name: 'Rapid Startup Prototype',
    audience: 'Impact Startup Founders',
    summary: 'Build a demo that proves the core value prop without vendor lock-in.',
    outcome: 'Week-by-week prototype that you own and can iterate on.',
    icon: Rocket,
    gradient: 'from-rose-400 to-pink-400'
  },
  {
    name: 'Privacy-first Data Pipeline',
    audience: 'Institutional IT & Data Teams',
    summary: 'Secure ingestion, anonymization and governance for sensitive data.',
    outcome: 'Hardened ETL + docs for compliance (FERPA, procurement-ready).',
    icon: Shield,
    gradient: 'from-green-400 to-emerald-400'
  },
  {
    name: 'Human-in-the-loop Dashboard',
    audience: 'Teachers & Program Managers',
    summary: 'A dashboard that surfaces model suggestions but prioritizes human review.',
    outcome: 'Pilot dashboard + training materials for human reviewers.',
    icon: Heart,
    gradient: 'from-pink-400 to-purple-400'
  }
];
