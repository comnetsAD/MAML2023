import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import { SketchPicker } from 'react-color';
import Editor from "./Editor";
import UploadAndDisplayImage from "./UploadAndDisplayImage";
import Carousel from "./Carousel";
import CarouselEditor from "./CarouselEditor";
import Popup from "reactjs-popup";
import Navbar from "./Navbar";
import NavbarButtonEditor from "./NavbarButtonEditor";
import NavbarDropdownEditor from "./NavbarDropdownEditor";
import {withRouter} from './withRouter';
import "reactjs-popup/dist/index.css";
import "./EditorWindow.css";
import { useParams } from "react-router-dom";
import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";
import { color } from "@mui/system";
import { fabClasses } from "@mui/material";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
class ResumedEditorWindow extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  // componentDidMount() {
  //   let { id } = this.props.params;
  //   fetch('http://10.224.41.106:8080/api/pages/getPage/' + id,{
  //       'method':'GET',
  //       headers : {
  //       'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFrb3NhaEBnbWFpbC5jb20iLCJleHAiOjE2NTA5NjQ1NDN9.oUsgoXq1hzzRodpuYVIIIXf4bsAJfMwZUK3KtY4TnxY'
  //     }
  //   }).then(response => response.json())
  //   .then(data1 => {console.log(data1);
  //       // pageNames = data1.pages;
  //       // this.setState({
  //       //     items: data1.pages.length,
  //       //     pageNames: data1.pages
  //       // });
  //   },err => {
  //       alert("error during fetch", err);
  //   }   )
  // }

  constructor(props) {
    super(props);
    this.state = {
      items: [].map(function (i, key, list) {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          add: i === list.length - 1,
          type: "text",
          uid: i
        };
      }),
      newCounter: 0,
      uniqueCounter: 0,
      carouselImages: new Map(),
      navBar: false,
      navbarItems: [],
      savePost: false,
      navbarItemCnt: 0,
      currentPicPos: 0,
      singleImages: new Map(), // stores state of picture items
      // carouselEditorID: 0 // each time we create a carousel, the editor should be cleared of images from previous carousel creations
      pageName: "",
      postImage: ["https://10.224.41.106:8080/data/pages/akosah/3/1.png", "http://10.224.41.106:8080/data/pages/akosah/3/1.png", "http://10.224.41.106:8080/data/pages/akosah/3/1.png"],
      editorCarousel: ["https://10.224.41.106:8080/data/pages/gideon/NYUAD/c1-0.jpg", "http://10.224.41.106:8080/data/pages/gideon/NYUAD/c1-1.jpg", "http://10.224.41.106/data:8080/pages/gideon/NYUAD/c1-2.jpg"],
      texts: new Map(),
      allUpdated: false,
      navBarColor: "grey",
      contentMap: [{"type":"rect","x":70,"y":0,"w":1788,"h":50,"color":"#a74848"},
      {"type":"button","template":"POST","txt":"Gideon","txtFields":"0","x":80,"y":10,"w":138,"h":30,"target":"sample.com"},
      {"type":"button","template":"POST","txt":"Akosah","txtFields":"0","x":228,"y":10,"w":138,"h":30,"target":"sample.com"},
      {"type":"dropdown","template":"POST","items":["Agye"],"txtFields":1,"x":376,"y":10,"w":138,"h":30,"target":"sample.com"},
      {"type":"img"},
      {"type":"img"},
      {"type":"img"},
      {"type":"carousel"},
      
      {"type":"txt","txt":"No where cool","x":71,"y":51,"w":1339,"h":383,"textX":86,"textY":63,"textW":1309,"textH":18.466659545898438,"font":"13px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"},
      {"type":"txt","txt":"I did not come to play ","x":71,"y":51,"w":1339,"h":383,"textX":86,"textY":81.46665954589844,"textW":1309,"textH":18.4666748046875,"font":"13px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"},
      {"type":"txt","txt":"Seelewa","x":71,"y":51,"w":1339,"h":383,"textX":86,"textY":99.93333435058594,"textW":1309,"textH":18.466659545898438,"font":"13px","font-family":"Helvetica, Arial, sans-serif","color":"rgb(51, 51, 51)"},
      ],
      currentTextMap: "{\"0-0\":\"<p>                       DO NOT COME AROUND</p>\",\"0-1\":\"<p>There comes a time </p>\",\"0-2\":\"<p>When we heed a certain call </p>\",\"0-3\":\"<p>And the world must come together as one</p>\",\"0-4\":\"<p>There are people dying </p>\",\"0-5\":\"<p>And is time to lend a hand </p>\",\"0-6\":\"<p>To give the greatest gift of all.</p>\",\"0-7\":\"<p>WE can go on</p>\",\"0-8\":\"<p><br></p>\"}"

    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onAddPic = this.onAddPic.bind(this);
    this.createPhotoObject = 
    this.onAddCarousel = this.onAddCarousel.bind(this);
    this.onAddNavBar = this.onAddNavBar.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.setCarouselImages = this.setCarouselImages.bind(this);
    this.setNavbarItems = this.setNavbarItems.bind(this);
    this.setDropdownItems = this.setDropdownItems.bind(this);
    this.generatePage = this.generatePage.bind(this);
    this.setPic = this.setPic.bind(this); // function to be passed to and called by child component
    // this.updateCarouselEditorID = this.updateCarouselEditorID.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.setText = this.setText.bind(this);
    this.regeneratePage = this.regeneratePage.bind(this)
    this.handlePostSave = this.handlePostSave.bind(this)
    
   
  }

  

  componentDidMount(){
    console.log("Reached here")
    const {id} = this.props.params;
    console.log(id)
    fetch("http://10.224.41.106:8080/api/posts/getPost/"+id,{
        'method':'GET',
        headers: {
          "Content-Type": "application/json"
        },
    }).then(response => response.json())
    .then(data1 => {
      const newMap = data1.content.split("\r\n")
      const newtext = data1.textMap
      const newImages = data1.imagelist
      const newCarousel = data1.carousellist
      newMap.pop()
      this.setState({
        contentMap: newMap,
        currentTextMap: newtext,
        editorCarousel: newCarousel,
        postImage: newImages
      })
      
      this.regeneratePage()
        
    },err => {
        alert("error during fetch", err);
    }   )
    
    
  }

 

  // componentDidMount(){
  //   this.regeneratePage()
  // }

  
  // for switch in the return expression
  renderSwitch(param, uid, picPos) {
    switch (param) {
      case "text":
        return <Editor textID={uid} textMap={this.state.texts}/>;
      case "picture":
        return <UploadAndDisplayImage picItemID={uid} setPic={this.setPic} postImage={this.state.postImage[picPos]} />;
      case "carousel": 
        return <Carousel uid={uid} images={this.state.carouselImages.get(uid)} editedImages={this.state.editorCarousel} setImages={this.setCarouselImages}/>;
      default:
        return;
    }
  }

  setCarouselImages(newImages, uid) {
    this.setState((prevState) => {
      const newCarouselImages = new Map(prevState.carouselImages);
      return {carouselImages: newCarouselImages.set(uid, newImages)}
    });
  }

  setPic(img, idx) {
    this.setState((prevState) => {
      const newSingleImages = new Map(prevState.singleImages);
      // console.log(prevState.singleImages);
      return {singleImages: newSingleImages.set(idx, img)}
    });
  }

  setText(text, idx) {
    this.setState((prevState) => {
      const newTexts = new Map(prevState.texts);
      // console.log(prevState.singleImages);
      return {texts: newTexts.set(idx, text)}
    });
  }

  // updateCarouselEditorID() {
  //   this.setState((prevState) => {
  //     return {carouselEditorID : prevState.carouselEditorID + 1}
  //   });
  // }

  setNavbarItems(navbarItem) {
    this.setState({
      navbarItems: this.state.navbarItems.concat({
        i: this.state.navbarItemCnt,
        text: navbarItem,
        type: "button",
        items: [],
      }),
      navbarItemCnt: this.state.navbarItemCnt + 1,
    });
  }

  setDropdownItems(dropdownItems) {
    this.setState({
      navbarItems: this.state.navbarItems.concat({
        i: this.state.navbarItemCnt,
        text: "",
        type: "dropdown",
        items: dropdownItems,
      }),
      navbarItemCnt: this.state.navbarItemCnt + 1,
    });
  }

  regeneratePage(){
    console.log("Its runniong")
    let newItems = []
    let newNavBarItems = []
    let textFound = false
    let lastx = 0
    let lasty = 0
    let nCounter = 0
    let newUniqueCounter = 0
    let newPicPos = 0
    let newNavCount = 0
    let navColor = ""
    let navBarPresent = false
    if(this.state.contentMap){
      for(let i= 0; i<this.state.contentMap.length; i++){
       
        const currentItem = JSON.parse(this.state.contentMap[i])
        
        switch(currentItem.type){
          case "txt":
            this.setState({
              texts:  new Map(Object.entries(JSON.parse(JSON.parse(this.state.currentTextMap)))),
            })
            
            // this.onAddItem()
            if(lastx !=  currentItem.x || lasty!= currentItem.y){
              textFound = false
            }
            if(!textFound){
              newItems.push({
                i: nCounter.toString(),
                x: (newItems.length * 2) % (this.state.cols || 12),
                y: Infinity, // puts it at the bottom
                w: 2,
                h: 2,
                type: "text",
                uid: newUniqueCounter
              })
              nCounter = nCounter + 1
              newUniqueCounter = newUniqueCounter + 1
              textFound = true
              lastx= currentItem.x
              lasty= currentItem.y
            }
            continue
          case "img":
            // this.onAddPic()
            newItems.push({
              i: nCounter.toString(),
              x: (newItems.length * 2) % (this.state.cols || 12),
              y: Infinity, // puts it at the bottom
              w: 2,
              h: 2,
              type: "picture",
              uid: newUniqueCounter,
              picPos: newPicPos
            })
            nCounter = nCounter + 1
            newUniqueCounter = newUniqueCounter + 1
            newPicPos = newPicPos + 1
            continue
          case "rect":
            navColor= currentItem.color.toString()
            navBarPresent = true
          
            continue
          case "carousel":
            // this.onAddCarousel()
            newItems.push({
              i: nCounter.toString(),
              x: (newItems.length * 2) % (this.state.cols || 12),
              y: Infinity, // puts it at the bottom
              w: 2,
              h: 2,
              type: "carousel",
              uid: newUniqueCounter
            })
            nCounter = nCounter + 1
            newUniqueCounter = newUniqueCounter + 1
            continue
          case "dropdown":
            newNavBarItems.push({
                i: newNavCount,
                text: "",
                type: "dropdown",
                items: currentItem.items
              })
              newNavCount  = newNavCount + 1
          case "button":
            newNavBarItems.push({
              i: newNavCount,
              text: currentItem.txt,
              type: "button",
              items: []
            })
            newNavCount  = newNavCount + 1

          default:
            continue
          }

      }
    }
    
    this.setState({
      items: newItems,
      newCounter : nCounter,
      uniqueCounter: newUniqueCounter,
      navbarItems: newNavBarItems,
      navbarItemCnt: newNavCount
    })

    if(navBarPresent){
      this.setState({
        navBarColor: navColor,
        navBar: !this.state.navBar
      })
    }

    
    
  }



 





 
  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
      zIndex: 3,
    };
    const i = el.i;
    const type = el.type;
    const uid = el.uid;
    const picPos = el.picPos

    return (
      <div id={"mainItem"+i} key={uid} data-grid={el} className="text-box">
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>

        {this.renderSwitch(type, uid, picPos)}
      </div>
    );
  }

  onAddItem() {
    /*eslint no-console: 0*/
    // console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: this.state.newCounter.toString(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        type: "text",
        uid: this.state.uniqueCounter,
        picPos: -1
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
      uniqueCounter: this.state.uniqueCounter + 1
    });
    
  }

  onAddPic() {
    /*eslint no-console: 0*/
    // console.log("adding", "n" + this.state.newCounter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: this.state.newCounter.toString(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        type: "picture",
        // picID: this.state.picItemCnt,
        uid: this.state.uniqueCounter,
        picPos: this.state.currentPicPos
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
      // picItemCnt: this.state.picItemCnt + 1,
      uniqueCounter: this.state.uniqueCounter + 1,
      currentPicPos: this.state.currentPicPos + 1
    });
    console.log("A picture was added")
    
  }

  onAddCarousel() {
    /*eslint no-console: 0*/
    // console.log("adding", "n" + this.state.newCounter);
    // console.log(this.state.images);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: this.state.newCounter.toString(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        type: "carousel",
        uid: this.state.uniqueCounter,
        picPos: -1,
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
      uniqueCounter: this.state.uniqueCounter + 1
    });
  }

  onAddNavBar() {
    this.setState({
      navBar: !this.state.navBar,
    });
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
    this.setState({ layout: layout });
  }

  onRemoveItem(i) {
    // console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }), newCounter: this.state.newCounter - 1 });

  }

  handleNameChange(event) {
    this.setState({pageName: event.target.value});
  }
  handlePostSave(){
    this.setState({
      savePost: !this.state.savePost,
    });
    this.generatePage()
  }

  generatePage = () => {
    let x, y, w, h, textX, textY, textW, textH;
    let maml = "";
    let content = "";
    let pageName = this.state.pageName;
    let yOffset = window.scrollY;
    console.log("Y OFFSET", yOffset);
    if (this.state.navBar) {
      x = document.getElementById("navbar").getBoundingClientRect().x;
      y = document.getElementById("navbar").getBoundingClientRect().y + yOffset;
      w = document.getElementById("navbar").getBoundingClientRect().width;
      h = document.getElementById("navbar").getBoundingClientRect().height;
      maml = maml.concat("{\"type\":\"rect\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"color\":\"", this.state.navBarColor ,"\"}\n");
      
      for (let i = 0; i < this.state.navbarItemCnt; i++) {
        x = document.getElementById("navbarButton" + i).getBoundingClientRect().x;
        y = document.getElementById("navbarButton" + i).getBoundingClientRect().y + yOffset;
        w = document.getElementById("navbarButton" + i).getBoundingClientRect().width;
        h = document.getElementById("navbarButton" + i).getBoundingClientRect().height;
        if (this.state.navbarItems[i].type === "button") {
          maml = maml.concat("{\"type\":\"button\",\"template\":\"POST\",\"txt\":\"", this.state.navbarItems[i].text, "\",\"txtFields\":\"0\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"target\":\"sample.com\"}\n");
        } else {
          maml = maml.concat("{\"type\":\"dropdown\",\"template\":\"POST\",\"items\":[", this.state.navbarItems[i].items.map((el) => "\"" + el.value + "\""), "],\"txtFields\":", this.state.navbarItems[i].items.length, ",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"target\":\"sample.com\"}\n");
        }
      }
    }
  

    let newTexts = new Map(this.state.texts);
    console.log(this.state.uniqueCounter)
    console.log(this.state.items)
    for (let i = 0; i < this.state.uniqueCounter; i++) {
      // console.log("DEBUG",i);
      if (document.getElementById("mainItem" + i) == null) {
        continue;
      } else {
        console.log("CURRENT STATE: ",this.state);
        x = document.getElementById("mainItem" + i).getBoundingClientRect().x;
        y = document.getElementById("mainItem" + i).getBoundingClientRect().y + yOffset;
        w = document.getElementById("mainItem" + i).getBoundingClientRect().width;
        h = document.getElementById("mainItem" + i).getBoundingClientRect().height;
        console.log("CURRENT ITEM: ",this.state.items[i], "TYPE", this.state.items[i].type);
        if (this.state.items[i].type === "text") {
          let textBox = document.querySelector("#mainItem" + i + " .ql-editor");
          console.log(i)
          let textList = textBox.childNodes;
          x = document.querySelector("#mainItem" + i).getBoundingClientRect().x;
          y = document.querySelector("#mainItem" + i).getBoundingClientRect().y + yOffset;
          w = document.querySelector("#mainItem" + i).getBoundingClientRect().width;
          h = document.querySelector("#mainItem" + i).getBoundingClientRect().height;
          for (let j = 0; j < textList.length; j++) {
            // console.log("LOOK HERE", textList[i].outerHTML);
            let processedText = textList[j].innerHTML.replace(/\"/g, '\\"');
            newTexts.set(this.state.items[i].uid + "-" + j, String(textList[j].outerHTML));
            console.log("AFTER", newTexts);
          
            this.setState({texts: newTexts}, () => {
              // console.log("AFTER SETTING TEXT: ", this.state.texts);
            });
            // this.setText(text, this.state.items[i].uid);
            // console.log("AFTER SETTING TEXT: ", this.state.texts);
            const style = getComputedStyle(textList[j]);
            // get the dimensions of the actual text
            textX = textList[j].getBoundingClientRect().x;
            textY = textList[j].getBoundingClientRect().y + yOffset;
            textW = textList[j].getBoundingClientRect().width;
            textH = textList[j].getBoundingClientRect().height;
            // maml = maml.concat("{\"type\":\"txt\",\"txt\":\"", text.innerHTML, "\",\"txtFields\":\"0\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"textX\":", textX, ",\"textY\":", textY, ",\"textW\":", textW, ",\"textH\":", textH, ",\"font\":\"",style.fontSize,"\",\"font-family\":\"",style.fontFamily,"\",\"color\":\"",style.color,"\"}\n");
            maml = maml.concat("{\"type\":\"txt\",\"txt\":\"", processedText, "\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"textX\":", textX, ",\"textY\":", textY, ",\"textW\":", textW, ",\"textH\":", textH, ",\"font\":\"",style.fontSize,"\",\"font-family\":\"",style.fontFamily,"\",\"color\":\"",style.color,"\"}\n");
          }
          // console.log(textList);
          
          // let processedText = textBox.innerHTML.replace(/\"/g, '\"');
          // console.log(processedText);
          // let text = textBox.firstChild;
          // let text;
          // for (let i = 0; i < textBox.children.length; i++) {
          //   text += textBox.children[i];
          // }
          
          // console.log("SETTING TEXT: ", text);
          
          // console.log("BEFORE", newTexts, text);
          // newTexts.set(this.state.items[i].uid, String(text.outerHTML));
          // newTexts.set(this.state.items[i].uid, String(processedText));
          // console.log("AFTER", newTexts);
        
          // this.setState({texts: newTexts}, () => {
          //   // console.log("AFTER SETTING TEXT: ", this.state.texts);
          // });
          // // this.setText(text, this.state.items[i].uid);
          // // console.log("AFTER SETTING TEXT: ", this.state.texts);
          // const style = getComputedStyle(text);
          // // get the dimensions of the actual text
          // textX = text.getBoundingClientRect().x;
          // textY = text.getBoundingClientRect().y + yOffset;
          // textW = text.getBoundingClientRect().width;
          // textH = text.getBoundingClientRect().height;
          // x = document.querySelector("#mainItem" + i).getBoundingClientRect().x;
          // y = document.querySelector("#mainItem" + i).getBoundingClientRect().y + yOffset;
          // w = document.querySelector("#mainItem" + i).getBoundingClientRect().width;
          // h = document.querySelector("#mainItem" + i).getBoundingClientRect().height;
          // // maml = maml.concat("{\"type\":\"txt\",\"txt\":\"", text.innerHTML, "\",\"txtFields\":\"0\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"textX\":", textX, ",\"textY\":", textY, ",\"textW\":", textW, ",\"textH\":", textH, ",\"font\":\"",style.fontSize,"\",\"font-family\":\"",style.fontFamily,"\",\"color\":\"",style.color,"\"}\n");
          // maml = maml.concat("{\"type\":\"txt\",\"txt\":\"", processedText, "\",\"txtFields\":\"0\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, ",\"textX\":", textX, ",\"textY\":", textY, ",\"textW\":", textW, ",\"textH\":", textH, ",\"font\":\"",style.fontSize,"\",\"font-family\":\"",style.fontFamily,"\",\"color\":\"",style.color,"\"}\n");
        } else if (this.state.items[i].type === "picture") {
          let image = document.querySelector("#mainItem" + i + " img");
          x = image.getBoundingClientRect().x;
          y = image.getBoundingClientRect().y + yOffset;
          w = image.getBoundingClientRect().width;
          h = image.getBoundingClientRect().height;
          
          let imageNameList = this.state.singleImages.get(i).name.split('.');
          let format = imageNameList[imageNameList.length - 1];
          maml = maml.concat("{\"type\":\"img\",\"uid\":\"", this.state.items[i].uid, "\",\"format\":\"", format, "\",\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, "}\n");
        } else if (this.state.items[i].type === "carousel") {
          let carousel = document.querySelector("#mainItem" + i);
          x = carousel.getBoundingClientRect().x;
          y = carousel.getBoundingClientRect().y + yOffset;
          w = carousel.getBoundingClientRect().width;
          h = carousel.getBoundingClientRect().height;
          let imageArray = this.state.carouselImages.get(i);
          
          let imageCnt = imageArray.length;
          let formats = [];
          for (let j = 0; j < imageCnt; j++) {
            let nameList = imageArray[j].name.split('.');
            formats.push("\"" + nameList[nameList.length - 1] + "\"");
          }
          maml = maml.concat("{\"type\":\"carousel\",\"uid\":\"", this.state.items[i].uid, "\",\"imageCnt\":", imageCnt, ",\"formats\":[", formats, "],\"x\":", x, ",\"y\":", y, ",\"w\":", w, ",\"h\":", h, "}\n");
        }
      }
    }
    console.log(maml);
    // console.log(this.state.singleImages);
    // make a group of images and the maml object and send to the backend
    console.log("truth value", this.state.savePost)
    const data = new FormData();
    
    data.append('maml', maml);
    data.append('pageName', pageName);
    console.log(this.singleImages)
    this.state.singleImages.forEach((value, key) => {
      let nameList = value.name.split('.');
      let fileExtension = nameList[nameList.length - 1];
      data.append('files[]', value, key + '.' + fileExtension);
    });
    this.state.carouselImages.forEach((value, key) => {
      value.forEach((pic, picIdx) => {
        // console.log(pic.file);
        // console.log(key);
        // console.log(picIdx);
        let nameList = pic.name.split('.');
        let fileExtension = nameList[nameList.length - 1];
        data.append('carousels[]', pic, "c" + key + "-" + picIdx + '.' + fileExtension);
      });
    });
  
    // console.log("DEBUG NOW:", data.get("files[]"));
    const data2 = {
      "email":"akosah@gmail.com",
      "password":"akosah"
    }

    this.setState({allUpdated: true}, () => {
      
      // console.log("JSON STATE", );
      // console.log("ALL STATES", this.state);
      data.append('stateJSON', JSON.stringify(this.state))
      const textMap = Object.fromEntries(this.state.texts);
      data.append('textMap', JSON.stringify(textMap));
      const carouselMap = Object.fromEntries(this.state.carouselImages)
      data.append('carouselMap', JSON.stringify(carouselMap))
      console.log(this.state.carouselImages)
    
      console.log("Truth value 2", this.state.savePost)
      console.log("Saved Pages", this.state.savedPages)
      if(this.state.savePost){
        data.append('content', maml)
      }
      data.append('postID', this.props.params.id)
      console.log("id is ", this.props.params)
      if(!this.state.savePost){
        
        fetch('http://10.224.41.106:8080/api/pages/upload',{
                'method':'POST',
                headers : {
                'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFrb3NhaEBnbWFpbC5jb20iLCJleHAiOjE2NjgxOTI1NTJ9.IQrLgzhf1OxL2Ke4jdLpfLeFhe_P9YHviRWqYYbSPHM'
          },
          body:data
        }).then(response => response.json())
        .then(data1 => {console.log(data1);
          });
        }else{
          console.log(this.state.savePost)
          fetch('http://10.224.41.106:8080/api/posts/updatePost',{
                'method':'POST',
                headers : {
                'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFrb3NhaEBnbWFpbC5jb20iLCJleHAiOjE2NjgxOTI1NTJ9.IQrLgzhf1OxL2Ke4jdLpfLeFhe_P9YHviRWqYYbSPHM'
          },
          body:data
        }).then(response => response.json())
        .then(data1 => {console.log(data1);
          console.log("DEBUG DATA AFTER:", maml, data.get("files"))});

        }

      });
    

  }


  render() {
    return (
      <div>
        <div className="sidebar">
          <button onClick={this.onAddItem}>Add Text</button>
          <button onClick={this.onAddPic}>Add Pic</button>
          {/* <button onClick={this.onAddCarousel}>Add Pic</button> */}
          <Popup
            trigger={<button> Add Carousel</button>}
            position="right center"
            modal
          >
            <CarouselEditor
              addCarousel={this.onAddCarousel}
              images={this.state.carouselImages}
              setImages={this.setCarouselImages}
              uid={this.state.uniqueCounter}
              // editorID={this.state.carouselEditorID}
              // updateID={this.updateCarouselEditorID}
            />
          </Popup>
          <Popup
            trigger={<button>Toggle Navbar</button>}
            position="right center"
            modal
          >
            <div>
            <SketchPicker />
            <button onClick={this.onAddNavBar}>Create</button>
            </div>
          </Popup>
          
          <Popup
            trigger={<button> Add Navbar Button</button>}
            position="right center"
            modal
          >
            <NavbarButtonEditor setNavbarItems={this.setNavbarItems} />
          </Popup>
          <Popup
            trigger={<button> Add Navbar Dropdown</button>}
            position="right center"
            modal
          >
            <NavbarDropdownEditor setDropdownItems={this.setDropdownItems} />
          </Popup>
          <Popup
            trigger={<button onClick={this.generatePage}>Generate Page</button>}
            position="right center"
            modal
          >
            <div>
            <p>Please specify your page name</p>
            <input type="text" value={this.state.pageName} onChange={this.handleNameChange} />
            <button onClick={this.generatePage}>Create</button>
            </div>
          </Popup>
          <Popup
            trigger={<button >Save Page</button>}
            position="right center"
            modal
          >
            
            <div>
            <p>Please specify your page name</p>
            <input type="text" value={this.state.pageName} onChange={this.handleNameChange} />
            <button onClick={this.handlePostSave}>Save</button>
            </div>
          </Popup>
       
          
          
        </div>
        <div className="main">
          {this.state.navBar ? (
             <div className="navbar" id="navbar" style={{backgroundColor: this.state.navBarColor}}>
             <Navbar navbarItems={this.state.navbarItems} />
           </div>
          ) : null}
          <ResponsiveReactGridLayout
            //   onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}
            {...this.props}
            draggableCancel=".my-editing-area"
            autoSize={true}
            margin={[1, 1]}
          >
            {_.map(this.state.items, (el) => this.createElement(el))}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    );
  }
}

// if (process.env.STATIC_EXAMPLES === true) {
//   import("../test-hook.jsx").then(fn => fn.default(AddRemoveLayout));
// }

export default withParams(ResumedEditorWindow);