#!/usr/bin/env python3
################################################################################
# This module will extract data from the omdb API using the movie id that was
# extracted from IMDB.
################################################################################
# It will require a "config.txt" file. The file should contain the following:
# api key
# row number to start on in the imdb_movies_id.csv
################################################################################
from urllib.request import urlopen
from urllib.error import HTTPError
import pandas as pd, csv, json
import sys

csv_default = 'imdb_movie_database.csv'
movie_id_csv = 'imdb_movies_id.csv'

def data_extraction(configs = None):
    """
    data_extraction takes the imdb id from movie_id_csv to get data from
    the omdb api and insert that data into csv_default
    """
    # Test if configurations are given
    if configs == None:
        sys.exit("No configurations given!")
    elif len(configs) != 2:
        sys.exit("Improper configurations given!")
    fieldnames = ['id', 'image_url', 'page_url', 'Title', 'Actors', 'Production',
                  'Director', 'Release_date', 'Genre',
                  'Awards', 'Critic_Score', 'Runtime']
    
    # Formulate api key and specify number of requests 
    # Note: max api calls is 1000 requests per day
    api_key = "".join(["&apikey=", config[0]])
    num_req = 1000
    # start reading data from line skiprow+1
    i = configs[1] 
    movie_ids = pd.read_csv(movie_id_csv, skiprows=(i - 1), nrows=num_req)
    csv_output = open(csv_default, 'a')
    writer = csv.DictWriter(csv_output, fieldnames=fieldnames)
    if csv_output.tell() == 0:
        # New csv, generate headers 
        writer.writeheader()
    for index, row in movie_ids.iterrows():
        extract_from_api = 'http://www.omdbapi.com/?i=' + row[0] + api_key 
        # Try to extract url key
        try:
            data = urlopen(extract_from_api).read()
        except HTTPError as err:
            if err.code == 401:
                print('Unauthorized 401 error, most likely api key limit reached!')
            else:
                print(f'HTTPS Error: {err.code}')
            break
        data = json.loads(data)
        
        # some of the imdb id's do not produce results in the api, this skips over those movie ids
        if 'Error' in data:
            continue
        else:
            csvoutput = csv.writer(csv_output)
            page_json = {
                        fieldnames[0]: i,
                        fieldnames[1]: data['Poster'] if 'Poster' in data else 'N/A',
                        fieldnames[2]: 'https://www.imdb.com/title/' + data['imdbID'] + '/' if 'imdbID' in data else 'N/A',
                        fieldnames[3]: data['Title'] if 'Title' in data else 'N/A',
                        fieldnames[4]: data['Actors'] if 'Actors' in data else 'N/A',
                        fieldnames[5]: data['Production'] if 'Production' in data else 'N/A',
                        fieldnames[6]: data['Director'] if 'Director' in data else 'N/A',
                        fieldnames[7]: data['Released'] if 'Released' in data else 'N/A',
                        fieldnames[8]: data['Genre'] if 'Genre' in data else 'N/A',
                        fieldnames[9]: data['Awards'] if 'Awards' in data else 'N/A',
                        fieldnames[10]: data['Ratings'] if 'Ratings' in data else 'N/A',
                        fieldnames[11]: data['Runtime'] if 'Runtime' in data else 'N/A'
            }
            writer.writerow(page_json)
            i += 1
    # Return original api key and new row index to start on
    return [config[0], i]

def get_config(config='config.txt'):
    """
    get_config will take a filename, and extract the api key to use, and the row
    number to start on
    """
    configurations = []
    with open(config, "r") as f:
        configurations = [line.strip() for line in f]
    if  len(configurations) != 2:
        sys.exit("Improper configurations! Check config file for only the api key and tuple id")
    configurations[1] = int(configurations[1])
    return configurations

# Main execution of the program
if __name__ == "__main__":
    # Get configurations for execution
    config_file = 'config.txt'
    config = get_config(config=config_file)
    # Begin extraction
    config = data_extraction(configs=config)
    # update config file
    with open(config_file, "w") as f:
        f.write(f'{config[0]}\n{config[1]}')
