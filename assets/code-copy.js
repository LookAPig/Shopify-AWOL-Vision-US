function copy() {
  var text = document.getElementById("cupon-code").innerText;
  var input = document.createElement('input');
  input.setAttribute('id', 'copyInput');
  input.setAttribute('value', text);
  document.getElementsByTagName('body')[0].appendChild(input);
  document.getElementById('copyInput').select();
  if (document.execCommand('copy')) {
    var copied = document.getElementById('cupon-code_button');
    copied.innerHTML = "Copied!";
  }
  document.getElementById('copyInput').remove();
}