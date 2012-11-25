function loadArrayBuffer(url, done) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function() {
    if (this.status === 200) {
      done(this.response);
    }
  };
  xhr.send();
  return xhr;
};

function matchArrayBuffer(buffer1, buffer2) {
  var b1 = new Uint8Array(buffer1),
  b2 = new Uint8Array(buffer2),
  len = b1.length;

  if (b1.length === b2.length ) {
    for (var i = 0; i < len; i++) {
      if (b1[i] !== b2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

test( "Loading archive", function() {
  var archive1 = new Archive(new ArrayBuffer());
  ok( archive1.buffer instanceof ArrayBuffer, "Passing ArrayBuffer in constructor" );

  stop();
  var archive2 = new Archive();
  archive2.load("files/test1.tar");
  setTimeout(function() {
    ok( archive2.buffer instanceof ArrayBuffer, "Loading ArrayBuffer through XHR" );


    var fileList = archive2.getFiles();

    loadArrayBuffer("files/file1", function(buffer){
      ok( matchArrayBuffer(buffer,fileList.getFile("file1").buffer), "Matching ArrayBuffer for test1.tar file1" );
    });

    loadArrayBuffer("files/file2.html", function(buffer){
      ok( matchArrayBuffer(buffer,fileList.getFile("file2.html").buffer), "Matching ArrayBuffer for test1.tar file2.html" );
    });



    start();

  }, 150 );


});

