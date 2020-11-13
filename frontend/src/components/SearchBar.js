import SearchBar from "material-ui-search-bar";
import React from "react";

export default class TextBar extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: ""
    }
  }

  render() {
    return(
      <SearchBar
        value = {this.state.value}
        onChange={(newValue) => this.setState({ value: newValue })}
        onRequestSearch={() => alert(this.state.value)}
        onClear={() => console.log('onClear')}
      />
    )
  }
}
