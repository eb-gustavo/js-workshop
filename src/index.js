var _ = require("underscore"),
  Promise = require("promise"),
  request = require("superagent");

window._ = _;
window.Promise = Promise;
window.request = request;

function displayCodeExecution(templates, editor, index) {
  var previewTargetId = "js-codemirror-preview-" + index,
    testResultTargetId = "js-codemirror-test-result-" + index,
    parsedCode = templates["code-wrapper"]({
      code: editor.getValue(),
      previewTargetId: previewTargetId,
      testResultTargetId: testResultTargetId
    });

  try {
    eval(parsedCode);
  } catch (e) {
    document.getElementById(previewTargetId).innerHTML = templates["error-template"]({
      message: e.message
    });
    document.getElementById(testResultTargetId).innerHTML = "";
  }
}

function buildCodemirrorPreviewContainer(textArea, index) {
  var newDiv = document.createElement("div");
  newDiv.id = "js-codemirror-preview-" + index;
  newDiv.className = "js-codemirror-preview panel panel-default panel-body";
  textArea.parentNode.insertBefore(newDiv, textArea.nextSibling);
}

function buildCodemirrorTestResultsContainer(textArea, index) {
  var newDiv = document.createElement("div");
  newDiv.id = "js-codemirror-test-result-" + index;
  newDiv.className = "js-codemirror-test-result panel panel-default panel-body";
  textArea.parentNode.insertBefore(newDiv, textArea.nextSibling);
}

function buildCodemirrorContainer(templates, textArea, index) {
  var editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      tabSize: 2,
      mode: {
        name: "javascript",
        globalVars: true
      }
    });

  displayCodeExecution(templates, editor, index);

  editor.on("change", _.debounce(function(editor) {
    displayCodeExecution(templates, editor, index);
  }, 1000));
}

function buildCodemirrorExamples(templates) {
  var textAreaEditors = document.getElementsByClassName("js-codemirror-editor"),
    textArea;

  for (var i = 0; i < textAreaEditors.length; i++) {
    textArea = textAreaEditors[i];

    buildCodemirrorTestResultsContainer(textArea, i);
    buildCodemirrorPreviewContainer(textArea, i);
    buildCodemirrorContainer(templates, textArea, i);
  }
}

function getTemplates() {
  var templates = document.getElementsByClassName("js-codemirror-template");

  return _.reduce(templates, function (result, template) {
    result[template.id] = _.template(template.innerHTML);
    return result;
  }, {});
}

window.onload = function() {
  request.get("/api/events?limit=50").end(function(err, res) {
    if (err) {
      console.log(err);
    } else {
      window.api_events = res.body.events;
      window.api_event = res.body.events[0];
      buildCodemirrorExamples(getTemplates());
    }
  });
}
