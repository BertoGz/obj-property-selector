# obj-property-selector
A library that allows you to extract properties from objects using object notation.
useful for serializing data.

### Usage
1. Import the `select` function from this module.
2. Call the `select` function with the object to be processed and an object notation string.
3. The function will return the result object according to the provided notation string.


### Object Notation Strings
Ensure that Notation strings mirror the structure of the object you are processing. Supplying a string that doesn't accurately correspond to the object structure may result in incorrect outcomes.

### Examples
- `"places,people"` will extract the values "places" and "people" from the object.
- `"places{sanDiego},people"` will return the "places" Object but only extracting "san diego" in it as well as "people" object.
- `"places{sanDiego{cityName,population},people"` will perform the same operation as above but only extract the "cityName" and "population" props from within "san diego".

# Code Sample
```
const select = require('obj-property-selector');

const obj = {
  items: {
    food: ['apple', 'banana'],
    clothes: ['shirt', 'pants']
  },
  people: {
    count: 5,
    names: ['Alice', 'Bob', 'Charlie']
  }
};

const schema = 'items,people{count}';
const newObj = select(obj, schema);

console.log(newObj);
