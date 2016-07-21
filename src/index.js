var _ = require("underscore"),
  Backbone = require("backbone"),
  Marionette = require("backbone.marionette"),
  Promise = require("promise"),
  request = require("superagent");

window._ = _;
window.Backbone = Backbone;
window.Marionette = Marionette;
window.Promise = Promise;
window.request = request;

function displayCodeExecution(templates, editor, targetId) {
  var parsedCode = templates["code-wrapper"]({
    code: editor.getValue(),
    targetId: targetId
  });


  try {
    eval(parsedCode);
  } catch (e) {
    document.getElementById(targetId).innerHTML = templates["error-template"]({
      message: e.message
    });
  }
}


function buildCodemirrorPreviewContainer(textArea, index) {
  var newDiv = document.createElement("div");
  newDiv.id = "js-codemirror-preview-" + index;
  newDiv.className = "js-codemirror-preview panel panel-default panel-body";
  textArea.parentNode.insertBefore(newDiv, textArea.nextSibling);
}


function buildCodemirrorContainer(templates, textArea, index) {
  var
    editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      mode: {
        name: "javascript",
        globalVars: true
      }
    }),
    targetId = "js-codemirror-preview-" + index;


  displayCodeExecution(templates, editor, targetId);


  editor.on("change", _.debounce(function(editor) {
    displayCodeExecution(templates, editor, targetId);
  }, 1000));
}


function buildCodemirrorExamples(templates) {
  var
    textAreaEditors = document.getElementsByClassName("js-codemirror-editor"),
    textArea;


  for (var i = 0; i < textAreaEditors.length; i++) {
    textArea = textAreaEditors[i];


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
  buildCodemirrorExamples(getTemplates());
}
