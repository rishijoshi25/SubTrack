import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Home, List, Plus, LogOut, Menu, X} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps{
    userEmail?: string;
    onSignOut: () => void;
}

export default function Sidebar({userEmail, onSignOut}: SidebarProps){
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/subscriptions', icon: List, label: 'Subscriptions' },
        { path: '/add-subscription', icon: Plus, label: 'Add Subscription' },
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return(
        <>
            <button
                className='mobile-menu-button'
                onClick={toggleMobileMenu}
            >
                {isMobileOpen ? <X size={24} />: <Menu size={20} />}
            </button>

            {isMobileOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileOpen(false)}
                >
                </div>
            )}

            <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src="src/assets/imgs/subtrack_logo.png" alt="Subtrack Logo" className='logo-image' />
                        {isExpanded && <span className='logo-text'></span>}
                    </div>

                    <button
                        className='toggle-button desktop-only'
                        onClick={toggleSidebar}
                    >
                        <Menu size={14} />
                    </button>
                </div>

                <nav className='sidebar-nav'>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return(
                            <button
                                key={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleNavigation(item.path)}
                            >
                                <Icon size={20} className='nav-icon' />
                                {isExpanded && <span className='nav-label'>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {userEmail?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isExpanded && (
                            <div className="user-details">
                                <span className='user-email'>{userEmail || 'User'}</span>
                            </div>
                        )}
                    </div>

                    <button
                        className='sign-out-button'
                        onClick={onSignOut}
                        title='Sign out'
                    >
                        <LogOut size={20} />
                        {isExpanded && <span>Sign Out</span>}
                    </button>
                </div>

            </aside>

        </>
    )
}