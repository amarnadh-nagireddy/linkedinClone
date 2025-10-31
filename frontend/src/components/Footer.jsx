import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 py-4 text-center text-sm text-slate-300">
      <p>@TieIn {new Date().getFullYear()}</p>
    </footer>
  )
}

export default Footer