from .BKTree_Node import BKTreeNode


class BKTree(object):
    def __init__(self, vocabulary, root_index, isMaster=False, small_tree_tolerance=2):
        # loop through the vocabulary constructing a tree with root word at vocabulary[root_index]
        self.isMaster = isMaster
        self.small_tree_tolerance = small_tree_tolerance
        self.found_autocorrect_tree = None
        if self.isMaster:
            # master tree is a tree of trees
            self.root = BKTreeNode(vocabulary[root_index].root.text, tree=vocabulary[root_index])
            for tree in vocabulary:
                # don't add the root twice
                if tree == vocabulary[root_index]:
                    continue
                self.add_word(tree.root.text, tree=tree)
        else:
            self.root = BKTreeNode(vocabulary[root_index])
            for word in vocabulary:
                # don't add the root twice!
                if word == vocabulary[root_index]:
                    continue
                self.add_word(word)

    def add_word(self, word, tree=None):
        self.add_node(self.root, BKTreeNode(word, tree=tree))

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
        if current_node.tree:
            print('child tree')
            current_node.tree.print_tree(current_node.tree.root)
        for node in current_node.children:
            self.print_tree(node)

    def autocorrect(self, word, tolerance):
        # if I'm the master tree, return the possibilities from the first tree found within tolerance
        if self.isMaster:
            # find the tree within tolerance + small_tree_tolerance
            self.found_autocorrect_tree = None
            self.autocorrect_helper_master(tolerance + self.small_tree_tolerance, self.root, BKTreeNode(word))

            # now autocorrect for the tree we just found
            if self.found_autocorrect_tree:
                return self.found_autocorrect_tree.autocorrect(word, tolerance)
            else:
                print('tree not found')
        else:
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

    def autocorrect_helper_master(self, tolerance, current_node, compare_node):
        # return the first tree found that is within the tolerance
        # tree is pass by reference, so it must start as an empty list
        if current_node is None or self.found_autocorrect_tree:
            return

        distance = current_node.edit_distance(compare_node)
        # is this the word?
        if distance <= tolerance:
            self.found_autocorrect_tree = current_node.tree
            return

        # check all the children, only recurse for ones within the range
        r = [distance - tolerance, distance + tolerance]
        for node in current_node.children:
            if r[0] <= node.distance_to_parent <= r[1]:
                self.autocorrect_helper_master(tolerance, node, compare_node)
