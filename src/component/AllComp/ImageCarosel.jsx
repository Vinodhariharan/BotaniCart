import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { Skeleton } from "@mui/material";
import '../../assets/css/ImageSlider.css'

const ImageSlider = ({ images }) => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="imgslider">
      <Slider {...settings}>
        {images.map((item, index) => (
          <div key={item.id || index}>
            {item.src ? (
              <img src={item.src} alt={item.alt} />
            ) : (
              // Display Skeleton for the image while loading
              <Skeleton variant="rectangular" width={1000} height={600} />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
