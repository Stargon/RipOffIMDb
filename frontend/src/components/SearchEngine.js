import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextBar from "./SearchBar";


import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const example = {
    185001: {
        Image:
            "https://m.media-amazon.com/images/M/MV5BNTliYTBhNTEtM2ZhNi00NThiLTg5NDktMzU2YTE3NDVjNmY4XkEyXkFqcGdeQXVyNzMzMjU5NDY@._V1_SX300.jpg",
        URL: "https://www.imdb.com/title/tt0364961/",
        Title: "The Assassination of Richard Nixon",
        "Actor Name": "Sean Penn, Naomi Watts, Don Cheadle, Jack Thompson",
        Production: "Appian Way, Anhelo Productions",
        Director: "Niels Mueller",
        "Release Date": "22-Oct-04",
        Genre: "Biography, Crime, Drama, History, Thriller",
        Awards: "2 wins & 4 nominations.",
        "Critic Score":
            "[{'Source': 'Internet Movie Database', 'Value': '7.0/10'}, {'Source': 'Rotten Tomatoes', 'Value': '67%'}, {'Source': 'Metacritic', 'Value': '63/100'}]",
        Runtime: "95 min",
    },
    1555: {
        Image:
            "https://m.media-amazon.com/images/M/MV5BNTliYTBhNTEtM2ZhNi00NThiLTg5NDktMzU2YTE3NDVjNmY4XkEyXkFqcGdeQXVyNzMzMjU5NDY@._V1_SX300.jpg",
        URL: "https://www.imdb.com/title/tt0364961/",
        Title: "The Assassination of Richard Nixon",
        "Actor Name": "Sean Penn, Naomi Watts, Don Cheadle, Jack Thompson",
        Production: "Appian Way, Anhelo Productions",
        Director: "Niels Mueller",
        "Release Date": "22-Oct-04",
        Genre: "Biography, Crime, Drama, History, Thriller",
        Awards: "2 wins & 4 nominations.",
        "Critic Score":
            "[{'Source': 'Internet Movie Database', 'Value': '7.0/10'}, {'Source': 'Rotten Tomatoes', 'Value': '67%'}, {'Source': 'Metacritic', 'Value': '63/100'}]",
        Runtime: "95 min",
    },
};

export default class SearchEngine extends React.Component {
    constructor(props) {
        super(props);
        this.state = { query: "" };
        this.handleQueryUpdate = this.handleQueryUpdate.bind(this);
        this.makeStyles = this.makeStyles.bind(this);
    }

    handleQueryUpdate = (update) => {
        this.setState({ query: update });
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
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            cardMedia: {
                paddingTop: '56.25%', // 16:9
            },
            cardContent: {
                flexGrow: 1,
            },
            footer: {
                backgroundColor: theme.palette.background.paper,
                padding: theme.spacing(6),
            },
        }
    };

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
                <AppBar position="relative">
                    <Toolbar>
                        <CameraIcon className={classes.icon} />
                        <Typography variant="h6" color="inherit" noWrap>
                            Album layout
          </Typography>
                    </Toolbar>
                </AppBar>
                <main>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Album layout
            </Typography>
                            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                                Something short and leading about the collection below—its contents, the creator, etc.
                                Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                                entirely.
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
                    </div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {cards.map((card) => (
                                <Grid item key={card} xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://source.unsplash.com/random"
                                            title="Image title"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Heading
                    </Typography>
                                            <Typography>
                                                This is a media card. You can use this section to describe the content.
                    </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                                View
                    </Button>
                                            <Button size="small" color="primary">
                                                Edit
                    </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
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
