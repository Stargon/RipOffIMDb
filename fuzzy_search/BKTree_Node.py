class BKTreeNode(object):
    def __init__(self, text):
        self.text = text
        # BKTreeNode reference to parent
        self.parent = None
        # unknown number of children, must be a list
        self.children = []

    def editDistance(self, node):
        # returns the edit distance from this node to the input node
        # create a 2d array comparing the nodes
        distances = [[0 for i in range(len(self.text) + 1)] for j in range(len(node.text) + 1)]
        # set the first row and first column
        row_count = 0
        col_count = 0
        for i in range(len(distances)):
            for j in range(len(distances[i])):
                if i == 0:
                    distances[i][j] = row_count
                    row_count += 1
                if j == 0:
                    distances[i][j] = col_count
                    col_count += 1
        


def main():
    node1 = BKTreeNode('apple')
    node2=BKTreeNode('banana')
    node1.editDistance(node2)

if __name__ == '__main__':
    main()
