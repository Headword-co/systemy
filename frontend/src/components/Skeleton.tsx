export function SkeletonBlock({
  width = '100%',
  height = 16,
  borderRadius = 8,
}: {
  width?: string | number;
  height?: number;
  borderRadius?: number;
}) {
  return (
    <div
      className="animate-pulse bg-gray-200"
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: 15, border: '1px solid rgba(217, 217, 217, 0.30)' }}>
          <div className="animate-pulse bg-gray-200" style={{ height: 16, borderRadius: 8 }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <div
        className="animate-pulse bg-gray-200"
        style={{ height: 32, borderRadius: 8, marginBottom: 8 }}
      />
      <div
        className="animate-pulse bg-gray-200"
        style={{ height: 16, borderRadius: 8, width: '60%', margin: '0 auto' }}
      />
    </div>
  );
}
