import { NavLink } from "react-router-dom"


export function MainNav() {

  return (
    <section className="main-nav">
      <nav>
        <NavLink to="/">
          <img src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1748084185/4aae4ed7-5939-4e76-b100-e69440ebeae4.png_im_w_240_1_pqzuzd_c_crop_w_150_h_150_ar_1_1_qjc2ne.avif" alt="" />
          <span>Homes</span>
        </NavLink>
        <NavLink to="/experiences">
          <img src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1748084185/1e24b1c9-b070-48d9-8a70-91aae3151830.png_im_w_240_jl7vw2_c_crop_w_150_h_150_ar_1_1_d5vdwf.avif" alt="" />
          <span>Experiences</span>
        </NavLink>
        <NavLink to="/services">
          <img src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1748084185/2bf5d36d-e731-4465-a8ef-91abbf2ae8ce.png_im_w_240_ruptgq_c_crop_w_150_h_150_ar_1_1_cnakpm.avif" alt="" />
          <span>Services</span>
        </NavLink>
      </nav>
    </section >
  )
}