from BKTree_Node import BKTreeNode


class BKTree(object):
    def __init__(self, vocabulary, root_index):
        # loop through the vocabulary constructing a tree with root word at vocabulary[root_index]
        self.root = BKTreeNode(vocabulary[root_index])
        for word in vocabulary:
            # don't add the root twice!
            if word == vocabulary[root_index]:
                continue
            self.add_word(word)

    def add_word(self, word):
        self.add_node(self.root, BKTreeNode(word))

    def add_node(self, current_node, node):
        distance = node.edit_distance(current_node)
        # is my distance the same as any pre-existing children?
        for n in current_node.children:
            if n.distance_to_parent == distance:
                # recurse down the tree
                self.add_node(n, node)
                return

        # if there wasn't a match, add it to the children
        node.distance_to_parent = distance
        current_node.children.append(node)

    def print_tree(self, current_node):
        if current_node is None:
            return
        child_words = list()
        for node in current_node.children:
            child_words.append(node.text)
        print(current_node.text, current_node.distance_to_parent, child_words)
        for node in current_node.children:
            self.print_tree(node)

    def autocorrect(self, word, tolerance):
        possibilities = list()
        self.autocorrect_helper(tolerance, self.root, BKTreeNode(word), possibilities)
        return possibilities

    def autocorrect_helper(self, tolerance, current_node, compare_node, possibilities):
        if current_node is None:
            return
        # generate the range
        distance = current_node.edit_distance(compare_node)
        # if it's a good word, add it
        if distance <= tolerance:
            possibilities.append((current_node.text, distance))

        # check all the children, only recurse for ones within the range
        r = [distance - tolerance, distance + tolerance]
        for node in current_node.children:
            if r[0] <= node.distance_to_parent <= r[1]:
                self.autocorrect_helper(tolerance, node, compare_node, possibilities)


def main():
    vocabulary = ['neat', 'beat', 'beet', 'greet', 'skeet', 'havana', 'banana']
    tree = BKTree(vocabulary, 1)
    tree.print_tree(tree.root)
    print(tree.autocorrect('banana', 1))


if __name__ == '__main__':
    main()
