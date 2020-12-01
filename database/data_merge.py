import csv


def main():
    # read each file, clean it, put it master database
    with open("database_master.csv", 'a', newline='\n') as master:
        writer = csv.writer(master)
        writer.writerow(['id', 'image_url', 'page_url', 'Title', 'Actors', 'Production', 'Director', 'Release_date',
                         'Genre', 'Awards', 'Critic_Score', 'Runtime'])
        with open('imdb_movie_database_2.csv', 'r', newline='\n') as dumb:
            reader = csv.reader(dumb)
            next(reader)
            for row in reader:
                if row != '':
                    writer.writerow(row)


if __name__ == "__main__":
    main()
