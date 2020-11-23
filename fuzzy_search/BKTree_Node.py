class BKTreeNode(object):
    def __init__(self, text):
        self.text = text
        self.left_child = None
        self.right_child = None
        self.distance_to_parent=0

    def minimum(self, numbers):
        x = numbers[0]
        for number in numbers:
            if number < x:
                x = number
        return x

    def edit_distance(self, node):
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
                    if self.text[j - 1] != node.text[i - 1]:
                        value += 1
                    # add to the distances
                    distances[i][j] = value

        return distances[-1][-1]
