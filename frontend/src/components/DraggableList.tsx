// @ts-nocheck

import IDManager from "@/utils/store/IDManager";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const DragAndDropList = () => {
  const [listeners, setListeners] = useState([
    "click",
    "keydown",
    "change",
    "reach",
    "timer",
  ]);

  const targets = ["show", "hide", "swap", "val"];
  const [droppedItems, setDroppedItems] = useState([]);
  const [droppedItemsID, setDroppedItemsID] = useState([]);

  // flag to see whether dropped item is a listener or target
  const [tl, setTL] = useState(0);

  // drag handlers
  const handleDragListenerStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setTL(0);
  };

  const handleDragTriggerStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setTL(1);
  };

  // drop handlers
  const handleListenerDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const draggedItem = listeners[draggedIndex];
    setDroppedItems([...droppedItems, draggedItem]);
    setDroppedItemsID([...droppedItemsID, ""]);
  };

  const handleTriggerDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const draggedItem = targets[draggedIndex];
    setDroppedItems([...droppedItems, draggedItem]);
    setDroppedItemsID([...droppedItemsID, ""]);
  };

  // drag over handler: prevent default
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div>
        <div
          style={{
            fontSize: "20px",
            paddingTop: "1.4rem",
            fontWeight: "600",
          }}
          onClick={() => {
            console.log(droppedItems, droppedItemsID);
          }}
        >
          Interactivity Designer
        </div>
        <div
          style={{
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          Use a combination of listeners and triggers to add interactivity to your web page.
        </div>

        <div style={{ marginBottom: "8px", fontWeight: "700" }}>Listeners</div>
        {listeners.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragListenerStart(e, index)}
            style={{
              backgroundColor: "white",
              padding: "2px 5px",
              marginRight: "5px",
              border: "1px solid black",
              display: "inline-block",
            }}
          >
            {item}
          </div>
        ))}

        <div style={{ margin: "14px 0 8px 0", fontWeight: "700" }}>Triggers</div>
        {targets.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragTriggerStart(e, index)}
            style={{
              backgroundColor: "white",
              padding: "2px 5px",
              marginRight: "5px",
              border: "1px solid black",
              display: "inline-block",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ margin: "30px 0 14px 0", fontWeight: "700" }}>
        Drop Below
      </div>
      <div
        style={{
          backgroundColor: "#fafafa",
          padding: "20px",
          borderRadius: "2px",
          color: "black",
          border: "1px solid black",
          minHeight: "100px",
          width: "400px"
        }}
        onDrop={(r) => {
          let data = "";
          if (!tl) {
            data = listeners[r.dataTransfer.getData("text/plain")];
            handleListenerDrop(r);
          } else {
            data = targets[r.dataTransfer.getData("text/plain")];
            handleTriggerDrop(r);
          }

          switch (data) {
            case "click":
              console.log("click");
              break;
            case "keydown":
              console.log("keydown");
              break;
            case "change":
              console.log("change");
              break;
            case "reach":
              console.log("reach");
              break;
            case "timer":
              console.log("timer");
              break;
            case "show":
              console.log("show");
              break;
            case "hide":
              console.log("hide");
              break;
            case "swap":
              console.log("swap");
              break;
            case "val":
              console.log("val");
              break;
            default:
              console.log("default");
          }
        }}
        onDragOver={handleDragOver}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          {droppedItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "black",
                backgroundColor: "white",
                padding: "2px 5px",
                marginTop: "5px",
                border: "1px solid black",
                width: listeners.includes(item) ? "100%" : "95%",
              }}
            >
              {item}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <select
                  style={{
                    fontSize: "12px",
                    border: "solid 1px rgba(0, 0, 0, .2)",
                  }}
                  defaultValue={"none"}
                  onChange={(e) => {
                    droppedItemsID[index] = e.target.value;
                    setDroppedItemsID([...droppedItemsID]);
                  }}
                >
                  <option disabled value={"none"}>
                    Select ID
                  </option>
                  {Object.values(IDManager.getIDs()).map((id) => (
                    <option key={id}>{id}</option>
                  ))}
                </select>

                <IoMdClose
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let index = droppedItems.indexOf(item);
                    let isListener = listeners.includes(item);

                    let newDroppedItems = [...droppedItems];
                    let newDroppedItemsID = [...droppedItemsID];

                    if (isListener) {
                      while (targets.includes(newDroppedItems[index + 1])) {
                        newDroppedItems.splice(index + 1, 1);
                        newDroppedItemsID.splice(index + 1, 1);
                      }
                    }

                    newDroppedItems.splice(index, 1);
                    setDroppedItems(newDroppedItems);

                    newDroppedItemsID.splice(index, 1);
                    setDroppedItemsID(newDroppedItems);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragAndDropList;
