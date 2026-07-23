# Feature Specification: Company Logo on Invoices

**Feature Branch**: `[002-company-logo-invoices]`

**Created**: 2026-07-23

**Status**: Draft

**Input**: User description: "busca la documentacion de supabase, sobre buckets para almacenar el logo de cada empresa, tenes que analizar para modificar las facturas a partir de este mometno que se aparezca un logo tambien"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Company Logo (Priority: P1)

As a company user, I want to upload my company logo so that it can be displayed on all my generated invoices.

**Why this priority**: Without the ability to upload a logo, it's impossible to display it on the invoice. This is the foundational capability.

**Independent Test**: Can be fully tested by verifying that an image can be successfully uploaded and associated with the company profile.

**Acceptance Scenarios**:

1. **Given** I am a logged-in user on my company settings page, **When** I upload a valid image file as my logo, **Then** the logo is saved and displayed on my profile.
2. **Given** I am a logged-in user with an existing logo, **When** I upload a new logo, **Then** the old logo is replaced by the new one.
3. **Given** I am a logged-in user with an existing logo, **When** I click to remove the logo, **Then** the logo is deleted and a default placeholder is shown.

---

### User Story 2 - Logo on Invoices (Priority: P1)

As a company user, I want my uploaded logo to appear on all newly generated invoices so that they look professional and branded.

**Why this priority**: This is the primary business value of the feature, providing branded communication with clients.

**Independent Test**: Can be tested by generating an invoice after a logo has been uploaded and verifying the logo is present on the document.

**Acceptance Scenarios**:

1. **Given** my company has an uploaded logo, **When** I generate a new invoice, **Then** the invoice displays my company logo at the top.
2. **Given** my company does not have an uploaded logo, **When** I generate a new invoice, **Then** the invoice is generated normally without a logo (or with a default fallback).
3. **Given** I view a previously generated invoice, **When** I open it, **Then** it correctly renders the currently uploaded logo dynamically.

### Edge Cases

- What happens when a user attempts to upload a file that is not an image?
- What happens when the uploaded image exceeds the maximum file size?
- What happens when the uploaded image has an unusual aspect ratio?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to upload an image file (e.g., PNG, JPG) to be used as their company logo.
- **FR-002**: System MUST enforce a maximum file size of 2MB for logo uploads.
- **FR-003**: System MUST display the uploaded logo on the company profile/settings page.
- **FR-004**: System MUST include the company logo on all generated invoice documents.
- **FR-005**: System MUST allow users to delete or replace their existing company logo.
- **FR-006**: System MUST gracefully handle logo rendering on invoices if no logo has been uploaded.

### Key Entities

- **Company Profile**: Updated to include a reference to the uploaded logo file.
- **Invoice**: Updated to render the logo file referenced by the associated Company Profile.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully upload a company logo in under 1 minute.
- **SC-002**: 100% of newly generated invoices for companies with logos display the logo correctly formatted.
- **SC-003**: Logo uploads have a 99% success rate without errors or timeouts.

## Assumptions

- Users have basic technical knowledge to select and upload an image file.
- Standard image formats (PNG, JPG, JPEG) are supported.
- Invoices are generated dynamically and can incorporate the logo reference.
