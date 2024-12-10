class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.canvas = document.getElementById('canvas');
        this.foundNode = null;  // To store the found node for highlighting
    }

    getHeight(node) {
        if (!node) return 0;
        return node.height;
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        return y;
    }

    insert(node, value) {
        if (!node) return new Node(value);

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && value < node.left.value) return this.rightRotate(node);
        if (balance < -1 && value > node.right.value) return this.leftRotate(node);
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(node, value) {
        if (!node) return node;

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                const minValueNode = this.getMinValueNode(node.right);
                node.value = minValueNode.value;
                node.right = this.delete(node.right, minValueNode.value);
            }
        }

        if (!node) return node;

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rightRotate(node);
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.leftRotate(node);
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    getMinValueNode(node) {
        while (node.left) node = node.left;
        return node;
    }

    find(node, value) {
        if (!node) return null;

        if (value === node.value) return node;
        if (value < node.value) return this.find(node.left, value);
        return this.find(node.right, value);
    }

    drawTree(node, x, y, dx) {
        if (node !== null) {
            node.x = x;
            node.y = y;
            this.drawTree(node.left, x - dx, y + 60, dx / 2);
            this.drawTree(node.right, x + dx, y + 60, dx / 2);
        }
    }

    drawNode(ctx, node) {
        const radius = 20;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node === this.foundNode ? 'yellow' : 'white';  // Highlight the found node
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value, node.x, node.y);

        ctx.closePath();
    }

    drawConnections(ctx, node) {
        if (node.left !== null) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.left.x, node.left.y);
            ctx.stroke();
            ctx.closePath();
            this.drawConnections(ctx, node.left);
        }

        if (node.right !== null) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node.right.x, node.right.y);
            ctx.stroke();
            ctx.closePath();
            this.drawConnections(ctx, node.right);
        }
    }

    // In-order traversal with node highlight and print values
    printTraversal(node, callback) {
        if (node === null) return;

        // Traverse left subtree
        this.printTraversal(node.left, callback);

        // Highlight current node and print its value
        this.foundNode = node;  // Highlight node
        redrawTree();
        callback(node.value);  // Print node value

        // Traverse right subtree
        this.printTraversal(node.right, callback);
    }
}

const avl = new AVLTree();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function addValue() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
        avl.root = avl.insert(avl.root, value);
        redrawTree();
    } else {
        alert("Please enter a valid number.");
    }
}

function deleteValue() {
    const value = parseInt(document.getElementById('deleteValue').value);
    if (!isNaN(value)) {
        avl.root = avl.delete(avl.root, value);
        redrawTree();
    } else {
        alert("Please enter a valid number.");
    }
}

function findValue() {
    const value = parseInt(document.getElementById('findValue').value);
    if (!isNaN(value)) {
        avl.foundNode = avl.find(avl.root, value);
        redrawTree();

        // Reset highlight after 3 seconds
        setTimeout(() => {
            avl.foundNode = null;
            redrawTree();
        }, 3000);
    } else {
        alert("Please enter a valid number.");
    }
}

function printTraversal() {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    // Start the traversal and print values
    avl.printTraversal(avl.root, (value) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = value;
        outputDiv.appendChild(paragraph);
    });
}

function redrawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (avl.root) {
        avl.drawTree(avl.root, canvas.width / 2, 30, canvas.width / 4);
        avl.drawConnections(ctx, avl.root);
        drawNodes(avl.root);
    }
}

function drawNodes(node) {
    if (node !== null) {
        avl.drawNode(ctx, node);
        drawNodes(node.left);
        drawNodes(node.right);
    }
}
