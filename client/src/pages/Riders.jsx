import React from 'react';
import { useGetAllUsersQuery } from '../slices/userApiSlice';
import Loader from '../components/shared/Loader';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

const RiderList = () => {
  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'userAdmin') {
    return <Navigate to="/hubs" replace />;
  }

  const { data: usersData, isLoading, error } = useGetAllUsersQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className='container'>
          <h1 className='text-xl font-semibold mb-6'>Riders</h1>
          <p>Failed to load riders.</p>
        </div>
      </div>
    );
  }

  const riders =
    usersData?.users?.filter((user) => {
      if (Array.isArray(user.role)) {
        return user.role.includes('rider');
      }
      return user.role === 'rider';
    }) || [];

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className='container'>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className='text-xl font-semibold '>All Riders</h1>
          <div className="flex gap-2 flex-wrap">
          {(userRole === 'rider' ) ? (
            <Link to="/rider-entry" className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>Add delivery report</Link>
          ) : ''}
          {(userRole === 'staff' || userRole === 'admin' || userRole === 'superAdmin') ? (
            <Link to="/rider-compare" className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>Compare Report</Link>
          ) : ''}
          {(userRole === 'staff' || userRole === 'admin' || userRole === 'superAdmin') ? (
            <Link to="/allriders" className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>All riders Stock</Link>
          ) : ''}
          {(userRole === 'staff' || userRole === 'admin' || userRole === 'superAdmin') ? (
            <Link to="/riders/addstock" className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>Add Rider Stock</Link>
          ) : ''}
          </div>
          

        </div>

        {riders.length === 0 ? (
          <p>No riders found.</p>
        ) : (
          <div className='flex flex-col gap-4'>
            {riders.map((rider) => (
              <div
                key={rider._id}
                className='border border-gray-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
              >
                <div>
                  <h2 className='text-lg font-semibold'>
                    {rider.firstName} {rider.lastName}
                  </h2>

                  {rider.phone && (
                    <p className='text-sm text-gray-300'>
                      Phone: {rider.phone}
                    </p>
                  )}
                  <p className='text-sm text-gray-300'>
                    Status: {rider.status}
                  </p>
                </div>

                <div>
                  {(userRole !== "rider" || rider._id === userId) ? (
                    <Link
                      to={`/riders/${rider._id}`}
                      className="inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold"
                    >
                      See Stock Details
                    </Link>
                  ) : (
                    <span className="inline-block rounded px-6 py-2 bg-gray-500 cursor-not-allowed font-semibold opacity-60">
                      Not Allowed
                    </span>
                  )}
                </div>



                {/* <div>
                  <Link
                    to={`/riders/${rider._id}`}
                    className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'
                  >
                    See Stock Details
                  </Link>
                </div> */}



              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderList;