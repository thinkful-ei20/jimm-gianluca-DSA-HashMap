class _Node {
  constructor(value, next){
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor(){
    this.head = null;
  }

  insertFirst(item){
    this.head = new _Node(item, this.head);
  }

  insertLast(item){
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while(tempNode.next!==null){
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertBefore(before, item){
    if(!this.head){
      console.log('List is empty. Nothing to insert before.');
      return;
    }
    // if before is the first value
    if(this.head.value === before){
      this.insertFirst(item);
      return;
    }
    let cNode = this.head; 
    let pNode = this.head;
    while((cNode !== null) && (cNode.value !== before)){
      pNode = cNode;
      cNode = cNode.next;
    }
    if (cNode === null) {
      console.log('Before ttem not found. Could not insert.');
      return;
    } else {
      pNode.next = new _Node(item, cNode);
    }
  }

  insertAfter(after, item){
    if(!this.head){
      console.log('List is empty. Nothing to insert before.');
      return;
    }
    if(this.head.next === null){
      this.insertLast(item);
      return;
    }
    let aNode = this.head; 
    let pNode = this.head;
    while((aNode !== null) && (aNode.value !== after)){
      pNode = aNode;
      aNode = aNode.next;
    }
    pNode = pNode.next;
    aNode = aNode.next;
    if (aNode === null) {
      console.log('After item not found. Could not insert.');
      return;
    } else {
      pNode.next = new _Node(item, aNode);
    }
  }

  insertAt(pos, item){
    if(pos === 0){
      this.insertFirst(item);
      return;
    }
    let cNode = this.head; 
    for(let i = 0; i < pos; i++){
      cNode = cNode.next;
      if(cNode.next === null){
        console.log('position is outside of list');
        return;
      }
    }
    if (cNode === null) {
      this.insertLast(item);
      return;
    } else {
      this.insertBefore(cNode, item);
    }
  }

  // model like `insert` later on
  remove(item){
    // If no list, no delete
    if(!this.head){
      return null;
    }
    // If removing first item, change the head
    if(this.head.value.key===item){
      this.head = this.head.next;
      return;
    }
    // If not at the head, traverse the list until you find the item,
    // or until you reach the end of the list
    let cNode = this.head; 
    let pNode = this.head;
    while((cNode !== null) && (cNode.value.key !== item)){
      pNode = cNode;
      cNode = cNode.next;
    }
    if (cNode === null) {
      console.log('Item not found. Could not delete.');
      return;
    } else {
      pNode.next = cNode.next;
    }
  }

  find(item){
    let cNode = this.head;
    if(!this.head){
      return null;
    }
    while((cNode.value.key !== item)){
      if(cNode.next === null){
        console.log('Item not found.');
        return false;
      } else {
        cNode =cNode.next;
      }  
    }
    return cNode;
  }
}

module.exports = LinkedList;