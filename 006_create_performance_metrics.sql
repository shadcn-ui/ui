-- Migration: Create Performance Metrics Tables
-- Description: Tables for tracking sales performance, goals, and achievements
-- Date: 2025-11-11

-- Sales performance tracking table
CREATE TABLE IF NOT EXISTS sales_performance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Sales metrics
  leads_created INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  opportunities_created INTEGER DEFAULT 0,
  opportunities_won INTEGER DEFAULT 0,
  opportunities_lost INTEGER DEFAULT 0,
  quotations_sent INTEGER DEFAULT 0,
  quotations_accepted INTEGER DEFAULT 0,
  orders_created INTEGER DEFAULT 0,
  orders_completed INTEGER DEFAULT 0,
  
  -- Financial metrics
  total_revenue DECIMAL(14,2) DEFAULT 0,
  total_orders_value DECIMAL(14,2) DEFAULT 0,
  avg_deal_size DECIMAL(14,2) DEFAULT 0,
  
  -- Performance metrics
  conversion_rate DECIMAL(5,2) DEFAULT 0, -- Lead to order %
  win_rate DECIMAL(5,2) DEFAULT 0, -- Opportunities won %
  quotation_acceptance_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Activity metrics
  calls_made INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  meetings_held INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, period_type, period_start)
);

CREATE INDEX idx_sales_performance_user ON sales_performance(user_id);
CREATE INDEX idx_sales_performance_period ON sales_performance(period_start, period_end);

-- Goals and targets table
CREATE TABLE IF NOT EXISTS performance_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  target_value DECIMAL(14,2) NOT NULL,
  current_value DECIMAL(14,2) DEFAULT 0,
  achievement_percentage DECIMAL(5,2) DEFAULT 0,
  
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'missed', 'cancelled')),
  
  description TEXT,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_performance_goals_user ON performance_goals(user_id);
CREATE INDEX idx_performance_goals_period ON performance_goals(period_start, period_end);
CREATE INDEX idx_performance_goals_status ON performance_goals(status);

-- Team performance table
CREATE TABLE IF NOT EXISTS team_performance (
  id SERIAL PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('monthly', 'quarterly', 'yearly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  team_members INTEGER DEFAULT 0,
  total_revenue DECIMAL(14,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  avg_revenue_per_member DECIMAL(14,2) DEFAULT 0,
  
  top_performer_id INTEGER REFERENCES users(id),
  top_performer_revenue DECIMAL(14,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(team_name, period_type, period_start)
);

CREATE INDEX idx_team_performance_name ON team_performance(team_name);
CREATE INDEX idx_team_performance_period ON team_performance(period_start, period_end);

-- Achievement badges and milestones
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(50),
  achievement_value DECIMAL(14,2),
  achieved_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_user ON achievements(user_id);
CREATE INDEX idx_achievements_date ON achievements(achieved_at);

-- Performance metrics views
CREATE OR REPLACE VIEW user_performance_summary AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  COUNT(DISTINCT sp.id) as periods_tracked,
  SUM(sp.total_revenue) as lifetime_revenue,
  SUM(sp.orders_created) as total_orders,
  AVG(sp.conversion_rate) as avg_conversion_rate,
  AVG(sp.win_rate) as avg_win_rate,
  MAX(sp.total_revenue) as best_period_revenue,
  (SELECT COUNT(*) FROM achievements a WHERE a.user_id = u.id) as total_achievements
FROM users u
LEFT JOIN sales_performance sp ON sp.user_id = u.id
GROUP BY u.id, u.name;

CREATE OR REPLACE VIEW current_month_performance AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  COALESCE(sp.leads_created, 0) as leads_created,
  COALESCE(sp.opportunities_created, 0) as opportunities_created,
  COALESCE(sp.orders_created, 0) as orders_created,
  COALESCE(sp.total_revenue, 0) as revenue,
  COALESCE(sp.conversion_rate, 0) as conversion_rate,
  COALESCE(sp.win_rate, 0) as win_rate
FROM users u
LEFT JOIN sales_performance sp ON sp.user_id = u.id 
  AND sp.period_type = 'monthly'
  AND sp.period_start = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY sp.total_revenue DESC NULLS LAST;

CREATE OR REPLACE VIEW goal_achievement_status AS
SELECT 
  pg.id,
  pg.user_id,
  u.name as user_name,
  pg.goal_type,
  pg.period_type,
  pg.period_start,
  pg.period_end,
  pg.target_value,
  pg.current_value,
  pg.achievement_percentage,
  pg.status,
  CASE 
    WHEN pg.achievement_percentage >= 100 THEN 'Achieved'
    WHEN pg.achievement_percentage >= 75 THEN 'On Track'
    WHEN pg.achievement_percentage >= 50 THEN 'Behind'
    ELSE 'At Risk'
  END as performance_status,
  pg.description
FROM performance_goals pg
JOIN users u ON pg.user_id = u.id
WHERE pg.status = 'active'
ORDER BY pg.achievement_percentage DESC;

CREATE OR REPLACE VIEW top_performers_leaderboard AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  sp.total_revenue,
  sp.orders_created,
  sp.conversion_rate,
  sp.win_rate,
  RANK() OVER (ORDER BY sp.total_revenue DESC) as revenue_rank,
  RANK() OVER (ORDER BY sp.orders_created DESC) as orders_rank,
  RANK() OVER (ORDER BY sp.conversion_rate DESC) as conversion_rank
FROM users u
JOIN sales_performance sp ON sp.user_id = u.id
WHERE sp.period_type = 'monthly'
  AND sp.period_start = DATE_TRUNC('month', CURRENT_DATE);

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_performance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sales_performance_timestamp
  BEFORE UPDATE ON sales_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_performance_timestamp();

CREATE TRIGGER update_performance_goals_timestamp
  BEFORE UPDATE ON performance_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_performance_timestamp();

CREATE TRIGGER update_team_performance_timestamp
  BEFORE UPDATE ON team_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_performance_timestamp();

-- Function to calculate achievement percentage
CREATE OR REPLACE FUNCTION calculate_goal_achievement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_value > 0 THEN
    NEW.achievement_percentage = (NEW.current_value / NEW.target_value * 100)::DECIMAL(5,2);
    
    -- Auto-update status based on achievement
    IF NEW.achievement_percentage >= 100 THEN
      NEW.status = 'achieved';
    ELSIF NEW.period_end < CURRENT_DATE AND NEW.achievement_percentage < 100 THEN
      NEW.status = 'missed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_goal_achievement_trigger
  BEFORE INSERT OR UPDATE ON performance_goals
  FOR EACH ROW
  EXECUTE FUNCTION calculate_goal_achievement();

-- Insert sample data for testing (if users table exists)
-- Note: Uncomment if you want sample data
-- INSERT INTO sales_performance (user_id, period_type, period_start, period_end, leads_created, opportunities_created, orders_created, total_revenue, conversion_rate)
-- VALUES 
--   (1, 'monthly', '2025-11-01', '2025-11-30', 15, 8, 3, 15000.00, 20.00),
--   (2, 'monthly', '2025-11-01', '2025-11-30', 20, 12, 5, 22000.00, 25.00);

COMMENT ON TABLE sales_performance IS 'Tracks individual sales performance metrics over time';
COMMENT ON TABLE performance_goals IS 'Stores sales goals and targets for users';
COMMENT ON TABLE team_performance IS 'Aggregated team-level performance metrics';
COMMENT ON TABLE achievements IS 'Records achievements and milestones for gamification';
