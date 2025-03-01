import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const styles = {
        container: {
            
        },
        heading: {
            fontSize: '2.5em',
            color: '#333',
        },
        label: {
            display: 'block',
            marginTop: '20px',
            fontSize: '1.2em',
            color: '#555',
        },
        button: {
            marginTop: '30px',
            padding: '10px 20px',
            fontSize: '1em',
            color: '#fff',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        
      
    };

    return (
        <>
        <div className='home_box_container'>
        <div className='container'>
        <navbar className="text-white">
            <div className='logo navbar_logo'>Shipp Label Pro</div>
            <ul className='navbar-list'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Recharge</li>
                <li><button>Login</button></li>
            </ul>
        </navbar>
        
        <div className='main-box-content'>
            <h1 className='text-white'>Welcome to Ship Label</h1>
            <label className='text-white'>Pro</label>
            <button style={styles.button} onClick={() => navigate('/login')}>
                Login
            </button>
        </div>
        </div>
        </div>
<div className='container'>
        <div className='about_us'>
            <div className='about_left'>
            <h2  style={{marginBottom:"20px"}} class="text-primary">About Us</h2>

          <p style={{marginBottom:"20px"}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis deleniti reprehenderit animi est eaque corporis! Nisi, asperiores nam amet doloribus, soluta ut reiciendis. Consequatur modi rem, vero eos ipsam voluptas.</p>
          <p style={{marginBottom:"20px"}}>
           Error minus sint nobis dolor laborum architecto, quaerat. Voluptatum porro expedita labore esse velit veniam laborum quo obcaecati similique iusto delectus quasi!</p>

           <ul>
           <li style={{marginBottom:"10px"}}>Error minus sint nobis dolor</li>
           <li style={{marginBottom:"10px"}}>Error minus sint nobis dolor</li>
           <li style={{marginBottom:"10px"}}>Error minus sint nobis dolor</li>
           </ul>
           </div>
           <div className='about_right'><img src='https://preview.colorlib.com/theme/logis/images/img_3.jpg.webp'></img></div>
        </div>
        </div>

        <div className='work_style_container sec-distance' style={{padding:'60px 0px'}}>
            <div className='container'>
                <h2 style={{textAlign:'center'}}>How It Work</h2>
                <div class="row work_style_head" style={{position:"relative"}}>
          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="100">
            <div class="how-it-work-item">
              <span class="number">1</span>
              <div class="how-it-work-body">
                <h2>Make An Order</h2>
                <p class="mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt praesentium dicta consectetur fuga neque fugit a at. Cum quod vero assumenda iusto.</p>
                <ul class="ul-check list-unstyled success">
                  <li class="text-white">Error minus sint nobis dolor</li>
                  <li class="text-white">Voluptatum porro expedita labore esse</li>
                  <li class="text-white">Voluptas unde sit pariatur earum</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="200">
            <div class="how-it-work-item">
              <span class="number">2</span>
              <div class="how-it-work-body">
                <h2>Make A Payment</h2>
                <p class="mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt praesentium dicta consectetur fuga neque fugit a at. Cum quod vero assumenda iusto.</p>
                <ul class="ul-check list-unstyled success">
                  <li class="text-white">Error minus sint nobis dolor</li>
                  <li class="text-white">Voluptatum porro expedita labore esse</li>
                  <li class="text-white">Voluptas unde sit pariatur earum</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="300">
            <div class="how-it-work-item">
              <span class="number">3</span>
              <div class="how-it-work-body">
                <h2>Track Your Order</h2>
                <p class="mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt praesentium dicta consectetur fuga neque fugit a at. Cum quod vero assumenda iusto.</p>
                <ul class="ul-check list-unstyled success">
                  <li class="text-white">Error minus sint nobis dolor</li>
                  <li class="text-white">Voluptatum porro expedita labore esse</li>
                  <li class="text-white">Voluptas unde sit pariatur earum</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
            </div>
        </div>
        </>
    );
};



export default Home;
