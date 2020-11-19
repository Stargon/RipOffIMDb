#!/usr/bin/python

import whoosh
import csv
import os.path
from whoosh.index import create_in, open_dir, exists_in, Index
from whoosh.fields import *
from whoosh.qparser import QueryParser, MultifieldParser, GtLtPlugin, query
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
            query = MultifieldParser(['Title', 'Actors'], schema=self.indexer.schema)
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

    def advancedSearch(self):
        ''' provides filters to search across multiple fields based on user input
        '''
        ''' Temporary section for testing without frontend '''
        Title = str(input('Enter Title: '))
        Actor = str(input('Enter Actor: '))
        Production = str(input('Enter Production Company: '))
        Director = str(input('Enter Director: '))
        Genre = str(input('Enter Genre: '))
        minRuntime = input('Enter minumum runtime: ')

        if not minRuntime:
            minRuntime = None
        else:
            minRuntime = int(minRuntime)
        ''' end of temp section '''

        # items passed to the frontend
        image_url = list()
        page_url = list()
        title = list()
        actors = list()
        production_company = list()
        genres = list()
        release_date = list()
        runtime = list()

        # reset filter before each search
        allow_q = None

        # currently title is a required field - we potentially do not want this
        # filter is case sensitive - convert all queries to lowercase before moving forward
        with self.indexer.searcher() as search:
            qp = qparser.QueryParser('Title', self.indexer.schema)
            user_q = qp.parse(Title)

            if Actor and Genre and Director and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Director', Director) and query.Term('Production', Production)
            elif Actor and Genre and Director:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Director', Director)
            elif Actor and Genre and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Genre', Genre) and query.Term('Production', Production)
            elif Actor and Director and Production:
                allow_q = query.Term('Actor', Actor) and query.Term('Director', Director) and query.Term('Production', Production)
            elif Genre and Director and Production:
                allow_q = query.Term('Genre', Genre) and query.Term('Director', Director) and query.Term('Production', Production)
            elif Actor and Genre:
                allow_q = query.Term('Genre', Genre) and query.Term('Actors', Actor)
            elif Actor and Director:
                allow_q = query.Term('Director', Director) and query.Term('Actors', Actor)
            elif Actor and Production:
                allow_q = query.Term('Production', Production) and query.Term('Actors', Actor)
            elif Genre and Director:
                allow_q = query.Term('Director', Director) and query.Term('Genre', Genre)
            elif Genre and Production:
                allow_q = query.Term('Production', Production) and query.Term('Genre', Genre)
            elif Production and Director:
                allow_q = query.Term('Director', Director) and query.Term('Production', Production)
            elif Actor:
                allow_q = query.Term('Actors', Actor)
            elif Director:
                allow_q = query.Term('Director', Director)
            elif Genre:
                allow_q = query.Term('Genre', Genre)
            elif Production:
                allow_q = query.Term('Production', Production)

            if allow_q:
                results = search.search(user_q, filter=allow_q)
            else:
                results = search.search(user_q)
            for x in results:
                print(x)

    def index(self):
        """ Establishes the whoosh database for the documents in our csv file
                Only indexes if a database does not already exist
                All fields of extracted data are indexed for the advanced search
                """
        # set up to only index once
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

        if not os.path.exists('indexdir'):
            os.mkdir('indexdir')

        if(exists_in('indexdir') != True):
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
            
        else:
            self.indexer = open_dir('indexdir')

if __name__ == '__main__':
    global theWhooshSearch
    theWhooshSearch = WhooshSearch()
    theWhooshSearch.index()
    
    while(1):
        searchType = str(input('basic search(b) or advanced search(a): '))
        if searchType == 'q':
            break
        elif searchType == 'a':
            theWhooshSearch.advancedSearch()
        else:
            query = input('Input a Query: ')
            results, size = theWhooshSearch.basicSearch(query)
            print('Number of results found: ' + str(size))
            for result in results:
                print(result[3])
