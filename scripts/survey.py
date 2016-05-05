def get_lines(fname):
    f = open(fname, "r")
    lines = f.readlines()
    f.close()
    return lines

def process_chunk():
    #filler

for ln in get_lines("surveys.txt"):
    if (ln[0] == '~'):
        process_chunk()
