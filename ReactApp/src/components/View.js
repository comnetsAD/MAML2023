// import React, { useState} from 'react';

// function View() {
//     const [pageScreenshots, setPageScreenshots] = useState([]);
//     const [pageNames, setPageNames] = useState([]);
//     // pull all page names and screenshots from backend 
//     // state needs to maintain an array of names and screenshots files

//     // use a for loop to parse page name and screenshots from the backend
//     let newPageScreenshot, newPageName;
//     setPageScreenshots(pageScreenshots.push(newPageScreenshot));
//     setPageNames(pageNames.push(newPageName));

//     return (
//         <div className="view">
//            this is view!

            
//         </div>
//     )
// }

// export default View;
import React, {Component} from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import { Link, useNavigate } from 'react-router-dom';
import {withRouter} from './withRouter';
// import { useParams } from "react-router-dom";

const ReactGridLayout = WidthProvider(RGL);

class View extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    isDraggable: false,
    isResizable: false,
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  

  constructor(props) {
    super(props);

    // let pageNames;
    // let items;
    this.state = {
        items: 0,
        pageNames: [],
        pageScreenshots: []
      };

    // this.history = useNavigate();

    this.componentDidMount = this.componentDidMount.bind(this);
    this.generateDOM = this.generateDOM.bind(this);
    // this.resumeEditor = this.resumeEditor.bind(this);
  }

  componentDidMount() {
    // let { userId } = this.props.params;
    // console.log(id);
    fetch('http://10.224.41.106:8080/api/pages/getAll',{
        'method':'GET',
        headers : {
        'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFrb3NhaEBnbWFpbC5jb20iLCJleHAiOjE2NTA5NjQ1NDN9.oUsgoXq1hzzRodpuYVIIIXf4bsAJfMwZUK3KtY4TnxY'
      }
    }).then(response => response.json())
    .then(data1 => {console.log(data1.pages.length);
        // pageNames = data1.pages;
        this.setState({
            items: data1.pages.length,
            pageNames: data1.pages
        });
    },err => {
        alert("error during fetch", err);
    }   )
  }

  // resumeEditor() {
  //   this.props.navigate('/resumedEditor/' + this.state.pageNames[i]);
  //   // this.history("./resumedEditor");
  // }

  generateDOM() { // change this part to change actual look of elements
    console.log("logging from generateDOM", this.state);
    // if (!this.state) {return null;} else {
        return _.map(_.range(this.state.items), (i) => {
       
            return (
                <div key={i}>
                {/* <span className="text">{i}</span> */}
                  <span className="text">{this.state.pageNames[i]}</span> 
                  <button onClick={() => {
                    this.props.navigate('/resumedEditor/' + this.state.pageNames[i]);
                  }}>Go to page</button>
                  {/* <img src={URL.createObjectURL(this.state.pageScreenshots[i])}></img> */}
                </div>
              );
        
        });
    // }
    
  }

  

//   generateLayout() {
//     // const p = this.props;
//     console.log("in generateLayout", this.state.items);
//     return _.map(new Array(this.state.items), function(item, i) {
//     //   var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
//       var y = i * 2;
//       return {
//         x: (i * 4) % 12,
//         y: Math.floor(i / 6) * y,
//         w: 4,
//         h: 6,
//         i: i.toString()
//       };
//     });
//   }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={_.map(new Array(this.state.items), function(item, i) {
    //   var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      var y = i * 2;
      return {
        x: (i * 4) % 12,
        y: Math.floor(i / 6) * y,
        w: 4,
        h: 6,
        i: i.toString()
      };
    })}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}

export default withRouter(View);

