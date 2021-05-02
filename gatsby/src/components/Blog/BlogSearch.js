/* src/components/search-form.js */
import React, { useState, useRef } from "react"
import { navigate } from "gatsby"
const BlogSearch = ({ initialQuery = "" }) => {
  const handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(e.target);
    const q = data.get('search');
    navigate(`/blog?q=${q}`);
  }
  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
          <input name="search" type="text" className="form-control" placeholder="Search..." />
          <button type="submit" className="btn">
              <i className='bx bx-search-alt'></i>
          </button>
      </form>
    </div>
  )
}
export default BlogSearch

