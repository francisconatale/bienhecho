# Feature Specification: Arquitectura de Interpretación de Tareas por Chat

**Feature Branch**: `001-voice-task-arch`

**Created**: 2026-08-08

**Status**: Draft

**Input**: User description: "Arquitectura de interpretación de tareas por voz..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chat Input Parsing (Priority: P1)

As a user, I want to describe a task naturally using text chat, so that the system correctly understands my intent and the task parameters without requiring rigid commands.

**Why this priority**: Core value proposition. Without correctly parsing the user's intent, the system cannot function.

**Independent Test**: Can be fully tested by submitting a text chat string and verifying the parsed JSON output from the LLM.

**Acceptance Scenarios**:

1. **Given** a user input like "Necesito cambiar seis tomas de corriente"
   **When** the LLM processes it
   **Then** the output should be structured JSON indicating intent "add_work" and workItems "Cambiar tomas de corriente", quantity 6.

### User Story 2 - Clarification Flow (Priority: P2)

As a user, I want the system to ask for missing information if my initial instruction was incomplete, so that I don't have to remember all required fields upfront.

**Why this priority**: Essential for handling incomplete instructions gracefully without failing the entire process.

**Independent Test**: Can be tested by providing an incomplete instruction, verifying the backend queues a clarification request, and processing a follow-up answer correctly.

**Acceptance Scenarios**:

1. **Given** the backend has a task missing the "quantity" field
   **When** the user responds "Son seis"
   **Then** the LLM outputs an update resolving the pending field with value 6, and the backend advances the workflow.

### User Story 3 - Retry Logic and Limits (Priority: P3)

As a system administrator, I want the system to limit clarification attempts, so that the user isn't stuck in an endless loop if the LLM cannot parse their response.

**Why this priority**: Prevents frustrating UX and infinite loops.

**Independent Test**: Can be tested by simulating 3 failed clarification responses and verifying the backend halts the clarification request and transitions to manual intervention or proceeds with partial data.

**Acceptance Scenarios**:

1. **Given** a pending clarification request at 2 attempts
   **When** the user provides an invalid response, incrementing to 3 attempts
   **Then** the system blocks further requests and transitions state accordingly.

### Edge Cases

- What happens when the user provides conflicting information in a follow-up?
- How does the system handle an entirely unrelated user response during a clarification phase?
- What happens if the LLM output is malformed or invalid JSON?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST separate LLM parsing from workflow state management. The LLM MUST NOT manage state, retries, or queues.
- **FR-002**: The LLM MUST output structured JSON representing user intent, extracted data, or field updates.
- **FR-003**: The backend MUST manage a state object containing current phase, tasks, and clarification queues.
- **FR-004**: The backend MUST maintain a queue of missing information (Clarification Requests) per task.
- **FR-005**: The backend MUST maintain a retry counter for clarifications and apply business rules upon reaching the limit.
- **FR-006**: The backend MUST route follow-up responses to the LLM providing only the context of the currently pending clarification request, not the entire conversation history.
- **FR-007**: The system MUST uniquely identify tasks and clarification fields internally (e.g., taskId) rather than relying on natural language matching.
- **FR-008**: The backend MUST control state transitions (e.g., RECEIVING -> INTERPRETING -> PENDING).

### Key Entities

- **Task**: Represents a unit of work. Contains properties like `taskId`, `description`, `location`, `quantity`.
- **ClarificationRequest**: Represents missing information required to complete a task. Properties: `taskId`, `field`, `attempts`, `status`.
- **WorkflowState**: The overarching state of the conversation. Properties: `phase`, list of `tasks`, `clarificationQueue`, `activePendingItem`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: System successfully extracts intent and entities from natural language instructions with an accuracy of > 90%.
- **SC-002**: Clarification responses require passing only the current pending context to the LLM, reducing average token usage per turn by at least 50% compared to passing full conversation history.
- **SC-003**: Backend successfully transitions state deterministically 100% of the time based on LLM JSON output.
- **SC-004**: System terminates clarification loops after a configured maximum number of attempts (e.g., 3).

## Assumptions

- We assume the input is primarily text provided via a chat interface. Voice integration (e.g., via an upstream Speech-to-Text service) is deferred for post-MVP.
- We assume the LLM is capable of reliably producing valid JSON outputs.
- We assume that "task" fields like quantity and location are known schemas defined in the backend.
