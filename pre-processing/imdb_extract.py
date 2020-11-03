#!/usr/bin/env python3
################################################################################
# This module will extract data from the omdb API using the movie id that was
# extracted from IMDB.
################################################################################
from urllib.request import urlopen
import pandas as pd, csv, json
import sys

csv_default = 'movie_database.csv'
movie_id_csv = 'imdb_movies_id.csv'

def data_extraction(configs = None):
    """
    data_extraction takes the imdb id from movie_id_csv to get data from
    the omdb api and insert that data into csv_default
    """
    # Test if configurations are given
    if configs == None or len(configs) != 2:
        sys.exit("No configurations given!")
    elif len(configs) != 2:
        sys.exit("Improper configurations given!")
#    fieldnames = ['id', 'image_url', 'page_url', 'Title', 'Actors', 'Production',
#                  'Director', 'Release_date', 'Genre',
#                  'Awards', 'Critic_Score', 'Runtime']
#    
#    # start reading data from line skiprow+1, read only 1000 lines at a time (limit on total api calls per day)
#    movie_ids = pd.read_csv(movie_id_csv, skiprows=370999, nrows=1000)
#    csv_output = open(csv_default, 'a')
#    writer = csv.DictWriter(csv_output, fieldnames=fieldnames)
#    writer.writeheader()
#    i = 371000
#    for index, row in movie_ids.iterrows():
#        extract_from_api = 'http://www.omdbapi.com/?i=' + row[0] + '&apikey=da105487'
#        data = urlopen(extract_from_api).read()
#        data = json.loads(data)
#        
#        # some of the imdb id's do not produce results in the api, this skips over those movie ids
#        if 'Error' in data:
#            continue
#        else:
#            csvoutput = csv.writer(csv_output)
#            page_json = {
#                        fieldnames[0]: i,
#                        fieldnames[1]: data['Poster'],
#                        fieldnames[2]: 'https://www.imdb.com/title/' + data['imdbID'] + '/',
#                        fieldnames[3]: data['Title'],
#                        fieldnames[4]: data['Actors'],
#                        fieldnames[5]: data['Production'],
#                        fieldnames[6]: data['Director'],
#                        fieldnames[7]: data['Released'],
#                        fieldnames[8]: data['Genre'],
#                        fieldnames[9]: data['Awards'],
#                        fieldnames[10]: data['Ratings'],
#                        fieldnames[11]: data['Runtime']
#            }
#            writer.writerow(page_json)
#            i += 1

def get_config(config='config.txt'):
    configurations = []
    with open(config, "r") as f:
        configurations = [line.strip() for line in f]
    if  len(configurations) != 2:
        sys.exit("Improper configurations! Check config file for only thte api key and tuple id")
    configurations[1] = int(configurations[1])
    return configurations


if __name__ == "__main__":
    config = get_config()
    data_extraction(configs=config)