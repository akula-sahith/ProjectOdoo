import React from 'react';

export const StatusBadge = ({ status }) => {
  let bgClass = 'bg-gray-100 text-gray-800';
  
  switch (status?.toLowerCase()) {
    case 'available':
      bgClass = 'bg-green-100 text-green-800 border border-green-200';
      break;
    case 'allocated':
      bgClass = 'bg-blue-100 text-blue-800 border border-blue-200';
      break;
    case 'maintenance':
      bgClass = 'bg-orange-100 text-orange-800 border border-orange-200';
      break;
    case 'lost':
      bgClass = 'bg-red-100 text-red-800 border border-red-200';
      break;
    case 'disposed':
      bgClass = 'bg-gray-200 text-gray-800 border border-gray-300';
      break;
    case 'reserved':
      bgClass = 'bg-purple-100 text-purple-800 border border-purple-200';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bgClass}`}>
      {status}
    </span>
  );
};

export const ConditionBadge = ({ condition }) => {
  let bgClass = 'bg-gray-100 text-gray-800';
  
  switch (condition?.toLowerCase()) {
    case 'excellent':
      bgClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      break;
    case 'good':
      bgClass = 'bg-sky-100 text-sky-800 border border-sky-200';
      break;
    case 'fair':
      bgClass = 'bg-amber-100 text-amber-800 border border-amber-200';
      break;
    case 'poor':
      bgClass = 'bg-rose-100 text-rose-800 border border-rose-200';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${bgClass}`}>
      {condition}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  let bgClass = 'bg-gray-100 text-gray-800';
  
  switch (priority?.toLowerCase()) {
    case 'high':
      bgClass = 'bg-red-100 text-red-700 border border-red-200';
      break;
    case 'medium':
      bgClass = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      break;
    case 'low':
      bgClass = 'bg-green-100 text-green-700 border border-green-200';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${bgClass}`}>
      {priority}
    </span>
  );
};
