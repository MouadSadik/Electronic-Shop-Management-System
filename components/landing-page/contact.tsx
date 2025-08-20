"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    User,
    Send,
    Clock,
    ArrowRight
} from "lucide-react";

export default function FormulaireContact() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const infosContact = [
        {
            id: "phone",
            icon: Phone,
            title: "Téléphone",
            value: "+212 707 291 630",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            id: "email",
            icon: Mail,
            title: "Email",
            value: "contact@electroshop.ma",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        },
        {
            id: "location",
            icon: MapPin,
            title: "Adresse",
            value: "Settat, Maroc",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        }
    ];

    return (
        <div className="min-h-screen  p-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl mb-6 shadow-lg">
                        <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Contactez ElectroShop
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Une question ? Un projet ? Remplissez le formulaire ci-dessous,
                        nous vous répondrons sous 24 heures.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire de contact */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0 bg-white">
                            <CardContent className="p-10">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-primary mb-2">Envoyez-nous un message</h2>
                                    <p className="text-slate-600">Nous sommes à votre écoute pour tout besoin ou question.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                                                <User className="w-4 h-4" />
                                                Nom complet
                                            </label>
                                            <Input
                                                placeholder="Votre nom"
                                                className={` border-2 transition-all duration-200 ${focusedField === "name"
                                                    ? "border-slate-900 shadow-lg"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                                onFocus={() => setFocusedField("name")}
                                                onBlur={() => setFocusedField(null)}
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                                                <Mail className="w-4 h-4" />
                                                Adresse Email
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="votre.email@example.com"
                                                className={` border-2 transition-all duration-200 ${focusedField === "email"
                                                    ? "border-slate-900 shadow-lg"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                                onFocus={() => setFocusedField("email")}
                                                onBlur={() => setFocusedField(null)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                                            <MessageCircle className="w-4 h-4" />
                                            Sujet
                                        </label>
                                        <Input
                                            placeholder="Sujet de votre message"
                                            className={` border-2 transition-all duration-200 ${focusedField === "subject"
                                                ? "border-slate-900 shadow-lg"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                            onFocus={() => setFocusedField("subject")}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                                            <MessageCircle className="w-4 h-4" />
                                            Message
                                        </label>
                                        <Textarea
                                            placeholder="Expliquez votre besoin ou posez-nous une question..."
                                            className={`min-h-36 border-2 resize-none transition-all duration-200 ${focusedField === "message"
                                                ? "border-slate-900 shadow-lg"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                            onFocus={() => setFocusedField("message")}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>

                                    <Button className="w-full   font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                                        <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                                        Envoyer le message
                                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-6">
                        {infosContact.map((item) => (
                            <Card
                                key={item.id}
                                className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${hoveredCard === item.id ? item.borderColor : "border-slate-200"
                                    }`}
                                onMouseEnter={() => setHoveredCard(item.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-primary text-lg mb-1">{item.title}</h3>
                                            <p className="text-slate-600 text-sm break-all">{item.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Temps de réponse */}
                        <Card className="border-2 border-amber-200 bg-amber-50 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shadow-md">
                                        <Clock className="w-6 h-6 m-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary text-lg mb-2">Réponse rapide</h3>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            Nous répondons à tous les messages sous 24h. En cas d'urgence, appelez-nous directement.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
