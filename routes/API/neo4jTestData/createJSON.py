import sys
import os
import json

def main():
    if(len(sys.argv) < 2 or sys.argv[1] == "help"):
        print("Usage <tweetid>")
        print("Specify an tweeter id found in the folder in Archive")
        exit(0);

    tweet = sys.argv[1]

    with open('./Archive/' + tweet + '/users.json', 'r', encoding='utf-8') as usersFile, open("tmp.json", "w", encoding='utf-8') as outFile:
        outFile.write("[\n")
        lines = usersFile.readlines()
        for i in range(len(lines) - 1):
            outFile.write(lines[i][:-1] + ",\n")
        outFile.write(lines[-1][:-1] + "\n")
        outFile.write("]\n")

    data = {}

    with open('tmp.json', encoding="utf-8") as json_file:
        data["users"] = json.load(json_file)

    os.remove("tmp.json")

    with open('out.json', 'w', encoding='utf-8') as outFile:
        json.dump(data, outFile)

if __name__ == "__main__":
    main()
