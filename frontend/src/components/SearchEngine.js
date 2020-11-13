import React from "react"

import TextBar from "./SearchBar"

const example = {
    "185001": {
        "Image"         : "https://m.media-amazon.com/images/M/MV5BNTliYTBhNTEtM2ZhNi00NThiLTg5NDktMzU2YTE3NDVjNmY4XkEyXkFqcGdeQXVyNzMzMjU5NDY@._V1_SX300.jpg",
        "URL"           : "https://www.imdb.com/title/tt0364961/",
        "Title"         : "The Assassination of Richard Nixon",
        "Actor Name"    : "Sean Penn, Naomi Watts, Don Cheadle, Jack Thompson",
        "Production"    : "Appian Way, Anhelo Productions",
        "Director"      : "Niels Mueller",
        "Release Date"  : "22-Oct-04",
        "Genre"         : "Biography, Crime, Drama, History, Thriller",
        "Awards"        : "2 wins & 4 nominations.",
        "Critic Score"  : "[{'Source': 'Internet Movie Database', 'Value': '7.0/10'}, {'Source': 'Rotten Tomatoes', 'Value': '67%'}, {'Source': 'Metacritic', 'Value': '63/100'}]",
        "Runtime"       : "95 min"
    }
}


export default class SearchEngine extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){
        return(
            <TextBar></TextBar>
        )
    }
}