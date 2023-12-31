/**
 * @param {*} str "items{food,clothes}"
 * @description handles parsing the first pair of curly braces,
 * @returns Array, ["items*",["food","clothes"]]
 */
function parseCurlyBrace(str) {
  let braceCount = 0;
  let splitIndex = 0;
  let modifiedStr = str; // Store the original string

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{") {
      braceCount++;
      if (braceCount === 1) {
        splitIndex = i;
      }
    } else if (str[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        modifiedStr =
          modifiedStr.slice(0, splitIndex) + "*" + modifiedStr.slice(i + 1);
        return [modifiedStr, str.slice(splitIndex + 1, i)];
      }
    }
  }

  return str;
}
/**
 * @param {*} str "items,people{count,names}"
 * @description handles parsing any comma not within curly brace,
 * @returns Array, ["items","people{count,names}"]
 */
function parseComma(inputString) {
  let result = [];
  let temp = "";
  let depth = 0;

  for (let i = 0; i < inputString.length; i++) {
    const char = inputString[i];

    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
    }

    if (char === "," && depth === 0) {
      result.push(temp.trim());
      temp = "";
    } else {
      temp += char;
    }
  }

  if (temp !== "") {
    result.push(temp.trim());
  }

  return result.length === 1 ? result[0] : result;
}

//handles creating the array representing the property access pattern
function createPaths(inputString) {
  let result = parseComma(inputString); // split by commas
  // if the result is an array of items, recurse through each entry
  // else if result is just a string, parse curly braces.
  if (Array.isArray(result)) {
    result = result.map((pathElement) => {
      const out = createPaths(pathElement);
      return out;
    });
  } else {
    result = parseCurlyBrace(inputString);
    // if the result is a string, recurse through each entry
    if (Array.isArray(result)) {
      result = result.map((pathElement) => {
        return createPaths(pathElement);
      });
    }
  }

  return result;
}
// handles reading and creating the selected object
function getSeletedObj(object, pathElements) {
  // first check if the pathElements is an array,
  // if it isnt,return the value of the objects key
  if (Array.isArray(pathElements)) {
    let i = 0;
    let result = {}; // the returning object
    while (i < pathElements.length) {
      const pe = pathElements[i];
      // debugger;
      if (Array.isArray(pe)) {
        const res2 = getSeletedObj(object, pe);
        const key = Object.keys(res2)[0];
        result[key] = res2[key];
        i++;
      } else {
        // when an astrisx exist, the program knows there is an array of items
        // proceeding in the array. when this occurs we can trigger an event to recurse.
        if (pe.includes("*")) {
          const paths = pathElements[i + 1];
          const key = pe.slice(0, -1);
          const data = getSeletedObj(object[key], paths);
          result[key] = data;
          i += 2;
        } else {
          result[pe] = object[pe];
          i++;
        }
      }
    }
    return result;
  } else {
    let result = {};
    result[pathElements] = object[pathElements];
    return result;
  }
}

let memoSchema = {};

function select(obj, schema) {
  let pathsArray;
  // check if this schema has already been used before. use cache value to save time.
  if (memoSchema[schema]) {
    pathsArray = memoSchema[schema];
  } else {
    pathsArray = createPaths(schema);
    memoSchema[schema] = pathsArray;
  }
  const result = getSeletedObj(obj, pathsArray);
  return result;
}

module.exports = select;
