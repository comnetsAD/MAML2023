import React, { useState, useEffect } from "react";

const UploadAndDisplayImage = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [editorImage, setEditorImage] = useState(null);

  

  useEffect(()=>{
    setEditorImage(props.postImage)
    const fileName = props.postImage?.split('\\').pop().split('/').pop();
    fetch(props.postImage)
    .then(async response => {
      const contentType = response.headers.get('content-type')
      const blob = await response.blob()
      const file = new File([blob], fileName, { contentType })
      props.setPic(file, props.picItemID)
      console.log(file)
      
    })
  }, [])

  
  
 

  return (
    <div>
      {selectedImage && (
        <div>
        <img alt="not found" width={"100%"} src={URL.createObjectURL(selectedImage)} />
        <br />
        </div>
      )}

      {editorImage && (
          <div>
          <img alt="not found" width={"100%"} src={editorImage} />
          <br />
          </div>
        )}

      {!selectedImage &&  !editorImage && <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log("from UploadAndDisplayImage.js:", event.target.files[0]);
          setSelectedImage(event.target.files[0]);
          
          props.setPic(event.target.files[0], props.picItemID)
          console.log(selectedImage)
        }}
      />}
    </div>
  );
};

export default UploadAndDisplayImage;