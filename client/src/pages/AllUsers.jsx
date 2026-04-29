import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../slices/userApiSlice';
import Loader from '../components/shared/Loader';

const AllUsers = () => {
  const [searchRole, setSearchRole] = useState('');

  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  const { data, isLoading, isError, error } = useGetAllUsersQuery();

  if (!userId) return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/hubs" replace />;

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="bg-gray-800 text-white min-h-[95vh] py-14">
        <div className="container">
          <p className="text-red-400">
            {error?.data?.message || 'Failed to load users.'}
          </p>
        </div>
      </div>
    );
  }

  const users = data?.users || data || [];

  // 🔍 Filter users by role
  const filteredUsers = users.filter((user) =>
    user.role?.toLowerCase().includes(searchRole.toLowerCase())
  );

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold">All Users</h1>
            <p className="text-gray-300 text-sm mt-1">
              Total users: {filteredUsers.length}
            </p>
          </div>

          {/* 🔍 Search Input */}
          <input
            type="text"
            placeholder="Search by role (e.g. admin, user)"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-md hover:border-amber-700 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {user.status || 'unknown'}
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="break-all">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Role</p>
                    <p className="inline-block bg-amber-700 text-white px-3 py-1 rounded mt-1 font-semibold">
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Token Version</p>
                    <p>{user.tokenVersion ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Created</p>
                    <p>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;