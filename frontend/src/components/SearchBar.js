import SearchBar from "material-ui-search-bar";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

export default class TextBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="relative">
          <Toolbar>
            <SearchBar
              value={this.state.value}
              onChange={(newValue) => this.setState({ value: newValue })}
              onRequestSearch={() => alert(this.state.value)}
              onClear={() => console.log("onClear")}
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
