import React from 'react'

const Button = ({ text, onclickHandler, classNames, bgColor }) => {
  return (
    <div 
      onClick={onclickHandler} 
      className={`${classNames} rounded px-6 py-2 ${bgColor || 'bg-amber-700 '} hover:bg-amber-800 cursor-pointer font-semibold`}
    >
      {text}
    </div>
  )
}

export default Button