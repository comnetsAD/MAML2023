import subprocess
from pymongo import MongoClient
from pymongo.collection import Collection

# Connect to the MongoDB server
client = MongoClient('mongodb://localhost:27017/')

# Select the 'maml' database and the 'pages' collection
db = client['maml']
pages: Collection = db['pages']

# Load saved URLs from a local file


def load_saved_urls(filename):
    try:
        with open(filename, 'r') as file:
            return set(line.strip() for line in file)
    except FileNotFoundError:
        return set()

# Save a new URL to the local file


def save_url(filename, url):
    with open(filename, 'a') as file:
        file.write(url + '\n')


# File to store saved URLs
saved_urls_file = 'saved_urls.txt'
saved_urls = load_saved_urls(saved_urls_file)

# Function to process a document


def process_document(document):
    url = document['url']
    if url not in saved_urls:
        print(f"New URL found: {url}")
        save_url(saved_urls_file, url)
        saved_urls.add(url)

        # Run the scraper.py script on a separate process with the URL as a parameter
        subprocess.Popen(['python', 'scraper.py', url])


# Scan through all existing documents in the collection
for document in pages.find():
    process_document(document)

# Listen to the 'pages' collection for new insertions only
with pages.watch() as stream:
    for change in stream:
        if change['operationType'] == 'insert':
            new_document = change['fullDocument']
            process_document(new_document)
