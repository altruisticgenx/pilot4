-- Create pilot_inquiries table for contact form submissions
CREATE TABLE pilot_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  role text NOT NULL,
  project_description text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'pilot_started', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on pilot_inquiries
ALTER TABLE pilot_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit inquiries
CREATE POLICY "Anyone can submit inquiries"
  ON pilot_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view inquiries (for admin dashboard later)
CREATE POLICY "Authenticated users can view inquiries"
  ON pilot_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create experiments table for the Experiment Board
CREATE TABLE experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  hypothesis text NOT NULL,
  status text NOT NULL CHECK (status IN ('now_shipping', 'seeking_partners', 'shelved')),
  domain text NOT NULL CHECK (domain IN ('energy', 'education', 'civic', 'startup', 'data_infrastructure')),
  tags text[] DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  demo_url text,
  repo_url text,
  ethics_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Enable RLS on experiments (public read-only)
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiments are publicly readable"
  ON experiments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_pilot_inquiries_updated_at
  BEFORE UPDATE ON pilot_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at
  BEFORE UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed experiment data
INSERT INTO experiments (title, hypothesis, status, domain, tags, metrics, demo_url, repo_url, ethics_note) VALUES
  (
    'Campus Energy Dashboard',
    'Energy telemetry + AI narrative generation can reduce grant prep time by 60% for sustainability teams.',
    'now_shipping',
    'energy',
    ARRAY['time-series', 'dashboards', 'grant-writing'],
    '{"sites": 3, "uptime": "99.9%", "grant_success_rate": "85%"}',
    'https://demo.energydashboard.example.com',
    'https://github.com/altruisticx/energy-narrative',
    'Explainable models only; no predictive surveillance on building occupancy.'
  ),
  (
    'EdTech Student-Partner Matcher',
    'Privacy-preserving matching can save teachers 5+ hours/week while improving student placement quality.',
    'seeking_partners',
    'education',
    ARRAY['NLP', 'privacy', 'matching'],
    '{"pilot_schools": 2, "avg_time_saved": "5.2 hrs/week"}',
    NULL,
    NULL,
    'Human review required for all matches; FERPA-compliant; no profiling of minors.'
  ),
  (
    'Civic Sensing with Audit Trails',
    'Transparent consent + audit logging can enable ethical civic data collection at scale.',
    'seeking_partners',
    'civic',
    ARRAY['ethics', 'privacy', 'dashboards'],
    '{}',
    NULL,
    NULL,
    'Explicit consent required; no facial recognition; full audit trail published quarterly.'
  ),
  (
    'Rapid MVP Builder for Impact Startups',
    'Week-by-week sprints can validate impact startup core value in <4 weeks.',
    'now_shipping',
    'startup',
    ARRAY['prototyping', 'CI/CD'],
    '{"pilots_run": 12, "avg_delivery": "3.8 weeks"}',
    NULL,
    'https://github.com/altruisticx/mvp-template',
    'Full code ownership; no vendor lock-in.'
  ),
  (
    'FERPA-compliant Data Pipeline',
    'Automated anonymization can reduce compliance review time by 40% for institutional data teams.',
    'shelved',
    'data_infrastructure',
    ARRAY['ETL', 'compliance', 'privacy'],
    '{}',
    NULL,
    NULL,
    'Paused due to lack of partner demand; reached out to 8 institutions, 0 commitments.'
  ),
  (
    'Human-in-the-Loop Review Dashboard',
    'Model suggestions + mandatory human review can improve decision quality by 30% vs. pure automation.',
    'now_shipping',
    'education',
    ARRAY['dashboards', 'human-in-loop', 'NLP'],
    '{"users": 24, "review_time": "2.3 min/case"}',
    'https://demo.review-dashboard.example.com',
    NULL,
    'All AI suggestions require human approval; training materials provided.'
  );