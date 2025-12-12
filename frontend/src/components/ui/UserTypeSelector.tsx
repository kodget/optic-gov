import React from 'react';

interface UserTypeSelectorProps {
  value: 'governor' | 'contractor';
  onChange: (value: 'governor' | 'contractor') => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">User Type</label>
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="governor"
            checked={value === 'governor'}
            onChange={(e) => onChange(e.target.value as 'governor' | 'contractor')}
            className="mr-2 text-primary-500"
          />
          <span className="text-gray-300">Governor</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="contractor"
            checked={value === 'contractor'}
            onChange={(e) => onChange(e.target.value as 'governor' | 'contractor')}
            className="mr-2 text-primary-500"
          />
          <span className="text-gray-300">Contractor</span>
        </label>
      </div>
    </div>
  );
};