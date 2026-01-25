import { type ReactNode } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./DashboardLayout.css"

interface dashboardLayoutProps{
    userEmail?: string;
    onSignOut: () => void;
    children?: ReactNode;
}

export default function DashboardLayout({userEmail, onSignOut, children}: dashboardLayoutProps){
    return (
        <div className="dashboard-layout">
            <Sidebar
                userEmail={userEmail}
                onSignOut={onSignOut}
            />
            <main className="main-content">{children}</main>
        </div>
    )
}