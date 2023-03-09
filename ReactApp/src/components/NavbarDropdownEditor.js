import React from "react";

class NavbarDropdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [0].map(function (i) {
        return {
          i: i,
          value: "",
        };
      }),
      itemCounter: 1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addEntry = this.addEntry.bind(this);
  }

  addEntry(event) {
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: this.state.itemCounter,
        value: "",
      }),
      // Increment the counter to ensure key is always unique.
      itemCounter: this.state.itemCounter + 1,
    });
    event.preventDefault();
  }

  handleChange(idx, e) {
    this.setState(({items}) => ({
        items: [
            ...items.slice(0, idx),
            {
                ...items[idx],
                value: e.target.value,
            },
            ...items.slice(idx + 1)
        ]
    }));
  }

  handleSubmit(event) {
    this.props.setDropdownItems(this.state.items);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.items.map((item) => (
          <div key={item.i}>
            <label>
              Button Name:
              <input
                type="text"
                value={item.value}
                onChange={(e) => this.handleChange(item.i, e)}
              />
            </label>
          </div>
        ))}

        <button onClick={this.addEntry}>Add Entry</button>
        <input type="submit" value="Create" />
      </form>
    );
  }
}

export default NavbarDropdownEditor;
