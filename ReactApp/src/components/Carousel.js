import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = (props) => {
    // console.log("Carousel logging its images");
    // console.log(props.images);
    const [editorImage, setEditorImage] = useState(props.editedImages);

    useEffect(()=>{
      
      let imagelist = []
      if(props.editedImages){
        for( let image=0; image<props.editedImages?.length; image++){
          
          const fileName = props.editedImages[image].split('\\').pop().split('/').pop();
          
            fetch(props.editedImages[image])
            .then(async response => {
              const contentType = response.headers.get('content-type')
              const blob = await response.blob()
              const file = new File([blob], fileName, { contentType })
              imagelist.push(file)
              
            })
        }
        props.setImages(imagelist, props.uid);
      }
    
    }, [])

    

    var settings = {
        dots: true
      };
      return (
        <div className="container">

          {editorImage && <Slider {...settings}>
                      {props.editedImages.map((image, index) => (
                        <div key={index}>
                          <img src={image} width="100%"/>
                        </div>
                          
                      ))}
                    
                    </Slider>}

          {!editorImage && <Slider {...settings}>
            {props.images.map((image, index) => (
              <div key={index}>
                <img src={image['data_url']} width="100%"/>
              </div>
                
              ))}
          
          </Slider>}

          

          


        </div>
      );
}


export default Carousel;