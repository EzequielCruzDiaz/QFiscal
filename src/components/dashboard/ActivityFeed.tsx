interface ActivityItem {
  id: string;
  description: string;
  time: string;
}

interface ActivityFeedProps {
  items?: ActivityItem[];
}

export default function ActivityFeed({ items = [] }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-sm font-semibold text-gray-300">Actividad reciente</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No hay facturas registradas aún</p>
      ) : (
        <ul className="divide-y divide-gray-800">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3">
              <p className="text-sm text-gray-300">{item.description}</p>
              <span className="whitespace-nowrap text-xs text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
