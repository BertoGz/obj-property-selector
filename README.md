# obj-property-selector
A library that allows you to extract properties from objects using schema strings.
useful for serializing data.

### Usage
Import the select function from this module.
Call the select function with the object to be processed and a schema string.
The function will return the result object according to the provided schema.

### schema strings: 
```"property{subProperty},otherProperty"```
<br/>schema strings should follow the shape of the object you are trying to process. 
passing a string that incorrectly matches the object will generate incorrect result. 

examples:
- `"places,people"` will extract the values "places" and "people" from the object.
- `"places{sanDiego},people"` will perform the same operation but only return the property "sanDiego".
- `"places{sanDiego{cityName,population},people"` will perform the same operation but only return the city-name and population properties.

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
