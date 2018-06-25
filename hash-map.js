

class HashMap {

  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) { //hash the key to find an appropriate index
    let hash = 5381;
    for (let i=0 ; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash; // make sure it's a 32-bit integer using the & operator on itself.
    }
    return hash >>> 0; //return a positive index
  }

  get(key) {
    const index = this._findSlot(key);
    if(this._slots[index] === undefined) {
      throw new Error('key error');
    }
    return this._slots[index].value;
  }
  
  // slot === undefined || slot.deleted
  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);

    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if(slot === undefined) {
      throw new Error('Key error');
    }

    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for(let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if(slot === undefined || slot.key === key) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    this.length = 0;
    this._slots = [];

    for(const slot of oldSlots) {
      if(slot !== undefined) {
        this.set(slot.key, slot.value);
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function checkPalindrome(str){
  const word = new HashMap();
  let uniqueChars = '';
  for(let i = 0; i < str.length; i++){
    try{
      let val = word.get(str[i]);
      if(val > 0){
        // console.log('found 1');
        word.remove(str[i]);
        word.set(str[i], 0);
      } else {
        // console.log('found 0');
        word.remove(str[i]);
        word.set(str[i], 1);
      }
    } catch(err){
      // console.log('found first occurance');
      uniqueChars += str[i];
      word.set(str[i], 1);
    }
  }

  let counter = 0;
  for(let i = 0; i < uniqueChars.length; i++){
    if(word.get(uniqueChars[i]) === 1){
      counter++;
    }
  }
  // console.log('counter: ' + counter);

  // console.log(word);
  return counter === 0 || (counter === 1 && str.length%2 === 1) ? true : false;
}


function main() {
  // 1) Create a HashMap
  // const lor = new HashMap();
  // lor.set('Hobbit','Bilbo');
  // console.log(lor);
  // lor.set('Hobbit','Frodo');
  // console.log(lor);
  // lor.set('Wizard','Gandolf');
  // lor.set('Human','Aragon');
  // lor.set('Elf','Legolas');
  // lor.set('Maiar','The Necromancer');
  // lor.set('Maiar','Sauron');
  // lor.set('RingBearer','Golum');
  // lor.set('LadyOfLight', 'Galadriel');
  // lor.set('HalfElven', 'Arwen');
  // lor.set('Ent', 'Treebeard');
  // console.log(lor);
  // console.log(lor.get('Maiar'));

  console.log(checkPalindrome('racecar'));
  console.log(checkPalindrome('bilbo'));
  console.log(checkPalindrome('north'));
  console.log(checkPalindrome('dad'));
  console.log(checkPalindrome('aaa'));

}

main();

module.exports = HashMap;
