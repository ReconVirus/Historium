export class BSTNode<T> {
    public left: BSTNode<T> | null;
    public right: BSTNode<T> | null;
    public parent: BSTNode<T> | null;
    constructor(public value: T) {
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}
export class BST<T> {
    protected root: BSTNode<T> | null;
    constructor() {
        this.root = null;
    }
    public insert(value: T): void {
        const newNode = new BSTNode(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        let lastDirection: 'left' | 'right' = 'right';
        while (true) {
            if (value < current.value) {
                lastDirection = 'left';
                if (current.left === null) {
                    current.left = newNode;
                    newNode.parent = current;
                    return;
                }
                current = current.left;
            } else if (value > current.value) {
                lastDirection = 'right';
                if (current.right === null) {
                    current.right = newNode;
                    newNode.parent = current;
                    return;
                }
                current = current.right;
            } else {
                if (lastDirection === 'left') {
                    if (current.left === null) {
                        current.left = newNode;
                        newNode.parent = current;
                        return;
                    }
                    current = current.left;
                } else {
                    if (current.right === null) {
                        current.right = newNode;
                        newNode.parent = current;
                        return;
                    }
                    current = current.right;
                }
            }
        }
    }
    public inOrder(): T[] {
        const result: T[] = [];

        function traverse(node: BSTNode<T> | null): void {
            if (node === null) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }
    public search(value: T): BSTNode<T> | null {
        let current = this.root;
        while (current !== null) {
            if (value === current.value) {
                return current;
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }
}
export class SplayTree<T> extends BST<T> {
    public insert(value: T): void {
        super.insert(value);
        this.splay(value);
    }
    public search(value: T): BSTNode<T> | null {
        const result = super.search(value);
        if (result !== null) {
            this.splay(value);
        }
        return result;
    }
    private splay(value: T): void {
        let current = this.root;
        while (current !== null && current.value !== value) {
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        if (current === null) return;
        while (current !== this.root) {
            if (current.parent === this.root) {
                // Zig step
                if (current === current.parent.left) {
                    this.rotateRight(current.parent);
                } else {
                    this.rotateLeft(current.parent);
                }
            } else if ((current === current.parent.left) === (current.parent === current.parent.parent.left)) {
                // Zig-zig step
                if (current === current.parent.left) {
                    this.rotateRight(current.parent.parent);
                    this.rotateRight(current.parent);
                } else {
                    this.rotateLeft(current.parent.parent);
                    this.rotateLeft(current.parent);
                }
            } else {
                // Zig-zag step
                if (current === current.parent.left) {
                    this.rotateRight(current.parent);
                    this.rotateLeft(current.parent);
                } else {
                    this.rotateLeft(current.parent);
                    this.rotateRight(current.parent);
                }
            }
        }
    }
    private rotateLeft(node: BSTNode<T>): void {
        const right = node.right;
        node.right = right.left;
        if (right.left !== null) right.left.parent = node;
        right.parent = node.parent;
        if (node.parent === null) {
            this.root = right;
        } else if (node === node.parent.left) {
            node.parent.left = right;
        } else {
            node.parent.right = right;
        }
        right.left = node;
        node.parent = right;
    }
    private rotateRight(node: BSTNode<T>): void {
        const left = node.left;
        node.left = left.right;
        if (left.right !== null) left.right.parent = node;
        left.parent = node.parent;
        if (node.parent === null) {
            this.root = left;
        } else if (node === node.parent.right) {
            node.parent.right = left;
        } else {
            node.parent.left = left;
        }
        left.right = node;
        node.parent = left;
    }
}