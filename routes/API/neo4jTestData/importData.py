import sys
import os
import json
from neo4j import GraphDatabase

URI      = "neo4j://192.168.99.100:7687"
USERNAME = "neo4j"
PASSWORD = "s3cr3t"

PATH = "./Archive/"

class neo4jClient:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def query(self, query, data=None):
        with self.driver.session() as session:
            session.run(query, data)

    def addUser(self, tweet):
        with self.driver.session() as session:
            result = session.run("MATCH (n:tweet {id_str:$id_str}) RETURN n", id_str=tweet["id_str"])
            if result.single() == None:

                if (not ("status" in tweet)):
                    tweet["status"] = {
                        "full_text": "Not found",
                        "created_at": "Not found"
                    }
                session.run("CREATE (n:tweet {id_str: $id_str, name: $name, full_text: $full_text, created_at: $created_at})", {
                    "id_str": tweet["id_str"],
                    "full_text": tweet["status"]["full_text"],
                    "name": tweet["name"],
                    "created_at": tweet["status"]["created_at"]
                })

def findDirs(dirpath):
    dirs = []
    for (dirpath, dirnames, filenames) in os.walk(dirpath):
        dirs.extend(dirnames)
        break

    return dirs

def createJSONFile(fileIn, fileOut):
    with open(fileIn, 'r', encoding='utf-8') as usersFile, open(fileOut, "w", encoding='utf-8') as outFile:
        outFile.write("[\n")
        lines = usersFile.readlines()
        for i in range(len(lines) - 1):
            outFile.write(lines[i][:-1] + ",\n")
        outFile.write(lines[-1][:-1] + "\n")
        outFile.write("]\n")

def findRetweetTimes(CSVfile):
    ret = {}
    with open(CSVfile, "r", encoding="utf-8") as file:

        for i, line in enumerate(file.readlines()):
            if(i > 0):
                split = line.split(",")
                ret[split[0]] = split[1][:-1]

    return ret

def main():
    client = neo4jClient(URI, USERNAME, PASSWORD)

    # Delete all data
    client.query("MATCH (n) DETACH DELETE n")

    for dir in findDirs(PATH):
        createJSONFile(PATH + dir + "/users.json", "tmp.json")

        with open('tmp.json', encoding="utf-8") as json_file:
            tweetData = json.load(json_file)

            for tweet in tweetData:
                client.addUser(tweet)

        os.remove("tmp.json")

        retweetTimes = findRetweetTimes(PATH + dir + "/nodes.csv")

        with open(PATH + dir + "/edges.csv", "r", encoding="utf-8") as edges:

            for i, edge in enumerate(edges.readlines()):
                if (i > 0):
                    split = edge.split(",")
                    src = split[0]
                    trg = split[1][:-1]

                    time = retweetTimes[src]

                    client.query("MATCH (a:tweet {id_str: $src}) MATCH (b:tweet {id_str: $trg}) CREATE (a)-[:retweet {time:$time}]->(b)", {
                        "src": src,
                        "trg": trg,
                        "time": time
                    })

        break

    client.close()

if __name__ == "__main__":
    main()
