import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, CalendarDays, GitCompareArrows, Trophy, Medal, Zap, Rocket, Target, ListChecks, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { currentUser } from '../../data/mockData';
import Logo from '../common/Logo';
import Streak from './Streak';
import ContributionCalendar from './ContributionCalendar';
import Compare from './Compare';
import Leaderboard from './Leaderboard';
import RankingSystem from './RankingSystem';
import XpSystem from './XpSystem';
import Boosters from './Boosters';
import Missions from './Missions';
import styles from './DashboardLayout.module.css';

// =========================================================================
// Dashboard — futuristic gamified coding hub (Pulse palette).
//
// Sidebar nav switches the active feature panel. Layout is responsive:
// sidebar collapses to a top bar on small screens. The header surfaces the
// user's XP/level at all times so progression is always visible.
// =========================================================================

const NAV = [
  { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { id: 'streak',     label: 'Streak',     icon: Flame },
  { id: 'calendar',   label: 'Calendar',   icon: CalendarDays },
  { id: 'compare',    label: 'Compare',    icon: GitCompareArrows },
  { id: 'leaderboard',label: 'Leaderboard',icon: Trophy },
  { id: 'ranking',    label: 'Ranking',    icon: Medal },
  { id: 'xp',         label: 'XP',         icon: Zap },
  { id: 'boosters',   label: 'Boosters',   icon: Rocket },
  { id: 'missions',   label: 'Missions',   icon: Target },
];

export default function Dashboard() {
  const [active, setActive] = useState('overview');
  const navigate = useNavigate();
  const { user, exit } = useAuth();

  const handleSignOut = () => {
    exit();
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo variant="pulse" size="md" />
        </div>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setActive(item.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="navActive"
                    className={styles.navActiveBg}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={18} className={styles.navIcon} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button className={styles.signOut} onClick={handleSignOut}>
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.greeting}>Welcome back,</span>
            <h1 className={styles.userName}>{user?.name || currentUser.name}</h1>
          </div>
          <div className={styles.headerRight}>
            <XpSystem compact />
          </div>
        </header>

        <motion.section
          key={active}
          className={styles.content}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {active === 'overview' && <OverviewPanel />}
          {active === 'streak' && <Streak />}
          {active === 'calendar' && <ContributionCalendar />}
          {active === 'compare' && <Compare />}
          {active === 'leaderboard' && <Leaderboard />}
          {active === 'ranking' && <RankingSystem />}
          {active === 'xp' && <XpSystem />}
          {active === 'boosters' && <Boosters />}
          {active === 'missions' && <Missions />}
        </motion.section>
      </div>
    </div>
  );
}

// Overview = a curated grid of flagship widgets so the hub feels alive.
function OverviewPanel() {
  return (
    <div className={styles.overviewGrid}>
      <Streak compact />
      <XpSystem compact />
      <RankingSystem compact />
      <Missions compact />
    </div>
  );
}
