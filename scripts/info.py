def get_lines(fname):
    f = open(fname, "r")
    lines = f.readlines()
    f.close()
    return lines

for ln in get_lines("data/infos.txt"):
    words = ln.split()
    i =  len(words)-3
    print("Name: ", " ".join(words[0:i]))
    print("Age: ", words[i])
    print("Activity: ", words[i+1])
    print("Date: ", words[i+2])
