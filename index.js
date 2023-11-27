// very basic function which handles finding first pair of curly braces in a string
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
// very basic function which splits the string on all commas not** inside a curly braces
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

//handles creating the array paths
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
// handles creating the serialized object
function createObject(object, pathElements) {
  // first check if the pathElements is an array,
  // if it isnt,return the value of the objects key
  if (Array.isArray(pathElements)) {
    let i = 0;
    let result = {}; // the returning object
    while (i < pathElements.length) {
      const pe = pathElements[i];
      // debugger;
      if (Array.isArray(pe)) {
        const res2 = createObject(object, pe);
        const key = Object.keys(res2)[0];
        result[key] = res2[key];
        i++;
      } else {
        // when an astrisx exist, the program knows there is an array of items
        // proceeding in the array. when this occurs we can trigger an event to recurse.
        if (pe.includes("*")) {
          const paths = pathElements[i + 1];
          const key = pe.slice(0, -1);
          const data = createObject(object[key], paths);
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

let memoShape = {};
export const serializeData = {
  createPaths: (shape) => {
    if (memoShape[shape]) {
      return memoShape[shape];
    }

    const paths = createPaths(shape);
    memoShape[shape] = paths;
    return paths;
  },
  serialize: (obj, paths) => {
    const result = createObject(obj, paths);
    return result;
  },
};
