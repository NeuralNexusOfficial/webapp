/** Characters allowed in project title (letters, numbers, spaces, basic punctuation). */
const TITLE_PATTERN = /^[a-zA-Z0-9\s.'\-,()&]+$/

/** Characters allowed in description (includes newlines and common sentence punctuation). */
const DESCRIPTION_PATTERN = /^[a-zA-Z0-9\s.,'"\-!?():;&\n\r]+$/

const TITLE_STRIP = /[^a-zA-Z0-9\s.'\-,()&]/g
const DESCRIPTION_STRIP = /[^a-zA-Z0-9\s.,'"\-!?():;&\n\r]/g

export function sanitizeTitleInput(value: string): string {
  return value.replace(TITLE_STRIP, '')
}

export function sanitizeDescriptionInput(value: string): string {
  return value.replace(DESCRIPTION_STRIP, '')
}

export function validateTitle(title: string): string | null {
  const trimmed = title.trim()
  if (!trimmed) return 'Project title is required.'
  if (trimmed.length < 3) return 'Title must be at least 3 characters.'
  if (trimmed.length > 120) return 'Title must be 120 characters or fewer.'
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Title must include at least one letter.'
  }
  if (!TITLE_PATTERN.test(trimmed)) {
    return 'Title can only contain letters, numbers, spaces, and basic punctuation (. , \' - ( ) &).'
  }
  if (/^[\d\s.'\-,()&]+$/.test(trimmed)) {
    return 'Title cannot be numbers or symbols only.'
  }
  return null
}

export function validateDescription(description: string): string | null {
  const trimmed = description.trim()
  if (!trimmed) return 'Description is required.'
  if (trimmed.length < 10) return 'Description must be at least 10 characters.'
  if (trimmed.length > 1000) return 'Description must be 1000 characters or fewer.'
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Description must include at least one letter.'
  }
  if (!DESCRIPTION_PATTERN.test(trimmed)) {
    return 'Description can only contain letters, numbers, spaces, line breaks, and standard punctuation.'
  }
  if (/^[\d\s.,'"\-!?():;&\n\r]+$/.test(trimmed)) {
    return 'Description cannot be numbers or symbols only.'
  }
  return null
}

export function validateSubmissionTextFields(
  title: string,
  description: string,
): { title?: string; description?: string } {
  const titleError = validateTitle(title)
  const descriptionError = validateDescription(description)
  const errors: { title?: string; description?: string } = {}
  if (titleError) errors.title = titleError
  if (descriptionError) errors.description = descriptionError
  return errors
}
