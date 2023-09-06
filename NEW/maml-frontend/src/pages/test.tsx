
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Test() {
  const images = [
    "http://localhost:3000/public/thumbnail/8b92fdbc73fbe928846e1cc1c6deb1abb8872d4d8c46f1becc12b4b6d7a67ee36f17dca4d2bc55c3d3dee1e1a12d48b540b4.jpg",
    "http://localhost:3000/public/thumbnail/8b92fdbc73fbe928846e1cc1c6deb1abb8872d4d8c46f1becc12b4b6d7a67ee36f17dca4d2bc55c3d3dee1e1a12d48b540b4.jpg",
  ];

  return (
    <div style={{ width: "500px", height: "300px" }}>
      <Carousel>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} width={"500px"} height="500px" alt="aa" />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
