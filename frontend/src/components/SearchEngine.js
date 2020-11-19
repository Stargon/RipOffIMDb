import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextBar from "./SearchBar";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

// Figure out fallback image later
import FALLBACK_IMAGE from '../images/temp_fallback.png'

const example = [
  {
    id: 185004,
    image: "https://m.media-amazon.com/images/M/MV5BMjA4ODMzNTE0OF5BMl5BanBnXkFtZTcwOTg5NDIzMQ@@._V1_SX300.jpg",
    url: "https://www.imdb.com/title/tt0364977/",
    title: "Bangkok Haunted",
    actors: "Pimsiree Pimsee, Pramote Seangsorn, Dawan Singha-Wee, Kalyanut Sriboonrueng",
    production: "N/A",
    director: "Oxide Chun Pang, Pisut Praesangeam",
    release_date: "26-Jul-05",
    genre: "Horror, Mystery",
    awards: "N/A",
    critics: "[{'Source': 'Internet Movie Database', 'Value': '5.1/10'}, {'Source': 'Rotten Tomatoes', 'Value': '32%'}]",
    runtime: "130 min",
  },
  {
    id: 388886,
    image: "N/A",
    url: "https://www.imdb.com/title/tt3162318/",
    title: "Star Wars: Tremors of the Force",
    actors: "Stephen Chang, Patricia Raven, Ed Bergtold, Frank Hernandez",
    production: "N/A",
    director: "John Bardy",
    release_date: "N/A",
    genre: "Sci-Fi",
    awards: "N/A",
    critics: [],
    runtime: "N/A",
  },
  {
    id: 388887,
    image: "N/A",
    url: "https://www.imdb.com/title/tt3162324/",
    title: "Sinifta senlik",
    actors: "Necla Nazir, Sema Koçak, Günseli Çelenk, Nalan Akbay",
    production: "N/A",
    director: "Atilla Gökbürü",
    release_date: "N/A",
    genre: "Comedy, Romance",
    awards: "N/A",
    critics: "[{'Source': 'Internet Movie Database', 'Value': '4.4/10'}]",
    runtime: "77 min",
  },
];

export default class SearchEngine extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: "" };
    this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
    this.makeStyles = this.makeStyles.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }

  handleQueryUpdate = (update) => {
    this.setState({ query: update });
  };

  handleViewClick = (url) => {
    window.open(url, "_blank");
  };

  handleImageError = event => {
      event.target.src = FALLBACK_IMAGE
  }

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
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const classes = makeStyles();

    if (update !== "") {
      //  render everything
      return (
        <React.Fragment>
          <TextBar query={this.handleQueryUpdate}></TextBar>
          <CssBaseline />
          {/* <AppBar position="relative">
            <Toolbar>
              <CameraIcon className={classes.icon} />
              <Typography variant="h6" color="inherit" noWrap>
                Album layout
              </Typography>
            </Toolbar>
          </AppBar> */}
          <main>
            {/* Hero unit */}
            {/* <div className={classes.heroContent}>
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  Album layout
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="textSecondary"
                  paragraph
                >
                  Something short and leading about the collection below—its
                  contents, the creator, etc. Make it short and sweet, but not
                  too short so folks don&apos;t simply skip over it entirely.
                </Typography>
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <Button variant="contained" color="primary">
                        Main call to action
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" color="primary">
                        Secondary action
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </div> */}
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              <Grid container spacing={4}>
                {
                  // From example constant, map a card for each element
                  // (adjust with json object later)
                  // Note that example uses labels that are capital, adjust them
                  // later based on response from Whoosh backend
                  example.map((movie) => (
                    <Grid item key={movie} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          component="img"
                          image={movie.image}
                          title={movie.title}
                          onError={this.handleImageError}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {movie.title}
                          </Typography>
                          <Typography>{movie.genre.includes("N/A")? "No genres listed" : movie.genre}</Typography>
                          <Typography>{movie.runtime.includes("N/A")? "Runtime unavailable" : movie.runtime}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() => this.handleViewClick(movie.url)}
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
        </React.Fragment>
      );
    } else {
      // No results, just display searchbar
      return <TextBar query={this.handleQueryUpdate}></TextBar>;
    }
  }
}
