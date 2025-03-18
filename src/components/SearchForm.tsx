import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { UserCheck, Search } from 'lucide-react';

function SearchForm() {
  const [firstName, setFirstName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { setUserInfo } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfo(firstName, mobileNumber);
    navigate('/map');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-indigo-600 flex items-center justify-center">
            <UserCheck size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">User Information</h2>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={20} />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">User Details</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit mobile number"
                placeholder="Enter 10 digits (e.g., 1234567890)"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a 10-digit mobile number without spaces or special characters
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue to Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
