import SearchBar from "material-ui-search-bar";
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

export default class TextBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rating: [25, 75] };
    // ES6 methods need to be binding to this instance
    this.onRequestSearchEvent = this.onRequestSearchEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleActorChange = this.handleActorChange.bind(this)
  }

  // Event handler to return the query
  onRequestSearchEvent(query) {
    alert(query);
    this.props.query(query);
    this.setState({ query: query });
  }
  
  handleChange = (event, newValue) => {
    this.setState({rating: newValue})
  };

  handleKeyPress = (event) => {
    if(event.key === "Enter"){
      alert(this.state.actor)
    }
  }

  handleActorChange(event) {
    this.setState({actor: event.target.value})
  }

  // Additional render options
  renderOptions = () => {
    return (
      <div style={{ width: "100%" }}>
        <Box display="flex" flexDirection="row" p={1} m={1} justifyContent="center">
          <Box p={1}>
            <TextField
              label="Actor"
              color="secondary"
              style={{ margine: "0 auto" }}
              variant="outlined"
              onChange={this.handleActorChange}
              onKeyDown={this.handleKeyPress}
            ></TextField>
          </Box>
          <Box p={1}>
            <TextField
              defaultValue="production"
              colorV="secondary"
              style={{ margine: "0 auto" }}
            ></TextField>
          </Box>
          <Box p={1}>
            <TextField
              defaultValue="director"
              colorV="secondary"
              style={{ margine: "0 auto" }}
            ></TextField>
          </Box>
          <Box p={1}>
            <TextField
              defaultValue="production"
              colorV="secondary"
              style={{ margine: "0 auto" }}
            ></TextField>
          </Box>
          <Box p={.5}  flexGrow={1}>
            <Typography id="range-slider" gutterBottom>
              Rating
            </Typography>
            <Slider
              value={this.state.rating}
              onChange={(event, newValue) => this.handleChange(event, newValue)}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={this.valuetext}
              color="secondary"
            />
          </Box>
        </Box>
      </div>
    );
  };

  render() {
    let advancedSearchOptions = null;
    if (this.state.query !== "" && this.state.query !== undefined) {
      advancedSearchOptions = this.renderOptions();
    }
    return (
      <React.Fragment>
        <AppBar position="relative">
          <Toolbar>
            <SearchBar
              value={this.state.value}
              onChange={(newValue) => this.setState({ value: newValue })}
              onRequestSearch={() => {
                this.onRequestSearchEvent(this.state.value);
              }}
              style={{
                margin: "0 auto",
                width: "100%",
              }}
            />
          </Toolbar>
          {advancedSearchOptions}
        </AppBar>
      </React.Fragment>
    );
  }
}
