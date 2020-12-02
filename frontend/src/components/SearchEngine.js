import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextBar from "./SearchBar";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// Figure out fallback image later
import FALLBACK_IMAGE from "../images/temp_fallback.png";

const serverEndpoint = "http://localhost:5000/";

export default class SearchEngine extends React.Component {
  constructor(props) {
    // Set default props and state values
    super(props);
    this.state = { query: "", results: [], error: null, isLoaded: true };
    // Bind functions to this class
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
    this.makeStyles = this.makeStyles.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handleAdvancedUpdate = this.handleAdvancedUpdate.bind(this);
  }

  handleQueryUpdate = async (update) => {
    // Set default state for new query in update while loading
    this.setState({ isLoaded: false, error: null, results: [] });
    if (update !== "" && update !== undefined && this.state.query !== update) {
      // Updated query is different than current query, begin fetching data

      // Format simple request string, and fetch results
      this.setState({ query: update });
      const request = `${serverEndpoint}?searchType=basic&keywordQuery=${update}`;
      await fetch(request)
        .then((res) => res.json())
        .then(
          (response) => {
            // Response received, save results
            this.setState({ isLoaded: true, results: response });
          },
          (err) => {
            // Error in communicating to the server
            this.setState({ error: err, isLoaded: true, results: null });
          }
        );
    } else if (this.state.query === update) {
      // update is not different than current query, do not clear page
      this.setState({ isLoaded: true });
    } else {
      // no input given, clear page
      this.setState({ isLoaded: true, query: "" });
    }
  };

  handleAdvancedUpdate = (advancedUpdated) => {
    this.setState({ advanced: advancedUpdated });
  };

  handleViewClick = (url) => {
    window.open(url, "_blank");
  };

  handleImageError = (event) => {
    event.target.src = FALLBACK_IMAGE;
  };

  renderSearch = (classes) => {
    if (!this.state.results) {
      // Results do not exist (maybe in a middle of a promise/state change),
      // do not render
      return null;
    } else if (this.state.results.length === 0 && this.state.query !== "") {
      // No results were found for a specific query
      return <Typography>No results were found!</Typography>;
    }
    // Render all the items from the fetch results
    return (
      <Grid item>
        <CssBaseline />
        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {
                // From example constant, map a card for each element
                // (adjust with json object later)
                // Note that example uses labels that are capital, adjust them
                // later based on response from Whoosh backend
                this.state.results.map((movie) => (
                  <Grid item key={movie} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        component="img"
                        image={movie.image_url}
                        title={movie.title}
                        onError={this.handleImageError}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {movie.title}
                        </Typography>
                        <Typography>
                          {movie.genre.includes("N/A")
                            ? "No genres listed"
                            : movie.genre}
                        </Typography>
                        <Typography>
                          {movie.runtime.includes("N/A")
                            ? "Runtime unavailable"
                            : movie.runtime}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => this.handleViewClick(movie.page_url)}
                          color="primary"
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Container>
        </main>
      </Grid>
    );
  };

  makeStyles(theme) {
    return {
      icon: {
        marginRight: theme.spacing(2),
      },
      heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
      },
      heroButtons: {
        marginTop: theme.spacing(4),
      },
      cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      },
      card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
      cardMedia: {
        paddingTop: "56.25%", // 16:9
      },
      cardContent: {
        flexGrow: 1,
      },
      footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
      },
    };
  }

  render() {
    const update = this.state.query;
    const classes = makeStyles();
    const { error, isLoaded, results } = this.state;
    let searchResults = null;

    if (error) {
      // Error in communicating with the server, render the error message
      searchResults = (
        <Typography inline variant="body1" align="center">
          Error: {error.message}
        </Typography>
      );
    } else if (!isLoaded) {
      // Let user know the webpage is loading
      searchResults = <div>Loading...</div>;
    } else if ((update !== "" && update !== undefined) || results.length >= 0) {
      // Conditionally render the results
      searchResults = this.renderSearch(classes);
    }
    // Render the app
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextBar
              query={this.handleQueryUpdate}
              advanced={this.handleAdvancedUpdate}
            ></TextBar>
          </Grid>
          {searchResults}
        </Grid>
      </React.Fragment>
    );
  }
}
