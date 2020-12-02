import pandas as pd
import csv


def main():
    words = list()
    with open('vocabulary.csv', 'w', encoding='utf-8', newline='\n') as vocab:
        writer = csv.writer(vocab)
        df = pd.read_csv('database_master.csv', engine='python')
        for index, row in df.iterrows():
            # title, actors, directors: 3, 4, 6
            title = str(row[3]).lower()
            actors = str(row[4]).lower()
            directors = str(row[6]).lower()
            title_words = title.split()
            actor_words = actors.split(',')
            director_words = directors.split(',')
            for word in title_words:
                if not words.__contains__(word):
                    words.append(word)
                    writer.writerow([word])
            for word in actor_words:
                if not words.__contains__(word):
                    words.append(word)
                    writer.writerow([word])
            for word in director_words:
                if not words.__contains__(word):
                    words.append(word)
                    writer.writerow([word])


if __name__ == '__main__':
    main()
