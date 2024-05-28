class Node {
  constructor (data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor (array) {
    this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b)); // remove duplicates and sort
  }

  buildTree (array) {
    if (array.length === 0) return null; // base case

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.buildTree(array.slice(0, mid));
    root.right = this.buildTree(array.slice(mid + 1));

    return root;
  }

  insert (value, root = this.root) {
    if (root === null) {
      root = new Node(value);
      return root;
    } // base case

    if (value < root.data) root.left = this.insert(value, root.left);
    else if (value > root.data) root.right = this.insert(value, root.right);

    return root;
  }

  deleteItem (value, root = this.root) {
    if (root === null) return null; // base case

    if (value < root.data) { // traverse through the tree to find the node to delete
      root.left = this.deleteItem(value, root.left);
    } else if (value > root.data) {
      root.right = this.deleteItem(value, root.right);
    } else { // found the node to delete
      if (root.left === null) return root.right; // left is null, thus only one child (right)
      else if (root.right === null) return root.left; // right is null, thus only one child (left)

      // otherwise, the node has two children - find the successor to replace
      root.data = this.minValue(root.right);
      root.right = this.deleteItem(root.data, root.right);
    }

    return root;
  }

  minValue (node) {
    let minv = node.data;
    while (node.left !== null) {
      minv = node.left.data;
      node = node.left;
    }
    return minv;
  }

  find (value, root = this.root) {
    if (root.data === value) return root;

    if (value < root.data) return this.find(value, root.left);
    else if (value > root.data) return this.find(value, root.right);
  }

  levelOrder (callback) {
    let queue = []; // using a queue, first in, first out
    let traversal = []; // to store the result (traversal in breadth-first level order)
    queue.push(this.root);

    while (queue.length > 0) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
      if (callback) callback(node); // if callback function is provided, call it for each node
      traversal.push(node.data);
    }

    if (!callback) return traversal;
  }

  // a depth-first, inorder traversal
  inOrder (callback, node = this.root, traversal = []) {
    if (node === null) return;

    this.inOrder(callback, node.left, traversal);
    callback ? callback(node) : traversal.push(node.data);
    this.inOrder(callback, node.right, traversal);

    if (!callback) return traversal;
  }

  // a depth-first, preorder traversal
  preOrder (callback, node = this.root, traversal = []) {
    if (node === null) return;

    callback ? callback(node) : traversal.push(node.data);
    this.inOrder(callback, node.left, traversal);
    this.inOrder(callback, node.right, traversal);

    if (!callback) return traversal;
  }

  // a depth-first, postorder traversal
  postOrder (callback, node = this.root, traversal = []) {
    if (node === null) return;

    this.inOrder(callback, node.left, traversal);
    this.inOrder(callback, node.right, traversal);
    callback ? callback(node) : traversal.push(node.data);
    
    if (!callback) return traversal;
  }

}

// provided utility print function
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const dataArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree = new Tree(dataArray);
prettyPrint(tree.root);
tree.insert(15);
prettyPrint(tree.root);
tree.deleteItem(4);
prettyPrint(tree.root);
prettyPrint(tree.find(6345));
console.log(tree.levelOrder());
console.log(tree.inOrder());
console.log(tree.preOrder());
console.log(tree.postOrder());