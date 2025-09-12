import React from "react"
import dayjs from 'dayjs'

const ActivityLogItem = ({ logs = [] }) => {
  console.log("Logs", logs)

  return (
    <>
      {logs.map((log, idx) => {


        const formattedDate = dayjs(log.createdAt).format('DD/MM/YY - h:mm:ss a')

        
        return (
          <div key={idx} className="w-full border border-white shadow-md rounded-xl p-4 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition">
            {/* Left side: User + Action */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-semibold ">{log.user?.username}</span>
              <span className="hidden sm:inline mx-2 text-gray-400">•</span>
              <span className="text-sm  font-medium">{log.action}</span>
              <span className="hidden sm:inline mx-2 ">•</span>
              <span className="text-sm font-medium">{log?.hub?.name}</span>
            </div>

            {/* Right side: Time */}
            <div className="mt-1 sm:mt-0">
              {formattedDate}
            </div>
          </div>
        )

      })}
    </>
  )
}

export default ActivityLogItem
