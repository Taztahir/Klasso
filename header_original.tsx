import { Bell, Plus, X } from 'lucide-react';
import { DashboardView, UserProfile } from './types';

interface DashboardHeaderProps {
    currentView: DashboardView;
    userData: UserProfile;
    onEditProfile: () => void;
    onStartSession: () => void;
    onCloseWorkspace: () => void;
    onToggleNotifications: () => void;
    hasUnread: boolean;
}

export const DashboardHeader = ({
    currentView,
    userData,
    onEditProfile,
    onStartSession,
    onCloseWorkspace,
    onToggleNotifications,
    hasUnread
}: DashboardHeaderProps) => {
    return (
        <header className="dash-header bg-cream">
            <div className="welcome-section">
                <p>{currentView === 'overview' ? 'Hey, Study Buddy! ≡ƒæï' : 'Session Workspace'}</p>
                <h1>{currentView === 'overview' ? 'Ready to Ace?' : 'Notes to Insights'}</h1>
            </div>

            <div className="header-actions">
                {currentView === 'overview' ? (
                    <button className="new-session-btn" onClick={onStartSession}>
                        <Plus size={16} />
                        <span>New Session</span>
                    </button>
                ) : (
                    <button className="action-btn outline flex items-center gap-2" onClick={onCloseWorkspace}>
                        <X size={16} />
                        <span>Close Workspace</span>
                    </button>
                )}

                <button className="notification-btn relative" onClick={onToggleNotifications}>
                    <Bell size={20} />
                    {hasUnread && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-black rounded-full" />
                    )}
                </button>

                <div className="profile-chip group cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all" onClick={onEditProfile}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatarSeed}`} alt={userData.name} className="profile-avatar border-black group-hover:border-dash-primary transition-colors" />
                    <div className="profile-info">
                        <span className="profile-name">{userData.name}</span>
                        <span className="profile-handle group-hover:text-dash-primary transition-colors">{userData.handle}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
