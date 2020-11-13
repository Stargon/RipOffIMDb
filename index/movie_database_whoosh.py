#!/usr/bin/python

import whoosh
import csv
from whoosh.index import create_in, open_dir, exists_in, Index
from whoosh.fields import *
from whoosh.qparser import QueryParser, MultifieldParser
from whoosh import qparser
import pandas as pd

csv_file = '../pre-processing/imdb_movie_database.csv'


class WhooshSearch(object):
    def __init__(self):
        super(WhooshSearch, self).__init__()
        self.page_size = 10

    def basicSearch(self, query_entered):
        returnables = list()
        with self.indexer.searcher() as search:
            query = MultifieldParser(['Title'], schema=self.indexer.schema)
            query = query.parse(query_entered)
            results = search.search(query, limit=None, terms=True)

            # return the stored attributes
            count = 0
            for result in results:
                if count == self.page_size:
                    break
                returnables.append((result['id'], result['page_url'], result['image_url'], result['Title'],
                                    result['Actors'], result['Production'], result['Director'], result['Release_date'],
                                    result['Genre'], result['Awards'], result['Critic_Score'], result['RunTime']))
                count += 1
            return returnables, len(results)

    def index(self):
        """ Establishes the whoosh database for the documents in our csv file
            Only indexes if a database does not already exist
            All fields of extracted data are indexed for the advanced search
            """
        schema = Schema(id=ID(stored=True),
                        image_url=TEXT(stored=True),
                        page_url=TEXT(stored=True),
                        Title=TEXT(stored=True),
                        Actors=TEXT(stored=True),
                        Production=TEXT(stored=True),
                        Director=TEXT(stored=True),
                        Release_date=TEXT(stored=True),
                        Genre=TEXT(stored=True),
                        Awards=TEXT(stored=True),
                        Critic_Score=TEXT(stored=True),
                        RunTime=TEXT(stored=True))

        if (exists_in('indexdir') != True):
            indexer = create_in('indexdir', schema)
            writer = indexer.writer()

            df = pd.read_csv(csv_file)

            for i in range(len(df)):
                writer.add_document(id=str(df.loc[i, 'id']),
                                    image_url=str(df.loc[i, 'image_url']),
                                    page_url=str(df.loc[i, 'page_url']),
                                    Title=str(df.loc[i, 'Title']),
                                    Actors=str(df.loc[i, 'Actors']),
                                    Production=str(df.loc[i, 'Production']),
                                    Director=str(df.loc[i, 'Director']),
                                    Release_date=str(df.loc[i, 'Release_date']),
                                    Genre=str(df.loc[i, 'Genre']),
                                    Awards=str(df.loc[i, 'Awards']),
                                    Critic_Score=str(df.loc[i, 'Critic_Score']),
                                    RunTime=str(df.loc[i, 'Runtime']))
            writer.commit()
            self.indexer = indexer


if __name__ == '__main__':
    global theWhooshSearch
    theWhooshSearch = WhooshSearch()
    theWhooshSearch.index()
