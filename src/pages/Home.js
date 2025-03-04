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
            backgroundColor: 'var(--theme_color)',
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
            <div className='logo navbar_logo'>Ship Pro</div>
            <ul className='navbar-list'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Recharge</li>
            </ul>
        </navbar>
        
        <div className='main-box-content'>
            <h1 className='text-white'>Welcome to Ship Pro</h1>
            {/* <label className='text-white'>Pro</label> */}
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

          <p style={{marginBottom:"24px"}}>At Shippro, we specialize in empowering businesses to streamline their e-commerce operations and achieve seamless growth. As a trusted partner in the logistics and supply chain industry, we provide end-to-end solutions tailored to meet the unique needs of online sellers.</p>
          <p style={{marginBottom:"24px"}}>
          Our expertise spans Amazon FBA (Fulfillment by Amazon), FBM (Fulfillment by Merchant), and comprehensive warehouse services, ensuring your products are stored, managed, and delivered with precision and efficiency. Whether you're scaling your Amazon business or optimizing your inventory management, Shippro is committed to delivering reliable, cost-effective, and scalable solutions that drive success. Let us handle the complexities of logistics, so you can focus on what you do best—growing your business</p>

           </div>
           <div className='about_right'><img src='https://preview.colorlib.com/theme/logis/images/img_3.jpg.webp'></img></div>
        </div>
        </div>

        <div className='work_style_container sec-distance' style={{padding:'60px 0px'}}>
            <div className='container'>
                <h2 className='heading_main' style={{textAlign:'center'}}>How It Work</h2>
                <div class="row work_style_head" style={{position:"relative"}}>
          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="100">
            <div class="how-it-work-item">
              <span class="number">1</span>
              <div class="how-it-work-body">
                <h2>Create Label</h2>
                <p class="mb-5">You have the option to create shipping labels easily either by filling out a form or by uploading a CSV file.</p>
                {/* <ul class="ul-check list-unstyled success">
                  <li class="text-white">Error minus sint nobis dolor</li>
                  <li class="text-white">Voluptatum porro expedita labore esse</li>
                  <li class="text-white">Voluptas unde sit pariatur earum</li>
                </ul> */}
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="200">
            <div class="how-it-work-item">
              <span class="number">2</span>
              <div class="how-it-work-body">
                <h2>Download Shipping Label</h2>
                <p class="mb-5">Subsequently, you can acquire the shipping label directly from your dashboard by clicking on download link..</p>
                
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="300">
            <div class="how-it-work-item">
              <span class="number">3</span>
              <div class="how-it-work-body">
                <h2>Ready to Ship</h2>
                <p class="mb-5">Affix the label onto your parcel/Package so it can be shipped using specific courier service..</p>
               
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
