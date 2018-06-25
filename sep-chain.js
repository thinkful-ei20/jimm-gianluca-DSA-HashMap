
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