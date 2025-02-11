import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Button from '../components/Button';
import Close from '../assets/images/Close.svg'

const Hubs = () => {

  const userRole = useSelector(state => state.auth.userInfo.role);
  // console.log("userRole", userRole)

  const [showCreateHub, setShowCreateHub] = useState(false)

  const createHubHandler = () =>{
    console.log("Create hub clicked!")
    setShowCreateHub(true)
  }

  const hideCreateHubForm = () => {
    setShowCreateHub(false)
  }

  useEffect(() => {
    if (showCreateHub) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showCreateHub]);





  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className="container">
        
        <div className='hubs-header border-b border-gray-600 pb-4 flex justify-between items-center'>
          
          <p className="text-2xl font-semibold">Hubs</p>
          {(userRole == 'superadmin' || userRole == 'controller') && (
            <div onClick={createHubHandler}><Button text="Add New Hub"/></div>
          )}
                    
        </div>

        <div className="hubs_content py-6">

          <p className="text-xl">Hubs list will be here...</p>

          { showCreateHub && (
            <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-[150px] pb-24">
              <div className="flex justify-center items-center">
                <div className="modal_inner w-3xl max-w-[90%] bg-gray-600 text-white relative p-10 rounded">
                  <img onClick={hideCreateHubForm} className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
                  <form action="">
                    <div className="input_group">
                        Modal form here
                    </div>
                  </form>
                </div>
              </div>

            </div>
          )}
          




        </div>




      </div>
    </div>
    
  )
}

export default Hubs