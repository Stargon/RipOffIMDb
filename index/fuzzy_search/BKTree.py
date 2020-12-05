from BKTree_Node import BKTreeNode
import csv


class BKTree(object):
    def __init__(self, vocabulary, root_index, decode_file_path=''):
        if decode_file_path == '':
            # loop through the vocabulary constructing a tree with root word at vocabulary[root_index]
            self.root = BKTreeNode(vocabulary[root_index])
            for word in vocabulary:
                # don't add the root twice!
                if word == vocabulary[root_index]:
                    continue
                self.add_word(word)
        else:
            self.decode_tree(decode_file_path)

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
        # collect the text for all children
        child_words = list()
        for node in current_node.children:
            child_words.append(node.text)

        print(current_node.text, current_node.distance_to_parent, child_words)

        # recurse for all children
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

    def encode_tree(self):
        encoding = list()
        self.encode_tree_helper(self.root, encoding)

        with open('encoded_tree.csv', 'w', encoding='utf-8', newline='\n') as file:
            writer = csv.writer(file)
            writer.writerow(encoding)

    def encode_tree_helper(self, current_node, encoding):
        if current_node is None:
            return
        encoding.append(current_node.text)
        encoding.append(str(current_node.distance_to_parent))
        encoding.append('C[')
        for child in current_node.children:
            self.encode_tree_helper(child, encoding)
        encoding.append('C]')

    def decode_tree(self, file_path):
        with open(file_path, 'r', encoding='utf-8', newline='\n') as file:
            reader = csv.reader(file)
            line = next(reader)
            self.root = self.decode_tree_helper(line)

    def decode_tree_helper(self, line):
        stack = []
        textStack = []
        current_node = None
        for element in line:
            if element.isnumeric() and current_node:
                current_node.distance_to_parent = int(element)
            elif element == 'C[':
                stack.append(current_node)
                stack.append(element)
                textStack.append(current_node.text)
                textStack.append(element)
                current_node = None
            elif element == 'C]':
                children = []
                node = stack.pop()
                textStack.pop()
                while node != 'C[':
                    children.append(node)
                    node = stack.pop()
                    textStack.pop()

                parent = stack.pop()
                parent.children = children
                stack.append(parent)
            else:
                # make new node
                current_node = BKTreeNode(element)
        return stack.pop()

