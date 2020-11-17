import SearchBar from "material-ui-search-bar"
import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

export default class TextBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    // ES6 methods need to be binding to this instance
    this.onRequestSearchEvent = this.onRequestSearchEvent.bind(this)
  }

  // Event handler to return the query
  onRequestSearchEvent(query) {
    alert(query)
    this.props.query(query)
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="relative">
          <Toolbar>
            <SearchBar
              value={this.state.value}
              onChange={(newValue) => this.setState({ value: newValue })}
              onRequestSearch={() => { this.onRequestSearchEvent(this.state.value) }}
              style={{
                margin: "0 auto",
                width: "80%"
              }}
            />
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}
