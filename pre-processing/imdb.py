#!/usr/bin/env python3
################################################################################
# This module will help filter out movies from the data.tsv file from the
# title.basic.tsv dataset from IMDB.
################################################################################
import pandas as pd

tsv_default = "title.basics.tsv/data.tsv"


def movie_id_filter(location_of_tsv=tsv_default, to_csv=False):
    """
    movie_id_filter filters the data tsv file from title.basics.tsv based on
    if the imdb id was a movie or not. If specified, write the results in a csv
    file

    :param location_of_tsv: path to tsv file, defaults to tsv_default
    :type location_of_tsv: str object, optional
    :param to_csv: flag to write to csv or not, defaults to False
    :type to_csv: bool, optional
    :return: a pandas dataframe containing all imdb ids that are movies
    :rtype: dataframe object
    """
    # .tsv files are separated by tabs, pandas may toss an error for the
    # data.tsv due to how big it is
    data = pd.read_csv(location_of_tsv, sep='\t')
    filtered_data = data.loc[data["titleType"] == "movie"]
    # If true, convert filtered results to a csv file and write it
    if to_csv:
        filtered_data.to_csv("imdb_movies_id.csv", index=False)
    return filtered_data


if __name__ == "__main__":
    movie_id_filter(to_csv=True)
