"use client";

import React from "react";
import { ProfilePicture } from "./profile-picture";
import { ProfileForm } from "./profile-form";

export function ProfileLayout() {
  return (
    <div className="mt-8">
      <div className="bg-surface border border-outline-variant/20 rounded-[32px] p-8 shadow-sm">
        <div className="space-y-8">
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
      </div>
    </div>
  );
}
