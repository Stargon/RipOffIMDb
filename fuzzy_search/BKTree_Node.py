class BKTreeNode(object):
    def __init__(self, text):
        self.text = text
        # BKTreeNode reference to parent
        self.parent = None
        # unknown number of children, must be a list
        self.children = []

    def minimum(self, numbers):
        x = numbers[0]
        for number in numbers:
            if number < x:
                x = number
        return x

    def editDistance(self, node):
        # returns the edit distance from this node to the input node
        # create a 2d array comparing the nodes
        distances = [[0 for i in range(len(self.text) + 1)] for j in range(len(node.text) + 1)]

        row_count = 0
        col_count = 0
        for i in range(len(distances)):
            for j in range(len(distances[i])):
                if i == 0:
                    # set first row
                    distances[i][j] = row_count
                    row_count += 1
                elif j == 0:
                    # set first column
                    distances[i][j] = col_count
                    col_count += 1
                else:
                    # fill out the array
                    # take the minimum of my surroundings
                    value = self.minimum([distances[i - 1][j], distances[i][j - 1], distances[i - 1][j - 1]])
                    # are the letters the same?
                    if self.text[j-1] != node.text[i-1]:
                        value += 1
                    # add to the distances
                    distances[i][j] = value

        return distances[-1][-1]


def main():
    node1 = BKTreeNode('apple')
    node2 = BKTreeNode('banana')
    print(node1.editDistance(node2))


if __name__ == '__main__':
    main()
