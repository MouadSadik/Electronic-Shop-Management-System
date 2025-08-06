"use client"
import React from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Copyright } from 'lucide-react';
import Link from 'next/link';


const Footer = () => {
    return (
        <footer className="bg-primary mt-10">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">À propos de nous</h3>
                        <p className="text-secondary text-sm">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam eos, voluptatum animi rem molestiae fugiat iure nostrum laudantium, unde debitis minima sapiente iusto placeat? Minima natus eveniet dolore nesciunt voluptatum?
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Categories </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/produits/categorie/2" className="text-secondary hover:text-white transition-colors duration-300">
                                    Pc Portable
                                </a>
                            </li>
                            <li>
                                <a href="/produits/categorie/7" className="text-secondary hover:text-white transition-colors duration-300">
                                    Gaming
                                </a>
                            </li>
                            <li>
                                <a href="/produits/categorie/3" className="text-secondary hover:text-white transition-colors duration-300">
                                    Smarthphone
                                </a>
                            </li>
                            <li>
                                <a href="/produits/categorie/1" className="text-secondary hover:text-white transition-colors duration-300">
                                    Les ecouteurs
                                </a>
                            </li>
                            <li>
                                <a href="/produits/categorie/8" className="text-secondary hover:text-white transition-colors duration-300">
                                    TV
                                </a>
                            </li>
                        </ul>
                    </div>
 
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-secondary" />
                                <a href="mailto:contact@electroshop.ma" className="text-secondary hover:text-white transition-colors duration-300">
                                    contact@electroshop.ma
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-secondary" />
                                <span className="text-secondary">+212 707 291 630</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-secondary" />
                                <span className="text-secondary">Settat, Maroc</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Suivez-nous</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-secondary hover:text-white transition-colors duration-300">
                                <Facebook className="w-6 h-6" />
                            </a>

                            <a href="#" className="text-secondary hover:text-white transition-colors duration-300">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-secondary hover:text-white transition-colors duration-300">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-violet-800 ">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-secondary text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start">
                            <Copyright className="h-4 w-4 mr-1" />
                            <span>2025 ElectroShop. Tous droits réservés.</span>
                        </div>
                        <div>
                            Créé par{' '}
                            <Link
                                href="https://www.linkedin.com/in/mouad-sadik-5b8907257/"
                                className="text-secondary hover:underline"
                                target="_blank"
                            >
                                Mouad Sadik
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer