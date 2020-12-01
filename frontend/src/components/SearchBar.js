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
    this.state = { actor: "", production: "", director: "", rating: [25, 75] };
    this.cleanState = this.state;
    // ES6 methods need to be binding to this instance
    this.onRequestSearchEvent = this.onRequestSearchEvent.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleActorChange = this.handleActorChange.bind(this);
    this.handleProductionChange = this.handleProductionChange.bind(this);
    this.handleDirectorChange = this.handleDirectorChange.bind(this);
    this.handleAdvancedUpdateChanges = this.handleAdvancedUpdateChanges.bind(
      this
    );
  }

  // Event handler to return the query
  onRequestSearchEvent(query) {
    alert(query);
    this.setState(this.cleanState);
    this.props.query(query);
    this.props.advanced("");
    this.setState({ query: query });
  }

  handleSliderChange = (event, newValue) => {
    this.setState({ rating: newValue });
    this.handleAdvancedUpdateChanges();
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleAdvancedUpdateChanges();
    }
  };

  handleAdvancedUpdateChanges = () => {
    let tags = {
      actor: this.state.actor,
      production: this.state.production,
      director: this.state.director,
      runtime: this.state.rating,
    };
    tags = JSON.stringify(tags);
    this.props.advanced(tags);
  };

  handleActorChange(event) {
    this.setState({ actor: event.target.value });
  }

  handleProductionChange(event) {
    this.setState({ production: event.target.value });
  }
  handleDirectorChange(event) {
    this.setState({ director: event.target.value });
  }

  // Additional render options
  renderOptions = () => {
    return (
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          flexDirection="row"
          p={1}
          m={1}
          justifyContent="center"
        >
          <Box p={1}>
            <TextField
              value={this.state.actor}
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
              value={this.state.production}
              label="Production"
              color="secondary"
              style={{ margine: "0 auto" }}
              variant="outlined"
              onChange={this.handleProductionChange}
              onKeyDown={this.handleKeyPress}
            ></TextField>
          </Box>
          <Box p={1}>
            <TextField
              value={this.state.director}
              label="Director"
              color="secondary"
              style={{ margine: "0 auto" }}
              variant="outlined"
              onChange={this.handleDirectorChange}
              onKeyDown={this.handleKeyPress}
            ></TextField>
          </Box>
          <Box p={0.5} flexGrow={1}>
            <Typography id="range-slider" gutterBottom>
              Runtime
            </Typography>
            <Slider
              value={this.state.rating}
              onChange={(event, newValue) =>
                this.handleSliderChange(event, newValue)
              }
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
