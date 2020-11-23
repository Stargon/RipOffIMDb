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
        # try to add to current node's children
        if current_node.right_child is None:
            current_node.right_child = node
            node.distance_to_parent = distance
        elif current_node.left_child is None:
            # compare first, might need to swap places
            if distance > current_node.right_child.distance_to_parent:
                current_node.left_child = current_node.right_child
                current_node.right_child = node
                node.distance_to_parent = distance
            elif distance == current_node.right_child.distance_to_parent:
                self.add_node(current_node.right_child, node)
            else:
                current_node.left_child = node
                node.distance_to_parent = distance

        # move down the tree
        else:
            if distance >= current_node.right_child.distance_to_parent:
                self.add_node(current_node.right_child, node)
            else:
                self.add_node(current_node.left_child, node)

    def print_tree(self, current_node):
        if current_node is None:
            print('NONE')
            return
        print(current_node.text, current_node.distance_to_parent)
        print('R')
        self.print_tree(current_node.right_child)
        print('L')
        self.print_tree(current_node.left_child)



def main():
    vocabulary = ['apple', 'banana', 'orange', 'grape', 'pie']
    tree = BKTree(vocabulary, 0)
    tree.print_tree(tree.root)


if __name__ == '__main__':
    main()
