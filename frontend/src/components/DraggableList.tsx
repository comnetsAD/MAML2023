// @ts-nocheck

import {
  GenericListener,
  GenericTrigger,
  KeydownListener,
  SwapTrigger,
  TimerListener,
} from "@/utils/interactivityTypes";
import IDManager from "@/utils/store/IDManager";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Props {
  callback: Function;
}
const DragAndDropList = ({ callback }: Props) => {
  const listeners = ["click", "keydown", "change", "reach", "timer"];
  const targets = ["show", "hide", "swap"];
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

  // mamlCode Tree
  const [MAMLTree, setMAMLTree] = useState<(Listener | Trigger)[]>([]);

  const getMAMLCode = (tree: (Listener | Trigger)[]) => {
    let res = "";
    let bCount = 0;
    let listenerStart = false;
    tree.forEach((item) => {
      switch (item.type) {
        case "click": {
          if (listenerStart) {
            res += "}\n";
            listenerStart = false;
          }
          res += `on("click", "${item.id}") {\n`;
          listenerStart = true;
          bCount++;
          break;
        }
        case "keydown": {
          if (listenerStart) {
            res += "}\n";
            listenerStart = false;
          }
          res += `on("keydown", "${item.id}", "${item.key}") {\n`;
          listenerStart = true;
          bCount++;
          break;
        }
        case "change": {
          if (listenerStart) {
            res += "}\n";
            listenerStart = false;
          }
          res += `on("change", "${item.id}") {\n`;
          listenerStart = true;
          bCount++;
          break;
        }
        case "reach": {
          if (listenerStart) {
            res += "}\n";
            listenerStart = false;
          }
          res += `on("reach", "${item.id}") {\n`;
          listenerStart = true;
          bCount++;
          break;
        }
        case "timer": {
          if (listenerStart) {
            res += "}\n";
            listenerStart = false;
          }
          res += `on("timer", ${item.interval * 1000}) {\n`;
          listenerStart = true;
          bCount++;
          break;
        }
        case "show": {
          res += `show("${item.id}");\n`;
          break;
        }
        case "hide": {
          res += `hide("${item.id}");\n`;
          break;
        }
        case "swap": {
          res += `swap("${item.value}", "${item.id}");\n`;
          break;
        }
      }
    });

    if (listenerStart) {
      res += "}\n";
      listenerStart = false;
    }
    return res;
  };

  useEffect(() => {
    callback(getMAMLCode(MAMLTree));
  }, [MAMLTree]);

  return (
    <div>
      <div>
        <div
          style={{
            fontSize: "20px",
            paddingTop: "1.4rem",
            fontWeight: "600",
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
          Use a combination of listeners and triggers to add interactivity to
          your web page.
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

        <div style={{ margin: "14px 0 8px 0", fontWeight: "700" }}>
          Triggers
        </div>
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
          width: "400px",
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
            case "click": {
              const click: GenericListener = {
                id: "",
                type: "click",
              };
              setMAMLTree([...MAMLTree, click]);
              break;
            }
            case "keydown": {
              const keydown: KeydownListener = {
                id: "",
                key: "",
                type: "keydown",
              };
              setMAMLTree([...MAMLTree, keydown]);
              break;
            }
            case "change": {
              const change: GenericListener = {
                id: "",
                type: "change",
              };
              setMAMLTree([...MAMLTree, change]);
              break;
            }
            case "reach": {
              const reach: GenericListener = {
                id: "",
                type: "reach",
              };
              setMAMLTree([...MAMLTree, reach]);
              break;
            }
            case "timer": {
              const timer: TimerListener = {
                type: "timer",
                interval: 0,
              };
              setMAMLTree([...MAMLTree, timer]);
              break;
            }
            case "show": {
              const show: GenericTrigger = {
                id: "",
                type: "show",
              };
              setMAMLTree([...MAMLTree, show]);
              break;
            }
            case "hide": {
              const hide: GenericTrigger = {
                id: "",
                type: "hide",
              };
              setMAMLTree([...MAMLTree, hide]);
              break;
            }
            case "swap": {
              const swap: SwapTrigger = {
                id: "",
                type: "swap",
                value: "",
              };
              setMAMLTree([...MAMLTree, swap]);
              break;
            }
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
                {Object.keys(MAMLTree[index]).map((key, idx) => {
                  let res: HTMLElement = <div></div>;
                  switch (key) {
                    case "id":
                      res = (
                        <select
                          style={{
                            fontSize: "12px",
                            border: "solid 1px rgba(0, 0, 0, .2)",
                          }}
                          defaultValue={"none"}
                          onChange={(e) => {
                            droppedItemsID[index] = e.target.value;
                            setDroppedItemsID([...droppedItemsID]);

                            MAMLTree[index].id = e.target.value;
                            setMAMLTree([...MAMLTree]);
                          }}
                        >
                          <option disabled value={"none"}>
                            Select ID
                          </option>
                          {Object.values(IDManager.getIDs()).map((id) => (
                            <option key={id}>{id}</option>
                          ))}
                        </select>
                      );
                      break;
                    case "key":
                      res = (
                        <input
                          type="text"
                          style={{
                            fontSize: "12px",
                            border: "solid 1px rgba(0, 0, 0, .2)",
                          }}
                          placeholder={"Key"}
                          maxLength={1}
                          onChange={(e) => {
                            MAMLTree[index].key = e.target.value;
                            setMAMLTree([...MAMLTree]);
                          }}
                        />
                      );
                      break;

                    case "interval":
                      res = (
                        <input
                          type="number"
                          style={{
                            fontSize: "12px",
                            border: "solid 1px rgba(0, 0, 0, .2)",
                          }}
                          placeholder={"Seconds"}
                          onChange={(e) => {
                            MAMLTree[index].interval = parseInt(e.target.value);
                            setMAMLTree([...MAMLTree]);
                          }}
                        />
                      );
                      break;

                    case "value":
                      res = (
                        <input
                          type="text"
                          style={{
                            fontSize: "12px",
                            border: "solid 1px rgba(0, 0, 0, .2)",
                          }}
                          placeholder={"Text"}
                          onChange={(e) => {
                            MAMLTree[index].value = e.target.value;
                            setMAMLTree([...MAMLTree]);
                          }}
                        />
                      );
                      break;
                  }

                  return <div key={idx}>{res}</div>;
                })}

                <IoMdClose
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let index = droppedItems.indexOf(item);
                    let isListener = listeners.includes(item);

                    let newDroppedItems = [...droppedItems];
                    let newDroppedItemsID = [...droppedItemsID];

                    let newMAMLTree = [...MAMLTree];

                    if (isListener) {
                      while (targets.includes(newDroppedItems[index + 1])) {
                        newDroppedItems.splice(index + 1, 1);
                        newDroppedItemsID.splice(index + 1, 1);
                        newMAMLTree.splice(index + 1, 1);
                      }
                    }

                    newDroppedItems.splice(index, 1);
                    setDroppedItems(newDroppedItems);

                    newDroppedItemsID.splice(index, 1);
                    setDroppedItemsID(newDroppedItems);

                    newMAMLTree.splice(index, 1);
                    setMAMLTree(newMAMLTree);
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
