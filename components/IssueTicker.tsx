export default function IssueTicker({ items }: { items: { num: string; title: string }[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <span className="ticker-item" key={i}><b>{it.num}</b>{it.title}</span>
        ))}
      </div>
    </div>
  )
}
