import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer className="footer footer-center bg-fuchsia-100 p-4 text-slate-900">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by Task Management Authorization</p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;