/* There is a lot of logic, will need to refactor and break out later */

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
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Alert } from "@material-ui/lab";
import LinearProgress from "@material-ui/core/LinearProgress";

// Figure out fallback image later
import FALLBACK_IMAGE from "../images/temp_fallback.png";

const serverEndpoint = "http://localhost:5000/";

export default class SearchEngine extends React.Component {
  constructor(props) {
    // Set default props and state values
    super(props);
    this.state = {
      query: "",
      isFuzzy: false,
      toWhoosh: undefined,
      advanced: "",
      results: [],
      error: null,
      isLoaded: true,
      changedFuzzy: false,
      isPage: false,
      nextPage: null,
      prevPage: 0,
      process: false,
    };
    // Bind functions to this class
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
    this.fetchQuery = this.fetchQuery.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.renderSearch = this.renderSearch.bind(this);
    this.handleAdvancedUpdate = this.handleAdvancedUpdate.bind(this);
    this.isAdvancedUpdate = this.isAdvancedUpdate.bind(this);
    this.fetchAdvanced = this.fetchAdvanced.bind(this);
    this.handleFuzzyUpdate = this.handleFuzzyUpdate.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
  }

  handleFuzzyUpdate = (fuzzyUpdate) => {
    if (fuzzyUpdate === "" && this.state.isFuzzy !== false) {
      this.setState({ isFuzzy: false, toWhoosh: undefined });
    } else if (
      fuzzyUpdate === "BK-Tree Fuzzy" &&
      this.state.toWhoosh !== false
    ) {
      this.setState({ isFuzzy: true, toWhoosh: false });
    } else {
      this.setState({ isFuzzy: true, toWhoosh: true });
    }
    this.setState({ changedFuzzy: true });
  };

  handleQueryUpdate = async (update) => {
    // Make sure nextPage is set before continueing
    await new Promise((accept) => this.setState({ nextPage: 1 }, accept));
    await this.fetchQuery(update, 1);
  };

  fetchQuery = async (update, pageNumber) => {
    // Set default state for new query in update while loading
    if (
      update !== "" &&
      update !== undefined &&
      (this.state.query !== update ||
        this.state.changedFuzzy === true ||
        pageNumber !== this.state.nextPage ||
        typeof this.state.advanced !== "string")
    ) {
      // Updated query is different than current query, begin fetching data
      this.setState({ isLoaded: false, error: null });

      // Format simple request string, and fetch results (check for fuzzy first)
      let request = `${serverEndpoint}?searchType=basic&keywordQuery=${update}&pageNumber=${this.state.nextPage}`;
      if (this.state.isFuzzy === true) {
        // Fuzzy is given, give the proper filters
        request += `&fuzzySearch=${this.state.isFuzzy}&whoosh=${this.state.toWhoosh}`;
      }
      await fetch(request)
        .then((res) => res.json())
        .then(
          (response) => {
            // Response received, save results
            this.setState({
              query: update,
              advanced: "",
              isLoaded: true,
              results: response.results,
              changedFuzzy: false,
              nextPage: response.nextPage,
              prevPage: response.prevPage,
              process: false,
            });
          },
          (err) => {
            // Error in communicating to the server
            this.setState({
              error: err,
              isLoaded: true,
              results: [],
              advanced: "",
              changedFuzzy: false,
              process: false,
              nextPage: null,
            });
          }
        );
    } else if (this.state.query === update) {
      // update is not different than current query, do not clear page
      this.setState({ isLoaded: true });
    } else if (update === undefined || update === "") {
      // no input given, clear page
      this.setState({
        isLoaded: true,
        query: "",
        advanced: "",
        results: [],
        changedFuzzy: false,
        nextPage: null,
      });
    }
  };

  handleAdvancedUpdate = async (update) => {
    // Make sure nextPage is set before continueing
    await new Promise((accept) => this.setState({ nextPage: 1 }, accept));
    await this.fetchAdvanced(update, 1);
  };

  fetchAdvanced = async (update, pageNumber) => {
    if (update === "") return;
    if (
      update !== "" &&
      update !== undefined &&
      (!this.isAdvancedUpdate(update) ||
        this.state.changedFuzzy === true ||
        pageNumber !== this.state.nextPage)
    ) {
      let { query, actor, production, director, genre, runtime } = update;
      let request = "";
      if (runtime[0] === 0 && runtime[1] === 0) {
        request = `${serverEndpoint}?searchType=advanced&keywordQuery=${query}&actor=${actor}&production=${production}&director=${director}&genre=${genre}&pageNumber=${this.state.nextPage}`;
      } else {
        request = `${serverEndpoint}?searchType=advanced&keywordQuery=${query}&actor=${actor}&production=${production}&director=${director}&genre=${genre}&runtime=${runtime[0]}-${runtime[1]}&pageNumber=${this.state.nextPage}`;
      }
      /* CURRENT BUG */
      // Advanced search will not filter on BK Tree, and will return results from not filtered results
      if (this.state.isFuzzy === true) {
        // Fuzzy is given, give the proper filters
        request += `&fuzzySearch=${this.state.isFuzzy}&whoosh=${this.state.toWhoosh}`;
      }
      await new Promise((accept) =>
        this.setState(
          { isLoaded: false, error: null, advanced: update },
          accept
        )
      );
      await fetch(request)
        .then((res) => res.json())
        .then(
          (response) => {
            // Response received, save results
            this.setState({
              isLoaded: true,
              results: response.results,
              nextPage: response.nextPage,
              prevPage: response.prevPage,
            });
          },
          (err) => {
            // Error in communicating to the server
            this.setState({
              error: err,
              isLoaded: true,
              results: [],
              nextPage: null,
            });
          }
        );
    } else if (this.isAdvancedUpdate(update)) {
      this.setState({ isLoaded: true });
    } else {
      this.setState({ isLoaded: true, advanced: "", nextPage: null });
    }
    this.setState({ changedFuzzy: false });
  };

  isAdvancedUpdate = (tags) => {
    return JSON.stringify(tags) === JSON.stringify(this.state.advanced);
  };

  handleViewClick = (url) => {
    window.open(url, "_blank");
  };

  handleImageError = (event) => {
    event.target.src = FALLBACK_IMAGE;
  };

  handleNextPage = async () => {
    // Increment pages (compare to old page)
    const oldNext = this.state.nextPage - 1;
    if (this.state.advanced === "") {
      await this.fetchQuery(this.state.query, oldNext);
    } else {
      await this.fetchAdvanced(this.state.advanced, oldNext);
    }
  };

  handlePrevPage = async () => {
    // Decrement pages (compare to newer page)
    // Need to set newPage to prePage as the query reads newPage
    const oldPrev = this.state.prevPage + 1;
    await new Promise((accept) =>
      this.setState({ nextPage: this.state.prevPage }, accept)
    );
    if (this.state.advanced === "") {
      await this.fetchQuery(this.state.query, oldPrev);
    } else {
      await this.fetchAdvanced(this.state.advanced, oldPrev);
    }
  };

  renderSearch = () => {
    if (!this.state.results) {
      // Results do not exist (maybe in a middle of a promise/state change),
      // do not render
      return null;
    }
    // Render all the items from the fetch results
    return (
      <Grid item xs={12}>
        <CssBaseline />
        <main>
          <Container >
            {/* End hero unit */}
            <Grid container spacing={4} alignItems="stretch">
              {
                // From example constant, map a card for each element
                this.state.results.map((movie) => (
                  <Grid item key={movie} xs={12} sm={6} md={4}>
                    <Card  variant="outlined" style={{height:610, overflow: "auto", overflowY:"auto"}}>
                      <CardMedia
                        component="img"
                        image={movie.image_url}
                        title={movie.title}
                        onError={this.handleImageError}
                      />
                      <CardContent justifyContent="center">
                        {
                          // Render title
                        }
                        <Typography gutterBottom variant="h5" component="h2">
                          {movie.title}
                        </Typography>
                        {
                          // Render Actors
                        }
                        <Typography>
                          <Box display="flex" flexDirection="row" m={0.5}>
                            <Box
                              fontWeight="fontWeightBold"
                              justifyContent="left"
                            >
                              Actors:
                            </Box>
                            <Box flexGrow={1} pl={2} align="left">
                              {movie.actors.includes("nan")
                                ? "No actors listed"
                                : movie.actors}
                            </Box>
                          </Box>
                        </Typography>
                        <Typography>
                          {movie.genre.includes("nan")
                            ? "No genres listed"
                            : movie.genre}
                        </Typography>
                        <Typography>
                          {movie.runtime === 0
                            ? "Runtime unavailable"
                            : `Runtime: ${movie.runtime}`}
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

  render() {
    const update = this.state.query;
    const { error, isLoaded, results } = this.state;

    // Fancy error hanadling
    let loadOrErrorPrompt = null;
    if (error) {
      // Error in communicating with the server, render the error message
      loadOrErrorPrompt = (
        <Alert variant="filled" severity="error">
          Error found! — <strong>{error.message}</strong>
        </Alert>
      );
    } else if (!isLoaded) {
      // Let user know the webpage is loading
      loadOrErrorPrompt = (
        <Grid styles={{ justifyContent: "center" }} align="center">
          <LinearProgress color="secondary" />
        </Grid>
      );
    } else if (this.state.results.length === 0 && this.state.query !== "") {
      // No results were found for a specific query
      loadOrErrorPrompt = <Alert severity="warning">No results found!</Alert>;
    }

    // Render results if able
    let searchResults = null;
    if ((update !== "" && update !== undefined) || results.length >= 0) {
      // Conditionally render the results
      searchResults = this.renderSearch();
    }

    // Render pagination if able
    let prevButton = null;
    let nextButton = null;
    if (this.state.prevPage > 0 && this.state.results.length > 0) {
      prevButton = (
        <Fab
          color="secondary"
          style={{
            margin: 0,
            top: "auto",
            right: "auto",
            bottom: 20,
            left: 20,
            position: "fixed",
          }}
          onClick={this.handlePrevPage}
        >
          <NavigateBeforeIcon />
        </Fab>
      );
    }
    if (this.state.nextPage !== null && this.state.results.length > 0) {
      nextButton = (
        <Fab
          color="primary"
          style={{
            margin: 0,
            top: "auto",
            right: 20,
            bottom: 20,
            left: "auto",
            position: "fixed",
          }}
          onClick={this.handleNextPage}
        >
          <NavigateNextIcon />
        </Fab>
      );
    }

    // Render the app
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextBar
              query={this.handleQueryUpdate}
              fuzzy={this.handleFuzzyUpdate}
              advanced={this.handleAdvancedUpdate}
            ></TextBar>
            {loadOrErrorPrompt}
          </Grid>
          {searchResults}
        </Grid>
        {prevButton}
        {nextButton}
      </React.Fragment>
    );
  }
}
