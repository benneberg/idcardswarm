/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-end border-b-2 border-[#1A1A1A] pb-6 mb-12">
      <div className="max-w-xl">
        <p className="text-xs font-mono uppercase tracking-[0.3em] mb-2 opacity-60">Project Index / Core Identities</p>
        <h1 className="text-7xl font-serif italic tracking-tighter leading-none">
          Persona <span className="not-italic font-extrabold text-9xl leading-[0.5] block mt-4">SWARM</span>
        </h1>
      </div>
      <div className="text-right hidden md:block">
        <p className="font-mono text-sm uppercase">Issue 012 / v.2024</p>
        <p className="font-serif italic text-2xl">The Human Element</p>
      </div>
    </header>
  );
};
