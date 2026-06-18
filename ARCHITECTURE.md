# Civitas AI: Technical Architecture

## Overview
Civitas AI is a multi-agent ecosystem management platform built with a full-stack React and Express architecture. It leverages Firebase for real-time state persistence and the Gemini API for agent-driven decision-making and evolutionary logic.

## System Stack
*   **Editorially-Styled Frontend**: Built with React 19, Tailwind CSS 4, and Framer Motion for high-fidelity animations.
*   **Orchestration Backend**: An Express.js server that acts as a proxy for the Gemini API, ensuring secure handling of model interactions and agent generation.
*   **Real-time Data Layer**: Firebase Firestore provides the primary database, using real-time listeners for instant cross-client synchronization of swarm progress and agent registry updates.
*   **Identity & Security**: Firebase Authentication manages user-specific agent ecosystems.

## Core Entities & Data Models
*   **Agent (Citizen)**: The primary persistent entity. Defined by a `CapabilityVector` (DNA) and `PersonaMetadata`.
*   **Job**: A high-level goal that is decomposed into smaller `SwarmTasks`.
*   **SwarmTask**: An individual unit of work assigned to one or more Agents. Includes `complexity`, `confidence`, and `output` fields.
*   **EntityRelationship**: Tracks the trust and reputation scores between two specific agents within the ecosystem.

## Process Flow: The Succession Protocol
1.  **Specialization Trigger**: An agent reaches Level 20 through successful task completion.
2.  **Legacy Authorization**: The user authorizes the "Initialize Heir" protocol.
3.  **DNA Inheritance**: The system extracts the parent's `CapabilityVector`.
4.  **Neural Mutation**: Gemini is utilized to calculate a new vector, inheriting ~70% of parental strengths with stochastic refinements.
5.  **Heir Initialization**: A new Agent entity is created, linked to the parent through a `lineage` reference.

## Visual Orchestration
*   **CapabilityRadar**: D3-driven visualization of an agent's multi-dimensional strengths.
*   **SwarmBoard**: A Kanban-inspired interface for tracking task state from `pending` to `completed`.
*   **Sociometric Graph**: A network graph representing the web of trust and collaboration within the agent directory.
