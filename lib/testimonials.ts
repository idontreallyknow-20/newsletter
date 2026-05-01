// Add reader testimonials here. The Testimonials component hides itself
// when this list is empty, so leaving it as [] is safe.
//
// Each testimonial:
//   quote: 1–3 sentences. Lead with the strongest line.
//   name:  reader's display name.
//   role:  job title or short descriptor (optional).
//   handle: optional social handle for proof; rendered as plain text.

export type Testimonial = {
  quote: string
  name: string
  role?: string
  handle?: string
}

export const TESTIMONIALS: Testimonial[] = []
