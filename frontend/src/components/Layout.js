import React from "react";
import {Outlet, Link} from 'react-router-dom';
import "./Layout.css";

function Layout() {
    return (
        <div className="layout-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h3>Tahtam 2.0</h3>
                </div>
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/marketplaces">Pazaryerleri</Link></li>
                    <li><Link to="/stalls">Tahtalar</Link></li>
                    <li><Link to="/tenants">Kiracılar</Link></li>
                </ul>
            </nav>
            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;