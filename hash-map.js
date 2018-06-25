

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
    if(!index._deleted){
      this.length++;
    }

    this._slots[index] = {
      key,
      value,
      deleted: false
    };
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
  // loop through input string
  for(let i = 0; i < str.length; i++){
    // check if we've encountered this char before
    // get() returns an error if the key doesn't exist so must try it first
    try{
      let val = word.get(str[i]);
      if(val > 0){
        // if the value is 1 then set it to 0.
        // this indicates we've encounted this char an even number of times
        word.remove(str[i]);
        word.set(str[i], 0);
      } else {
        // if the value is 0 then set it to 1.
        // this indicates we've encounted this char an odd number of times
        word.remove(str[i]);
        word.set(str[i], 1);
      }
    } catch(err){
      // If this is the first occurance of that letter create a new slot
      // in the hash map with value = 1. And, add that char to unique characters string
      uniqueChars += str[i];
      word.set(str[i], 1);
    }
  }
  // To be a palindrome there can be no more than one character that appears an odd number of times
  // If there is a character that appears an odd number of times then the word must have an odd length
  let counter = 0;
  for(let i = 0; i < uniqueChars.length; i++){
    if(word.get(uniqueChars[i]) === 1){
      counter++;
    }
  }
  return counter === 0 || (counter === 1 && str.length%2 === 1) ? true : false;
}

const groupAnagrams = (words) => {

  /**
	 * for each word in words
	 * 	sort the characters
	 * 	hash to index in hashmap and push word to the array
	 * 		if it's a new sorted word then we add word to indexing array
	 *
	 * loop through indexing array, and push arrays to 'return' array
	 *
	 */

  const toReturn = [];
  const uniques = [];
  const anagrams = new HashMap();

  for(let word of words) {
    let sorted = word.split('').sort().join('');
    let val;

    try{
      val = anagrams.get(sorted);
      val.push(word);
      anagrams.remove(sorted);
      anagrams.set(sorted, val);
    }
    catch(err) {
      uniques.push(sorted);
      anagrams.set(sorted, [word]);
    }
  }

  for(let unique of uniques) {
    toReturn.push(anagrams.get(unique));
  }

  return toReturn;
};


function main() {
  // 1) Create a HashMap
  const lor = new HashMap();
  lor.set('Hobbit','Bilbo');
  console.log(lor);
  lor.set('Hobbit','Frodo');
  console.log(lor);
  lor.set('Wizard','Gandolf');
  lor.set('Human','Aragon');
  lor.set('Elf','Legolas');
  lor.set('Maiar','The Necromancer');
  lor.set('Maiar','Sauron');
  lor.set('RingBearer','Golum');
  lor.set('LadyOfLight', 'Galadriel');
  lor.set('HalfElven', 'Arwen');
  lor.set('Ent', 'Treebeard');
  console.log(lor);
  // console.log(lor.get('Maiar'));

  // 2) Palindromes
  // console.log(checkPalindrome('racecar')); // true
  // console.log(checkPalindrome('bilbo')); // false
  // console.log(checkPalindrome('north')); // false
  // console.log(checkPalindrome('dad')); // true
  // console.log(checkPalindrome('aaa')); // true

  // 2) Group Anagaramgs
  // const words = ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race','scoop']
  // console.log(groupAnagrams(words));

}

main();

module.exports = HashMap;
