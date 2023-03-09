import React, { Component } from "react";
import ReactQuill from "react-quill";

const toolbarOptions = ["bold"];

class Editor extends Component {
  constructor(props) {
    super(props);
    // props.setText("<div contenteditable='false'>Add Text</div>", props.textID);
    const storedText= Array.from(props.textMap.values());

    let storedText2= storedText.join('\n')
  

    this.state = {
      text: storedText2 ? storedText2 : "<div contenteditable='false'>Add Text</div>"
    };

    
    // this.state = {
    //   text: "<div contenteditable='false'>Add Text</div>"
    // };
  }

  // modules = useMemo(() => ({
  //   toolbar: [
  //     [{ header: [1, 2, false] }],
  //     ["bold", "italic", "underline", "strike", "blockquote"],
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     ["link", "image"]
  //   ]
  // }), [])

  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"]
    ]
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];
  handleProcedureContentChange = (content, delta, source, editor) => {
    // store the content as the editor state so user input persists when the
    // layout re-renders
    this.state.text = content;
    console.log(this.state.text)
    // console.log("FROM EDITOR", this.state.text);
    // this.props.setText(content, this.props.textID);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };
  render() {
    return (
      <ReactQuill
      theme="bubble"
      modules={this.modules}
      formats={this.formats}
      value={this.state.text}
      // defaultValue={this.state.text}
      // value={this.props.textMap.get(this.props.textID) ? this.props.textMap.get(this.props.textID) : ""}
      onChange={this.handleProcedureContentChange}
    >
      <div className="my-editing-area" />
    </ReactQuill>
      
    );
  }
}

export default Editor;