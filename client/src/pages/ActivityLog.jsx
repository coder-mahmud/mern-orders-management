import React, { useState, useEffect } from 'react'
import { useGetAllQuery } from '../slices/activityApiSlice'
import Logs from '../components/activitiesLogs/Logs'

const ActivityLog = () => {
  const [activities, setActivities] = useState([])

  const {data, isLoading, isError }  = useGetAllQuery()

  useEffect(() => {
    if (data && data.logs) {   // ✅ guard against undefined
      setActivities(data.logs)
    }
  },[data])

  if(data){
    // console.log("data",data)
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Something went wrong!</p>
  }

  if (!data || !data.logs) {
    return <p>No activities found.</p>
  }

  console.log("Activities", activities)



  return (

    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className="container">
        <h1 className='text-xl font-semibold mb-6'>Activity Logs:</h1>
        <div><Logs logs ={activities} /> </div>
      </div>
    </div>



    
  )
}

export default ActivityLog