import { Link } from 'react-router-dom';

interface UnderConstructionPageProps {
  feature: string;
}

export default function UnderConstructionPage({ feature }: UnderConstructionPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-3">{feature} Coming Soon</h2>

        <p className="text-gray-600 mb-6">
          This feature is currently under construction. For now, only <strong>Army Roster Management</strong> is available.
        </p>

        <Link to="/armies" className="btn-primary inline-block">
          View My Armies
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Check back soon for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
