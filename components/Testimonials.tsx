import { TESTIMONIALS } from '@/lib/testimonials'

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null
  return (
    <section className="pub-testimonials" aria-label="What readers say">
      <div className="pub-wrap">
        <p className="pub-label" style={{ marginBottom: '12px' }}>What readers say</p>
        <h2 className="pub-heading" style={{ marginBottom: '40px', maxWidth: '640px' }}>
          Trusted by curious readers, not just clickers.
        </h2>
        <div className="pub-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="pub-testimonial">
              <blockquote className="pub-testimonial-quote">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="pub-testimonial-attr">
                <span className="pub-testimonial-name">{t.name}</span>
                {t.role && <span className="pub-testimonial-role">{t.role}</span>}
                {t.handle && <span className="pub-testimonial-handle">{t.handle}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
