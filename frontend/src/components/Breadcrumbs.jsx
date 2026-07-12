import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Helper to format labels
  const formatLabel = (path) => {
    // If it looks like an asset tag (AF-XXXX)
    if (path.toUpperCase().startsWith('AF-')) {
      return path.toUpperCase();
    }
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const filteredPathnames = pathnames.filter((x) => x !== 'dashboard');

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-medium" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Dashboard</span>
      </Link>

      {filteredPathnames.map((value, index) => {
        const last = index === filteredPathnames.length - 1;
        const to = `/${pathnames.slice(0, pathnames.indexOf(value) + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-350 shrink-0" />
            {last ? (
              <span className="text-slate-800 font-semibold">{formatLabel(value)}</span>
            ) : (
              <Link to={to} className="hover:text-blue-600 transition-colors">
                {formatLabel(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumbs;
