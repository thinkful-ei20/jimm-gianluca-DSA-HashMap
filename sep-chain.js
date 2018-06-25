const LinkedList = require('./LinkedList');

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
		return this._slots[index].find(key).value;
	}

	set(key, value) {
		const loadRatio = (this.length + this._deleted + 1) / this._capacity;
		if (loadRatio > HashMap.MAX_LOAD_RATIO) {
			this._resize(this._capacity * HashMap.SIZE_RATIO);
		}

		const index = this._findSlot(key);
		if(this._slots[index] === undefined){
			this._slots[index] = new LinkedList();
			this._slots[index].insertFirst({key, value});
			this.length++;
		} else {
			if(this._slots[index].find(key)){
				this._slots[index].remove(key);
			}
			this._slots[index].insertLast({key, value});
		}
	}

	remove(key) {
		const index = this._findSlot(key);
		const slot = this._slots[index];
		if(slot === undefined) {
			throw new Error('Key error');
		}
		// remove from linked-list
		slot.remove(key);
		if(slot.head === null) {
			console.log('I ran!');
			this.length--;
			this._deleted++;
		}
	}

	_findSlot(key) {
		const hash = HashMap._hashString(key);
		const start = hash % this._capacity;
		return start;

		// for(let i = start; i < start + this._capacity; i++) {
		//   const index = i % this._capacity;
		//   const slot = this._slots[index];
		//   if(slot === undefined) {
		//     return index;
		//   }
		// }
	}

	_resize(size) {
		const oldSlots = this._slots;
		this._capacity = size;
		this.length = 0;
		this._slots = [];
		this._deleted = 0;

		for(const slot of oldSlots) {
			if(slot !== undefined) {
				let current = slot.head;
				while(current !== null) {
					this.set(current.value.key, current.value.value);
					current = current.next;
				}
			}
		}
	}
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
	// const lor = new HashMap();
	// lor.set('Hobbit','Bilbo');
	//console.log(lor.get('Hobbit'));

	// lor.set('Hobbit','Frodo');
	// console.log(lor.get('Hobbit'));

	// lor.set('Wizard','Gandolf');
	// lor.set('Human','Aragon');
	// lor.set('Elf','Legolas');

	// console.log(JSON.stringify(lor, null, 2));

	// remains in the hash map until next resize
	// lor.remove('Hobbit');

	// lor.set('Maiar','The Necromancer');
	// lor.set('Maiar','Sauron');
	// lor.set('RingBearer','Golum');
	// lor.set('LadyOfLight', 'Galadriel');
	// lor.set('HalfElven', 'Arwen');
	// lor.set('Ent', 'Treebeard');

	// try{
	//   console.log(lor.get('Hobbit'));
	// } catch(err){
	//   console.log('`lor.get(`Hobbit`)` threw an error, must not exist');
	// }
	// console.log(JSON.stringify(lor, null, 2));

	// lor.remove('Wizard');
	// lor.remove('Human');
	// lor.remove('RingBearer');

	// console.log(JSON.stringify(lor, null, 2));

	// console.log(lor.get('Maiar'));
	// console.log(lor.get('Wizard'));
}

main();