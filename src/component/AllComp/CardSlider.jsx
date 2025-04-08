import React from "react";
import Slider from "react-slick";
import ProductCard from "./CardComponent";
import { IconButton } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardSlider = ({ products = [], user }) => {
  const CustomPrevArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      variant="outlined"
      color="success"
      size="md"
      sx={{
        position: "absolute",
        left: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        display: "flex",
      }}
    >
      <KeyboardArrowLeftIcon />
    </IconButton>
  );

  const CustomNextArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      variant="outlined"
      color="success"
      size="md"
      sx={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        display: "flex",
      }}
    >
      <KeyboardArrowRightIcon />
    </IconButton>
  );

  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 4,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(products.length, 3),
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(products.length, 2),
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{ position: "relative", padding: "10px 30px", maxWidth: "100%" }}>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} style={{ padding: "10px" }}>
            <ProductCard product={product} userId={user?.uid} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;