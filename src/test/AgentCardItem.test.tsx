import { render, screen } from '@testing-library/react';
import { AgentCardItem } from '../components/AgentCardItem';
import { AgentCard } from '../types';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

const mockAgent: AgentCard = {
  id: 'test-agent',
  role: 'Software Architect',
  mode: 'standard',
  skills: ['TypeScript', 'Testing'],
  behavior_rules: ['Always write clean code'],
  capability_vector: { coding: 90, logic: 85 },
  lifecycle_stage: 'collaboration',
  level: 5,
  exp: 500,
  reputation: 80,
  trustScore: 95,
  persona_metadata: {
    name: 'Alice Architect',
    bio: 'An expert in system design.',
    age: 32,
    occupation: 'Lead Architect',
    personality: { logic: 95, creativity: 80 },
    avatar_url: 'https://example.com/avatar.png'
  },
  userId: 'user-1'
} as any;

describe('AgentCardItem', () => {
  it('renders agent name and role', () => {
    render(<AgentCardItem agent={mockAgent} />);
    expect(screen.getByText('Alice Architect')).toBeInTheDocument();
  });

  it('renders reputation and trust score', () => {
    render(<AgentCardItem agent={mockAgent} />);
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<AgentCardItem agent={mockAgent} onSelect={onSelect} />);
    screen.getByText('Alice Architect').click();
    expect(onSelect).toHaveBeenCalledWith(mockAgent);
  });
});
