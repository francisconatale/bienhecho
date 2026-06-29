"use client";

import React, { useState } from "react";
import { ProfilePicture } from "./profile-picture";
import { ProfileForm } from "./profile-form";
import { SecondaryActions } from "./secondary-actions";
import { DangerZone } from "./danger-zone";

export function ProfileLayout() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "seguridad", label: "Seguridad & Acciones" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 lg:sticky lg:top-24">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-left font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-md" 
                  : "text-on-surface hover:bg-surface-variant/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 bg-surface border border-outline-variant/20 rounded-[32px] p-8 min-h-[400px] shadow-sm relative overflow-hidden w-full">
        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">General</h2>
              <p className="text-on-surface-variant mb-6">Administra tus datos personales y de la empresa.</p>
            </div>
            
            <div className="max-w-2xl">
              <ProfilePicture />
            </div>

            <div className="max-w-2xl">
              <ProfileForm />
            </div>
          </div>
        )}

        {activeTab === "seguridad" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Seguridad y Acciones</h2>
              <p className="text-on-surface-variant mb-6">Configuraciones de seguridad de la cuenta.</p>
            </div>
            
            <div className="max-w-2xl space-y-8">
              <SecondaryActions />
              <DangerZone />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
