import csv


def main():
    words=list()
    with open('vocabulary.csv', 'w', newline='\n') as vocab:
        writer=csv.writer(vocab)
        with open('database_master.csv', 'r', newline='\n') as data:
            reader = csv.reader(data)
            next(reader)
            for row in reader:
                # title, actors, directors: 3, 4, 6
                title = row[3]
                actors=row[4]
                directors=row[6]
                title_words=title.split()
                actor_words=actors.split()
                director_words=directors.split()
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
