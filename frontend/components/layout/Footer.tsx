'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-xl">Aelvynor</h3>
                        <p className="text-sm text-white/60">
                            Building the future of digital experiences with cutting-edge technology and design.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Product</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/product" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Resources</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="http://localhost:8000/docs" target="_blank" className="hover:text-white transition-colors">API Reference</Link></li>
                            <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/about" className="hover:text-white transition-colors">Company</Link></li>
                            <li><Link href="/marketing/script" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <p>© 2025 Aelvynor. All rights reserved.</p>
                    <div className="flex gap-6 items-center">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        {/* Admin Login - Subtle but accessible */}
                        <Link 
                            href="/admin/login" 
                            className="hover:text-white transition-colors opacity-30 hover:opacity-60 text-xs px-2 py-1 border border-white/10 rounded hover:border-white/20"
                            title="Admin Login"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
