var textArea = document.getElementById("textArea");
var beautifyButton = document.getElementById("beautifyButton");
var minifyAreaButton = document.getElementById("minifyAreaButton");
var decodeButton = document.getElementById("decodeButton");
var encodeButton = document.getElementById("encodeButton");
var formatButton = document.getElementById("formatButton");
var runButton = document.getElementById("runButton");
var consoleArea = document.getElementById("consoleArea");
var clearConsoleButton = document.getElementById("clearConsoleButton");
var ctrlIsPressed = false;

function beautifyJson(json) {
  var brackets = new RegExp("^]|^\\[");
  var braces = new RegExp("^}|^\\{");
  var formatted = "";

  // if first and last chars start with a bracket - parse, stringify and return it.
  if (brackets.test(json) || braces.test(json)) {
    return JSON.stringify(JSON.parse(json), null, 3);
  } else {
    try {
      formatted = JSON.stringify(JSON.parse(json.substring(1, json.length - 1)), null, 3);
      return formatted;
    } catch (err) {
      return json;
    }
  }
}

function log(value) {
  return value;
}

function run() {
  try {
    var code = textArea.value;
    consoleArea.value = eval(code);
  } catch (error) {
    consoleArea.value = log(error);
  }
}

runButton.onclick = function(e) {
  run();
};

formatButton.onclick = function(e) {
  try {
    var str = textArea.value;
    var pattern = /^{|^,|\s+,|\s{|\s]/g;
    var match;
    var indexes = [];

    while ((match = pattern.exec(str))) {
      indexes.push(match.index);
    }

    var res = indexes
      .map(function(index, i, arr) {
        return textArea.value.substring(index, arr[i + 1]);
      })
      .map(function(row) {
        var matched = row.match(/\s+\d+\s+\d+:\d+:\d+\.\d+/);
        var junk = matched[0];
        var input = matched.input;
        return input.substring(0, input.indexOf(junk));
      })
      .join("");

    textArea.value = beautifyJson(res);
  } catch (error) {
    consoleArea.value = log(error);
  }
};

encodeButton.onclick = function(e) {
  textArea.value = encodeURIComponent(textArea.value);
};

decodeButton.onclick = function(e) {
  textArea.value = decodeURIComponent(textArea.value);
};

minifyAreaButton.onclick = function(e) {
  try {
    var brackets = new RegExp("^]|^\\[");
    var braces = new RegExp("^}|^\\{");

    if (brackets.test(textArea.value) || braces.test(textArea.value)) {
      textArea.value = JSON.stringify(JSON.parse(textArea.value));
    }
  } catch (error) {
    consoleArea.value = log(error);
  }
};

beautifyButton.onclick = function(e) {
  var value = textArea.value;
  textArea.value = beautifyJson(value);
};

textArea.onkeydown = function(e) {
  console.log("key down");
  if (e.keyCode === 17) {
    ctrlIsPressed = true;
    console.log("ctrl is pressed:" + ctrlIsPressed);
    textArea.onkeydown = function(e) {
      if (e.keyCode === 13 && ctrlIsPressed) {
        run();
        console.log("ctrl is pressed:" + ctrlIsPressed);
      }
    };
  }
  if (e.keyCode === 9) {
    e.preventDefault();
    textArea.value = textArea.value + "   ";
  }
};

textArea.onkeyup = function(e) {
  if (e.keyCode === 17) {
    ctrlIsPressed = false;
    console.log("ctrl is pressed:" + ctrlIsPressed);
  }
};

clearConsoleButton.onclick = function(e) {
  consoleArea.value = "";
};
