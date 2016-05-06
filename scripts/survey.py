class Leaf:
    def __init__(self, di):
        self.di = di
        self.lzt = []
        self.hits = 0
        
    def add(self, trail):
        self.hits += 1

        if len(trail) < 1:
            return
        
        for x in self.lzt:
            if (x.di == trail[0]):
                x.add(trail[1:])
                return
        bud = Leaf(trail[0])
        bud.add(trail[1:])
        self.lzt.append(bud)
        return

    def princ(self, n):
        print("\t"*n + self.di + ": " + str(self.hits))
        for i in self.lzt:
            i.princ(n+1)

class Tree:
    def __init__(self):
        self.root = Leaf("")

    def add(self, trail):
        self.root.add(trail)

    def princ(self):
        for i in self.root.lzt:
            i.princ(0)

def get_lines(fname):
    f = open(fname, "r")
    lines = f.readlines()
    f.close()
    return lines

oak = Tree()

for ln in get_lines("surveys.txt"):
    if (not(ln[0] == '~')):
        qa = ln[:-1].split("~")
        oak.add(qa)

oak.princ()
