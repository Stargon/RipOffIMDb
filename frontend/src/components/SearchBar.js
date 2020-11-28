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
    this.state = { ratingMin: 20, ratingMax: 37, ratingValue: 30 };
    // ES6 methods need to be binding to this instance
    this.onRequestSearchEvent = this.onRequestSearchEvent.bind(this);
    this.valuetext = this.valuetext.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Event handler to return the query
  onRequestSearchEvent(query) {
    alert(query);
    this.props.query(query);
  }

  valuetext(value) {
    return `${value}°C`;
  }
  handleChange = (event, newValue) => {
    this.setState({ ratingMax: newValue });
  };

  render() {
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
          <div style={{ width: "100%" }}>
            <Box display="flex" flexDirection="row" p={1} m={1}>
              <Box p={1}>
                <TextField
                  defaultValue="actor"
                  colorV="secondary"
                  style={{ margine: "0 auto" }}
                ></TextField>
              </Box>
              <Box p={1}>
                <TextField
                  defaultValue="actor"
                  colorV="secondary"
                  style={{ margine: "0 auto" }}
                ></TextField>
              </Box>
              <Box p={1}>
                <Typography id="range-slider" gutterBottom>
                  Rating
                </Typography>
                <Slider
                  value={this.state.rangeValue}
                  onChange={(event, newValue) =>
                    this.handleChange(event, newValue)
                  }
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  getAriaValueText={this.valuetext}
                  color="secondary"
                />
              </Box>
            </Box>
          </div>
        </AppBar>
      </React.Fragment>
    );
  }
}
