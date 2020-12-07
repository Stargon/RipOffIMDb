import pandas as pd
import csv
import nltk
from nltk.corpus import stopwords


def main():
    words = list()
    with open('vocabulary_2.csv', 'w', encoding='utf-8', newline='\n') as vocab2:
        writer=csv.writer(vocab2)
        with open('vocabulary.csv', 'r', encoding='utf-8', newline='\n') as vocab:
            reader=csv.reader(vocab)
            for row in reader:
                if row[0] not in stopwords.words('english') and row[0] not in stopwords.words('spanish') and row[0] not in stopwords.words('german'):
                    writer.writerow([row[0]])

if __name__ == '__main__':
    main()
